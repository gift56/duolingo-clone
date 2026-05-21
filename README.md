# Lingua — Duolingo-Inspired AI Language Learning App

A **production-style teaching project** that walks you through building a modern, AI-powered language learning mobile app with **Expo** and **React Native**. The experience is inspired by playful apps like Duolingo, but extended with **video AI teachers**, **audio lessons**, **real-time tutoring**, and local progress tracking.

This repository is meant to be built **feature by feature**—not cloned as a finished product. Each step adds a real capability while keeping the codebase readable enough to teach from.

---

## What You Will Build

Users learn languages through interactive flows:

| Area | Description |
|------|-------------|
| **Onboarding & auth** | Welcome flows and sign-in/sign-up (Clerk) |
| **Language selection** | Choose what language to study |
| **Home & tabs** | Main hub with streak, XP, and lesson paths |
| **Lesson UI** | Interactive lesson screens with progress |
| **Audio lessons** | Listen-and-respond style lessons |
| **Video AI teacher** | Live video sessions via Stream + Vision Agents |
| **Chat tutor** | AI-assisted conversation practice |
| **Vocabulary review** | Reinforce words from completed lessons |
| **Local progress** | XP, streaks, and completion stored on-device (Zustand + AsyncStorage) |

Lesson **content** is hardcoded TypeScript/JSON—there is no database in this version. Secure operations (tokens, AI calls) go through **Expo API routes** on the server side.

---

## Who This Project Is For

- Developers learning **Expo Router**, **NativeWind**, and mobile UI patterns
- Anyone who wants a guided path from static screens → auth → state → real-time AI features
- Instructors or students using **step-by-step prompts** in `src/prompts/` as a curriculum

