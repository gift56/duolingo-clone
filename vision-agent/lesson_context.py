"""Build AI teacher instructions from Stream call custom data."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class LessonContext:
    lesson_title: str
    language_name: str
    user_name: str
    goals: list[str]
    vocabulary: list[tuple[str, str]]
    phrases: list[tuple[str, str]]
    system_context: str
    opening_line: str
    focus_topics: list[str]
    level: str


DEFAULT_LANGUAGE_NAME = "the target language"


def _as_str(value: Any, fallback: str = "") -> str:
    return value.strip() if isinstance(value, str) and value.strip() else fallback


def _as_string_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    return [item.strip() for item in value if isinstance(item, str) and item.strip()]


def parse_lesson_context(custom: Any) -> LessonContext | None:
    if not isinstance(custom, dict):
        return None

    ai_teacher = custom.get("aiTeacher")
    if not isinstance(ai_teacher, dict):
        ai_teacher = {}

    vocabulary: list[tuple[str, str]] = []
    for item in custom.get("vocabulary") or []:
        if not isinstance(item, dict):
            continue
        word = _as_str(item.get("word"))
        translation = _as_str(item.get("translation"))
        if word and translation:
            vocabulary.append((word, translation))

    phrases: list[tuple[str, str]] = []
    for item in custom.get("phrases") or []:
        if not isinstance(item, dict):
            continue
        text = _as_str(item.get("text"))
        translation = _as_str(item.get("translation"))
        if text and translation:
            phrases.append((text, translation))

    language_name = _as_str(custom.get("languageName"), DEFAULT_LANGUAGE_NAME)
    lesson_title = _as_str(custom.get("lessonTitle"), "Language lesson")

    return LessonContext(
        lesson_title=lesson_title,
        language_name=language_name,
        user_name=_as_str(custom.get("userName"), "the learner"),
        goals=_as_string_list(custom.get("goals")),
        vocabulary=vocabulary,
        phrases=phrases,
        system_context=_as_str(
            ai_teacher.get("systemContext"),
            "You are a warm, encouraging language tutor.",
        ),
        opening_line=_as_str(
            ai_teacher.get("openingLine"),
            "Hi! Ready to practice together?",
        ),
        focus_topics=_as_string_list(ai_teacher.get("focusTopics")),
        level=_as_str(ai_teacher.get("level"), "beginner"),
    )


def build_teacher_instructions(context: LessonContext | None) -> str:
    language_name = context.language_name if context else DEFAULT_LANGUAGE_NAME
    lesson_title = context.lesson_title if context else "a language lesson"
    user_name = context.user_name if context else "the learner"
    level = context.level if context else "beginner"
    system_context = (
        context.system_context
        if context
        else "You are a warm, encouraging language tutor."
    )
    goals = context.goals if context else []
    vocabulary = context.vocabulary if context else []
    phrases = context.phrases if context else []
    focus_topics = context.focus_topics if context else []

    goals_block = "\n".join(f"- {goal}" for goal in goals) or "- Practice core lesson phrases"
    vocab_block = (
        "\n".join(f"- {word}: {translation}" for word, translation in vocabulary)
        or "- Use simple, high-frequency words from the lesson"
    )
    phrases_block = (
        "\n".join(f'- "{text}" → {translation}' for text, translation in phrases)
        or "- Introduce one short phrase at a time"
    )
    focus_block = ", ".join(focus_topics) if focus_topics else "lesson vocabulary and phrases"

    return f"""{system_context}

You are the Lingua AI language teacher in a live voice-only audio lesson.

Critical rules:
- Always speak in English only. Never switch to {language_name} for explanations.
- Teach {language_name} through English: introduce words and phrases in {language_name}, then explain meaning and usage in English.
- Keep responses short (1–3 sentences), conversational, and energetic.
- Pause for the learner to repeat. Praise effort. Correct gently.
- Stay focused on today's lesson: "{lesson_title}" at {level} level.
- The learner's name is {user_name}.

Lesson goals:
{goals_block}

Vocabulary to practice:
{vocab_block}

Phrases to practice:
{phrases_block}

Focus topics: {focus_block}

Do not discuss unrelated topics. If the learner goes off track, guide them back warmly.
"""


def build_opening_prompt(context: LessonContext | None) -> str:
    if context and context.opening_line:
        return (
            f"Greet {context.user_name} warmly in English, then deliver this opening "
            f"(you may translate or explain any {context.language_name} words in English): "
            f"{context.opening_line}"
        )
    return (
        "Greet the learner warmly in English and introduce today's short language practice."
    )
