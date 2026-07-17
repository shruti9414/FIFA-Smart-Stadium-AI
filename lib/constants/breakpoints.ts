/** §9.3 — mirrors Tailwind v4's default screens scale exactly, so JS and CSS breakpoints never drift apart. */
export const BREAKPOINTS = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
