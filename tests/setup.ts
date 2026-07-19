import "@testing-library/jest-dom";
import { vi } from "vitest";

// ---------------------------------------------------------------------------
// next/navigation mock
// ---------------------------------------------------------------------------
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// ---------------------------------------------------------------------------
// framer-motion mock — avoids GSAP/requestAnimationFrame in jsdom
// ---------------------------------------------------------------------------
vi.mock("framer-motion", () => {
  const React = require("react");
  const forward = (tag: string) =>
    React.forwardRef(({ children, ...props }: Record<string, unknown>, ref: unknown) =>
      React.createElement(tag, { ...props, ref }, children)
    );

  return {
    motion: {
      div: forward("div"),
      span: forward("span"),
      p: forward("p"),
      ul: forward("ul"),
      li: forward("li"),
      button: forward("button"),
      section: forward("section"),
      article: forward("article"),
      header: forward("header"),
      footer: forward("footer"),
      nav: forward("nav"),
      aside: forward("aside"),
      main: forward("main"),
      h1: forward("h1"),
      h2: forward("h2"),
      h3: forward("h3"),
    },
    AnimatePresence: ({ children }: { children: unknown }) => children,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
    useMotionValue: (initial: unknown) => ({ get: () => initial, set: vi.fn() }),
    useTransform: (_mv: unknown, _from: unknown, to: unknown[]) => ({
      get: () => to[0],
    }),
    useSpring: (initial: unknown) => ({ get: () => initial }),
    animate: vi.fn(() => ({ stop: vi.fn() })),
    stagger: vi.fn(() => 0),
  };
});

// ---------------------------------------------------------------------------
// socket.io-client mock
// ---------------------------------------------------------------------------
vi.mock("socket.io-client", () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connected: false,
  })),
}));

// ---------------------------------------------------------------------------
// matchMedia / window.innerWidth (jsdom stubs)
// ---------------------------------------------------------------------------
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, "innerWidth", {
  writable: true,
  value: 1280,
});

// ---------------------------------------------------------------------------
// IntersectionObserver stub
// ---------------------------------------------------------------------------
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: vi.fn(() => []),
})) as unknown as typeof IntersectionObserver;

// ---------------------------------------------------------------------------
// ResizeObserver stub
// ---------------------------------------------------------------------------
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as unknown as typeof ResizeObserver;
