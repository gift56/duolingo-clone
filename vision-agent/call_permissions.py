"""Grant the AI teacher permission to publish audio on Stream calls."""

from __future__ import annotations

import logging

from getstream.models import MemberRequest

logger = logging.getLogger(__name__)

AGENT_USER_ID = "lingua-ai-teacher"


async def ensure_agent_can_publish(call, call_type: str) -> None:
    """Add the agent as an admin member and go live for audio_room calls."""
    try:
        await call.update_call_members(
            update_members=[MemberRequest(user_id=AGENT_USER_ID, role="admin")]
        )
    except Exception as error:
        logger.warning("Could not add agent as admin member: %s", error)

    if call_type != "audio_room":
        return

    try:
        await call.go_live()
    except Exception as error:
        logger.warning("Could not go live on audio_room call: %s", error)
