# Architecture

## Overview

FIFA Smart Stadium AI is a full-stack Next.js 16 application that serves two user personas from a single deployment: **fans** (mobile-first PWA experience) and **stadium operators** (mission control dashboard). Real-time synchronization uses Socket.IO via a custom HTTP server, with Google Gemini powering all AI features.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Framer Motion |
| 3D | Three.js + React Three Fiber |
| Real-time | Socket.IO 4 |
| Database | MySQL 2 (Railway) |
| AI | Google Gemini 2.0 Flash |
| Server | Custom Node.js HTTP server (esbuild-compiled) |
| Deployment | Railway (Nixpacks) |
| Testing | Vitest + Playwright |

## Directory Structure

```
.
├── app/                     # Next.js App Router
│   ├── fan/                 # Fan experience (PWA, mobile-first)
│   ├── ops/                 # Operations dashboard
│   │   ├── incidents/       # Incident management
│   │   └── sustainability/  # Energy & sustainability metrics
│   └── api/                 # API routes
│       ├── ai/              # AI-powered endpoints
│       └── [data]/          # CRUD endpoints (crowd, gates, incidents, etc.)
├── components/
│   ├── fan/                 # Fan-facing UI components
│   ├── mission-control/     # Ops 3D visualization
│   ├── ops/                 # Operations components
│   ├── shared/              # Cross-persona components (AI badge, chat, etc.)
│   └── ui/                  # Base design system (Button, Badge, Card, etc.)
├── hooks/                   # Custom React hooks
├── lib/
│   ├── ai/                  # AI service layer (Gemini integration)
│   ├── constants/           # App-wide constants and breakpoints
│   ├── db/                  # Database access layer (one file per entity)
│   ├── motion/              # Framer Motion animation variants
│   ├── sim/                 # Stadium simulation engine
│   ├── socket/              # Socket.IO client + server
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Pure utility functions
├── server.ts                # Custom HTTP server (esbuild-compiled for prod)
└── tests/                   # Vitest unit + Playwright E2E
```

## Data Flow

```
Browser
  │
  ├── HTTP → Next.js API Routes → lib/db/* → MySQL
  │
  ├── WebSocket → Socket.IO Server (server.ts) → real-time events
  │
  └── AI requests → /api/ai/* → lib/ai/gemini.ts → Gemini API
```

## Key Design Decisions

### Custom Server (server.ts)
Next.js is run via a custom Node.js HTTP server rather than the standard `next start`. This enables Socket.IO to share the same HTTP server instance and port. The server is compiled by esbuild during `npm run build` to avoid tsx's native binary at runtime (which crashes on Railway's Linux ARM).

### AI Layer (lib/ai/)
All AI calls go through `lib/ai/gemini.ts` which provides:
- `generateText()` — free-form text generation
- `generateJSON<T>()` — structured JSON output with schema validation
- `isGeminiConfigured()` — guards for API key availability

Each AI feature file (e.g. `crowdAnalysis.ts`) is a thin wrapper that composes a domain-specific prompt and calls `generateText`/`generateJSON`.

### Simulation Engine (lib/sim/engine.ts)
A seeded pseudo-random simulation engine runs server-side and emits Socket.IO events every 6 seconds, driving the real-time dashboard without requiring real sensor data. Uses `mulberry32` PRNG for reproducible demos.

### Environment Validation (lib/env.ts)
All environment variables are validated at startup via Zod. Each integration (DB, Gemini) fails late — the server boots even without API keys, and individual endpoints return 503 with a clear error when their required config is missing.

### PWA
The fan experience is a Progressive Web App with a service worker (`public/sw.js`), web manifest (`public/manifest.json`), and offline fallback page (`app/offline/page.tsx`).
