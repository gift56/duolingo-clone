# Lingua Vision Agent

Voice-only AI language teacher for Lingua audio lessons. Built with [Vision Agents](https://visionagents.ai/) using **OpenAI Realtime** and **Stream Edge** transport.

## Requirements

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) (recommended) or pip
- API keys in the **parent** repo `.env.local` or `.env` (same file as the Expo app), or in `vision-agent/.env`:

```bash
STREAM_API_KEY=...
STREAM_API_SECRET=...
OPENAI_API_KEY=...
```

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
- Voice-only: no camera or video publishing (`send_video=False`).

## Troubleshooting

**No AI teacher audio**

- The agent uses **OpenAI Realtime** (`gpt-realtime`). Your `OPENAI_API_KEY` must have **billing enabled** and available quota.
- If logs show `insufficient_quota` or HTTP 429, add credits at [OpenAI billing](https://platform.openai.com/account/billing).

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
