# Lingua Vision Agent

Voice-only AI language teacher for Lingua audio lessons. Built with [Vision Agents](https://visionagents.ai/) using **Gemini Live** and **Stream Edge** transport.

## Requirements

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) (recommended) or pip
- API keys in the **parent** repo `.env.local` or `.env` (same file as the Expo app), or in `vision-agent/.env`:

```bash
STREAM_API_KEY=...
STREAM_API_SECRET=...
GOOGLE_API_KEY=...   # https://aistudio.google.com/apikey
```

`GEMINI_API_KEY` is also accepted (same value as `GOOGLE_API_KEY`).

The Expo app already uses `.env.local` at the project root — the agent loads that automatically.

## Setup

```bash
cd vision-agent
uv sync
```

## Run

**Console demo** (opens browser join link):

```bash
uv run main.py run
```

**HTTP server** (used by the Expo app in step 15):

```bash
uv run main.py serve --host 127.0.0.1 --port 8000
```

Health check: `GET http://127.0.0.1:8000/health`

## Behavior

- Speaks **English only** and teaches the selected language through English.
- Reads lesson metadata from the Stream call `custom` field when the mobile app creates the call.
- Voice-only: audio lesson (`fps=1`, no video to the model).

## Optional: change Live model

Set in `.env.local` or `vision-agent/.env`:

```bash
GEMINI_LIVE_MODEL=gemini-2.5-flash-native-audio-preview-12-2025
```

See [Gemini Live models](https://ai.google.dev/gemini-api/docs/models) for current model IDs.

## Troubleshooting

**No AI teacher audio**

- The agent uses **Gemini Live** (native audio). Create a key at [Google AI Studio](https://aistudio.google.com/apikey).
- Free tier has rate limits; if logs show quota or `429` errors, wait and retry or enable billing.

**Invalid API key**

- Ensure `GOOGLE_API_KEY` or `GEMINI_API_KEY` is set in root `.env.local` or `vision-agent/.env`.
- Restart the vision-agent server after changing env vars.

**`404` when stopping a session**

- Normal if the agent crashed during join (e.g. quota error). The app treats this as a successful stop.

**Lesson shows as "default" in logs**

- Fixed by reading `response.data.call.custom` from the Stream API. Restart the vision-agent server after pulling updates.

## Project layout

```txt
vision-agent/
  main.py            # Agent factory, join lifecycle, CLI
  lesson_context.py  # Parse call custom data → system prompt
  pyproject.toml
```