The code prioritizes **clarity over cleverness**. Abstractions appear only when repetition justifies them.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Expo SDK 55](https://docs.expo.dev/versions/v55.0.0/) |
| UI | React Native 0.83, React 19 |
| Language | TypeScript (strict) |
| Routing | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based, typed routes) |
| Styling | [NativeWind v5](https://www.nativewind.dev/) + Tailwind CSS v4 |
| Fonts | Poppins (Regular, Medium, SemiBold, Bold) |
| Client state | [Zustand](https://github.com/pmndrs/zustand) + AsyncStorage persistence *(as features land)* |
| Auth | [Clerk](https://clerk.com/docs/expo/getting-started/quickstart) |
| Real-time / video | [Stream](https://getstream.io/) (calls, chat) |
| AI video teacher | Stream Vision Agents |
| Secrets & tokens | Expo API routes / serverless functions—**never** in the client bundle |
| Analytics *(planned)* | PostHog |

**Important:** Use [Expo v55 docs](https://docs.expo.dev/versions/v55.0.0/) and the **installed** NativeWind version in `package.json`. Do not mix setup steps from other SDK or NativeWind versions.

---

## Current Status

The app is in **early setup**. Implemented so far:

- Expo Router entry under `src/app/`
- NativeWind / Tailwind (`global.css`, PostCSS, Metro)
- **Lingua design system** — colors, typography, Poppins fonts (`src/theme/`, `src/app/global.css`)
- Splash screen and font loading in root layout
- Placeholder home screen confirming the design system loads

Screens and features from the curriculum (onboarding, auth, tabs, lessons, Stream, Clerk, etc.) are added incrementally via the prompts in `src/prompts/`.

---

## Project Structure

```txt
duoligo-clone/
├── assets/                 # Images, fonts, app icons
├── src/
│   ├── app/                # Routes & screens only (Expo Router)
│   │   ├── _layout.tsx     # Root layout, fonts, navigation stack
│   │   ├── index.tsx       # Entry screen
│   │   └── global.css      # Tailwind theme & utilities
│   ├── components/         # Reusable UI (added as features grow)
│   ├── constants/          # e.g. centralized image map (images.ts)
│   ├── data/               # Hardcoded lessons, languages
│   ├── hooks/
│   ├── lib/                # Fonts, API helpers, Clerk, Stream, etc.
│   ├── store/              # Zustand stores
│   ├── theme/              # Design tokens (colors, typography, fonts)
│   ├── prompts/            # Step-by-step build curriculum for AI/humans
│   └── prompt_material/    # UI reference screenshots per step
├── AGENTS.md               # Full project rules for contributors & AI agents
├── app.json                # Expo config (scheme, plugins, experiments)
├── global.css              # Root Tailwind entry (project-level)
└── metro.config.js
```

### Path aliases

TypeScript paths (see `tsconfig.json`):

- `@/*` → `./src/*`
- `@/assets/*` → `./assets/*`

### Routing conventions (target layout)

As features are built, routes will follow groups such as:

```txt
src/app/
  (auth)/          # Sign-in, sign-up
  (tabs)/          # Main tab navigator
  lesson/          # Lesson flows
  onboarding/      # First-run experience
```

Screens should **compose** components and hooks; avoid large inline UI blocks or heavy business logic in route files.

---

## Design System — Lingua

Brand and UI tokens live in `src/theme/` and Tailwind utilities in `src/app/global.css`. Reference: `src/prompt_material/01-design-system.png`.

| Token | Role |
|-------|------|
| `lingua-purple` / `lingua-deep-purple` | Primary brand |
| `lingua-blue` / `lingua-green` | Accents, success |
| `streak`, `warning`, `error` | Semantic feedback |
| Poppins + `text-h1`, `text-body-medium`, etc. | Typography scale |

**Styling rules:** Prefer NativeWind `className` utilities. Use `StyleSheet` or inline styles only where NativeWind does not apply (e.g. `SafeAreaView`, dynamic animated values, some `ScrollView` props). See `AGENTS.md` for the full exception table.

**Images:** Import assets through a central `src/constants/images.ts` object—do not scatter `require()` calls across screens.

---

## Feature Curriculum (`src/prompts/`)

The recommended build order is numbered prompt files. Each file tells an implementer (human or AI) to read `AGENTS.md` first, then complete one vertical slice.

| Step | File | Focus |
|------|------|--------|
| 01 | `01-nativewind.md` | NativeWind v5 setup in Expo |
| 02 | `02-design-theme.md` | Colors, typography, Poppins |
| 03 | `03-onboarding-ui.md` | Onboarding screens |
| 04 | `04-authentication-ui.md` | Auth UI (mocked first) |
| 05 | `05-clerk.md` | Real Clerk auth |
| 06 | `06-content-system.md` | Lesson/language data |
| 07 | `07-language-ui.md` | Language selection |
| 08 | `08-zustand.md` | Global state + persistence |
| 09 | `09-bottom-tab-nav.md` | Tab navigation |
| 10 | `10-home-ui.md` | Home screen & path UI |
| 11 | `11-lesson-ui.md` | Lesson screen |
| 12 | `12-audio-lesson-ui.md` | Audio lesson UI |
| 13 | `13-stream-integration.md` | Stream audio calls + API routes |
| 14 | `14-vision-agents.md` | AI video teacher |
| 15 | `15-connection-to-ui.md` | Connect realtime to UI |
| 16 | `16-ai-teacher-improvements.md` | AI teacher polish |
| 17 | `17-live-captions.md` | Live captions |
| 18 | `18-more-posthog.md` | Analytics |

Matching design references are in `src/prompt_material/` (onboarding, auth, language picker, home, lesson, audio lesson, etc.).

---

## Architecture Principles

1. **Feature-by-feature** — smallest working slice first, refactor when patterns repeat.
2. **No secrets in the app** — Stream tokens, AI keys, and similar values only on the server/API routes.
3. **No database** — content in `src/data/`, progress in Zustand + AsyncStorage.
4. **Teachable code** — obvious file placement, minimal magic, comments only for non-obvious logic.
5. **Pixel-faithful UI** — when a reference image exists, match layout, spacing, colors, and type closely.

Full guidelines: **[AGENTS.md](./AGENTS.md)** (required reading before implementing features).

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (or compatible package manager)
- For device testing:
  - [Expo Go](https://expo.dev/go) (limited; some native modules need a dev build), or
  - [Expo development build](https://docs.expo.dev/develop/development-builds/introduction/)
  - iOS Simulator (macOS) and/or Android emulator

You will need accounts and env vars when you reach later steps (Clerk, Stream, etc.). Those steps are documented in the corresponding prompt files—do not commit `.env` files or API secrets.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm start
# or
npx expo start
```

Then open:

- **iOS** — `i` in the terminal or `npm run ios`
- **Android** — `a` in the terminal or `npm run android`
- **Web** — `w` in the terminal or `npm run web`

### 3. Edit the app

- Routes and screens: `src/app/`
- Global styles & Tailwind theme: `src/app/global.css` and root `global.css`
- Design tokens: `src/theme/`

The root layout loads fonts and hides the splash screen once assets are ready (`src/app/_layout.tsx`).

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Start and open iOS simulator |
| `npm run android` | Start and open Android emulator |
| `npm run web` | Start web build |
| `npm run lint` | Run ESLint via Expo |

---

## Environment & Security

When integrating third-party services:

- Store keys in environment variables consumed by **API routes** or EAS secrets
- Never commit `.env`, tokens, or credential files
- Use Clerk for all authentication—no custom auth stack
- Generate Stream (and other) tokens server-side only

---

## Contributing & AI-Assisted Development

If you use Cursor, Copilot, or other agents:

1. Read **[AGENTS.md](./AGENTS.md)** — stack, UI rules, folder structure, and constraints.
2. Pick the next prompt in `src/prompts/` that matches your current progress.
3. Attach the matching PNG from `src/prompt_material/` when building UI.
4. Run `npm run lint` before finishing a task.

Agents should not add major dependencies without explicit approval. Prefer the stack already listed in `AGENTS.md`.

---

## Expo Configuration Highlights

From `app.json`:

- **Scheme:** `duoligoclone` (deep linking)
- **Plugins:** `expo-router`, `expo-font` (Poppins), `expo-splash-screen` (purple `#6C4EF5`)
- **Experiments:** typed routes, React Compiler

---

## Learn More

- [Expo documentation](https://docs.expo.dev/) — SDK 55 guides and API reference
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind v5](https://www.nativewind.dev/)
- [Clerk Expo quickstart](https://clerk.com/docs/expo/getting-started/quickstart)
- [GetStream](https://getstream.io/) — chat and video SDKs

---

## License & Disclaimer

This is an **educational clone** inspired by language-learning apps. It is not affiliated with Duolingo or any commercial product. Use it to learn mobile and AI integration patterns, not as a production fork of trademarked experiences.
