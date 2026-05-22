"""
Lingua AI language teacher — voice-only Vision Agent.

Uses Gemini Live for speech and Stream Edge for transport.
Loads STREAM_* and GOOGLE_API_KEY (or GEMINI_API_KEY) from the parent
.env.local (or .env) and vision-agent/.env.

Run (development):
  uv run main.py run

Run (HTTP server for the Expo app, step 15):
  uv run main.py serve --host 127.0.0.1 --port 8000
"""

from __future__ import annotations

import logging
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from vision_agents.core import Agent, AgentLauncher, Runner, User
from vision_agents.core.instructions import Instructions
from vision_agents.plugins import gemini, getstream

from call_permissions import ensure_agent_can_publish
from live_captions import register_live_captions
from lesson_context import (
    build_opening_prompt,
    build_teacher_instructions,
    parse_lesson_context,
)

ROOT_DIR = Path(__file__).resolve().parent.parent
AGENT_DIR = Path(__file__).resolve().parent

# Live model with native audio — free tier eligible on Google AI Studio.
# Default matches vision-agents gemini.Realtime; override via GEMINI_LIVE_MODEL.
GEMINI_LIVE_MODEL = os.getenv(
    "GEMINI_LIVE_MODEL",
    "gemini-2.5-flash-native-audio-preview-12-2025",
)


def load_env() -> None:
    """Load Stream/Gemini keys from parent repo (Expo uses .env.local) and local overrides."""
    for path in (
        ROOT_DIR / ".env",
        ROOT_DIR / ".env.local",
        AGENT_DIR / ".env",
    ):
        if path.is_file():
            load_dotenv(path, override=True)


def resolve_google_api_key() -> str:
    """Accept GOOGLE_API_KEY or GEMINI_API_KEY (Vision Agents default is GOOGLE_API_KEY)."""
    for name in ("GOOGLE_API_KEY", "GEMINI_API_KEY"):
        value = os.getenv(name, "").strip()
        if value:
            if name == "GEMINI_API_KEY" and not os.getenv("GOOGLE_API_KEY", "").strip():
                os.environ["GOOGLE_API_KEY"] = value
            return value
    return ""


def require_env() -> None:
    missing: list[str] = []
    if not os.getenv("STREAM_API_KEY", "").strip():
        missing.append("STREAM_API_KEY")
    if not os.getenv("STREAM_API_SECRET", "").strip():
        missing.append("STREAM_API_SECRET")
    if not resolve_google_api_key():
        missing.append("GOOGLE_API_KEY (or GEMINI_API_KEY)")

    if not missing:
        return

    print(
        "Missing required environment variables: "
        + ", ".join(missing)
        + "\n\nAdd them to the project root .env.local (or vision-agent/.env):\n"
        "  STREAM_API_KEY=...\n"
        "  STREAM_API_SECRET=...\n"
        "  GOOGLE_API_KEY=...   # from https://aistudio.google.com/apikey\n",
        file=sys.stderr,
    )
    raise SystemExit(1)


load_env()
require_env()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

AGENT_USER_ID = "lingua-ai-teacher"
AGENT_USER_NAME = "Lingua Teacher"

DEFAULT_INSTRUCTIONS = build_teacher_instructions(None)


async def create_agent(**kwargs) -> Agent:
    """Factory: voice-only teacher with Gemini Live on Stream Edge."""
    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name=AGENT_USER_NAME, id=AGENT_USER_ID),
        instructions=DEFAULT_INSTRUCTIONS,
        llm=gemini.Realtime(
            model=GEMINI_LIVE_MODEL,
            fps=1,
            api_key=resolve_google_api_key() or None,
        ),
    )


async def _load_call_custom(call) -> dict | None:
    try:
        response = await call.get()
    except Exception as error:
        logger.warning("Could not load call custom data: %s", error)
        return None

    payload = getattr(response, "data", None)
    if payload is None:
        return None

    call_data = getattr(payload, "call", None)
    if call_data is None:
        return None

    custom = getattr(call_data, "custom", None)
    if custom is None and isinstance(call_data, dict):
        custom = call_data.get("custom")

    return custom if isinstance(custom, dict) else None


def _friendly_join_error(error: Exception) -> str:
    message = str(error).lower()
    if "resource_exhausted" in message or "quota" in message:
        return (
            "Gemini API quota exceeded. Check usage at "
            "https://aistudio.google.com/ or enable billing on Google AI."
        )
    if "rate_limit" in message or "429" in message:
        return "Gemini rate limit reached. Wait a moment and try again."
    if "api key" in message or "permission_denied" in message or "401" in message:
        return (
            "Invalid or missing Google API key. Set GOOGLE_API_KEY or GEMINI_API_KEY "
            "from https://aistudio.google.com/apikey"
        )
    return str(error)


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    """Join the Stream call, apply lesson context from custom data, greet the learner."""
    try:
        call = await agent.create_call(call_type, call_id)
        await ensure_agent_can_publish(call, call_type)

        custom = await _load_call_custom(call)
        if not custom:
            logger.warning("No lesson custom data on call %s — using default teacher prompt", call_id)

        context = parse_lesson_context(custom)
        agent.instructions = Instructions(build_teacher_instructions(context))

        opening_prompt = build_opening_prompt(context)
        lesson_title = context.lesson_title if context else "default"
        language_name = context.language_name if context else "target language"
        learner_name = context.user_name if context else "the learner"
        logger.info(
            "Joining call %s (%s) — lesson: %s, language: %s, learner: %s, goals: %s, model: %s",
            call_id,
            call_type,
            lesson_title,
            language_name,
            learner_name,
            len(context.goals) if context else 0,
            GEMINI_LIVE_MODEL,
        )

        register_live_captions(agent)

        async with agent.join(call):
            await agent.simple_response(opening_prompt, interrupt=True)
            await agent.finish()
    except Exception as error:
        logger.error(
            "Agent failed to join call %s (%s): %s",
            call_id,
            call_type,
            _friendly_join_error(error),
        )


if __name__ == "__main__":
    launcher = AgentLauncher(
        create_agent=create_agent,
        join_call=join_call,
        max_sessions_per_call=1,
        agent_idle_timeout=120.0,
    )
    Runner(launcher).cli()
