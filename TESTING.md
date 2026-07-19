# Testing Guide

## Stack

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit & integration test runner |
| **React Testing Library** | Component rendering & user interaction |
| **@testing-library/user-event** | Realistic browser event simulation |
| **@testing-library/jest-dom** | DOM assertion matchers |
| **Playwright** | End-to-end browser automation |
| **MSW** | API mocking (available via `msw` package) |

## Running Tests

```bash
# Run all unit/integration tests
npm test

# Watch mode (re-runs on file change)
npm run test:watch

# Tests + coverage report
npm run test:coverage

# End-to-end tests (requires running server)
npm run test:e2e

# E2E with Playwright UI
npm run test:e2e:ui
```

## Test Structure

```
tests/
├── setup.ts                     # Global mocks (framer-motion, next/navigation, matchMedia)
├── unit/
│   ├── lib/
│   │   ├── utils/               # Pure utility function tests
│   │   │   ├── cn.test.ts
│   │   │   ├── format.test.ts
│   │   │   ├── heatmap.test.ts
│   │   │   ├── prng.test.ts
│   │   │   ├── seededStats.test.ts
│   │   │   └── aiFallback.test.ts
│   │   ├── ai/
│   │   │   └── gemini.test.ts   # Mocked Gemini API calls
│   │   └── env.test.ts          # Zod env schema validation
│   ├── hooks/
│   │   ├── useLocalStorage.test.ts
│   │   ├── useBreakpoint.test.ts
│   │   └── useReducedMotion.test.ts
│   ├── components/
│   │   └── ui/
│   │       ├── badge.test.tsx
│   │       ├── button.test.tsx
│   │       ├── status-chip.test.tsx
│   │       ├── error-state.test.tsx
│   │       └── progress-bar.test.tsx
│   └── api/
│       ├── incidents.test.ts    # GET + POST with mocked DB
│       └── crowd.test.ts
└── e2e/
    ├── landing.spec.ts
    ├── fan-journey.spec.ts
    └── mission-control.spec.ts
```

## Coverage

Coverage is measured with V8 and reports to `coverage/`. Current thresholds:

| Metric | Threshold | Actual |
|--------|-----------|--------|
| Statements | 80% | ~95% |
| Branches | 70% | ~87% |
| Functions | 80% | ~96% |
| Lines | 80% | ~95% |

## Mocking Strategy

All external dependencies are mocked in tests:

- **Gemini AI** — `vi.mock("@google/genai")` with `vi.hoisted()` for the mock constructor
- **Database** — `vi.mock("@/lib/db/*")` per test file
- **Socket.IO** — mocked in `tests/setup.ts`
- **framer-motion** — mocked in `tests/setup.ts` to avoid GSAP/rAF in jsdom
- **next/navigation** — mocked in `tests/setup.ts`

## CI

Tests run automatically on every push via `.github/workflows/ci.yml`:

1. **Lint** — ESLint with Next.js rules
2. **Typecheck** — `tsc --noEmit` (strict mode, zero errors)
3. **Unit tests + coverage** — Vitest with V8 coverage
4. **Build** — `next build --webpack` + esbuild server compile
