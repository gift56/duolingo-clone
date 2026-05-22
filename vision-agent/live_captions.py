"""Broadcast realtime speech transcripts to call participants as Stream custom events."""

from __future__ import annotations

import asyncio
import logging
import time
from typing import TYPE_CHECKING

from vision_agents.core.agents.events import AgentTurnStartedEvent, UserTurnStartedEvent
from vision_agents.core.agents.transcript.buffer import TranscriptBuffer, TranscriptMode
from vision_agents.core.llm import Realtime

if TYPE_CHECKING:
    from vision_agents.core import Agent

logger = logging.getLogger(__name__)

CAPTION_EVENT_TYPE = "live_caption"
TEACHER_SPEAKER = "teacher"
USER_SPEAKER = "user"
DEBOUNCE_SECONDS = 0.12


class LiveCaptionBridge:
    """Accumulates Gemini transcript deltas and forwards them to the mobile client."""

    def __init__(self, agent: Agent) -> None:
        self._agent = agent
        self._agent_buffer = TranscriptBuffer()
        self._user_buffers: dict[str, TranscriptBuffer] = {}
        self._last_sent: dict[str, float] = {}
        self._pending: dict[str, asyncio.Task[None]] = {}
        self._patched = False

    def attach(self) -> None:
        llm = self._agent.llm
        if not isinstance(llm, Realtime):
            logger.warning("Live captions require a Realtime LLM; skipping caption bridge")
            return
        if self._patched:
            return

        original_user = llm._emit_user_speech_transcription
        original_agent = llm._emit_agent_speech_transcription

        def patched_user(text: str, *, mode: TranscriptMode) -> None:
            original_user(text=text, mode=mode)
            participant = llm._current_participant
            if participant is None:
                return
            self._on_user_transcript(participant.id, text, mode)

        def patched_agent(text: str, *, mode: TranscriptMode) -> None:
            original_agent(text=text, mode=mode)
            self._on_agent_transcript(text, mode)

        llm._emit_user_speech_transcription = patched_user  # type: ignore[method-assign]
        llm._emit_agent_speech_transcription = patched_agent  # type: ignore[method-assign]
        self._patched = True
        logger.info("Live caption bridge attached")

    def register_turn_handlers(self) -> None:
        @self._agent.subscribe
        async def on_user_turn_started(_event: UserTurnStartedEvent) -> None:
            await self._finalize_speaker(TEACHER_SPEAKER)

        @self._agent.subscribe
        async def on_agent_turn_started(_event: AgentTurnStartedEvent) -> None:
            await self._finalize_speaker(USER_SPEAKER)

    def _on_user_transcript(
        self, participant_id: str, text: str, mode: TranscriptMode
    ) -> None:
        buffer = self._user_buffers.setdefault(participant_id, TranscriptBuffer())
        buffer.update(text, mode=mode)
        if not buffer.text:
            return
        self._schedule_send(USER_SPEAKER, buffer.text, is_partial=True)

    def _on_agent_transcript(self, text: str, mode: TranscriptMode) -> None:
        self._agent_buffer.update(text, mode=mode)
        if not self._agent_buffer.text:
            return
        self._schedule_send(TEACHER_SPEAKER, self._agent_buffer.text, is_partial=True)

    async def _finalize_speaker(self, speaker: str) -> None:
        if speaker == TEACHER_SPEAKER:
            text = self._agent_buffer.text
            self._agent_buffer = TranscriptBuffer()
        else:
            text = ""
            for buffer in self._user_buffers.values():
                if buffer.text:
                    text = buffer.text
                    break
            self._user_buffers.clear()

        if not text.strip():
            return

        await self._send_caption(speaker, text, is_partial=False)

    def _schedule_send(self, speaker: str, text: str, is_partial: bool) -> None:
        pending = self._pending.get(speaker)
        if pending and not pending.done():
            pending.cancel()

        async def _debounced_send() -> None:
            if is_partial:
                await asyncio.sleep(DEBOUNCE_SECONDS)
            await self._send_caption(speaker, text, is_partial=is_partial)

        self._pending[speaker] = asyncio.create_task(_debounced_send())

    async def _send_caption(self, speaker: str, text: str, is_partial: bool) -> None:
        if not text.strip():
            return

        now = time.monotonic()
        if is_partial and now - self._last_sent.get(speaker, 0) < DEBOUNCE_SECONDS:
            return

        try:
            await self._agent.send_custom_event(
                {
                    "type": CAPTION_EVENT_TYPE,
                    "speaker": speaker,
                    "text": text,
                    "is_partial": is_partial,
                }
            )
            self._last_sent[speaker] = now
        except Exception as error:
            logger.debug("Failed to send live caption: %s", error)


def register_live_captions(agent: Agent) -> LiveCaptionBridge:
    """Attach transcript forwarding for the duration of this agent session."""
    bridge = LiveCaptionBridge(agent)
    bridge.attach()
    bridge.register_turn_handlers()
    return bridge
