"use client";

import { useSyncExternalStore } from "react";
import { BREAKPOINTS, type BreakpointKey } from "@/lib/constants/breakpoints";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot(): number {
  return window.innerWidth;
}

// Fixed, deterministic value on the server — must match the client's FIRST
// hydration pass exactly (that's what getServerSnapshot guarantees), or
// React throws a hydration mismatch. app/fan/page.tsx branches its entire
// layout (desktop long-scroll vs. mobile tabs) on isDesktop, so this one
// matters more than a typical responsive className would.
function getServerSnapshot(): number {
  return 1280;
}

/** §9.3 — matches Tailwind's default breakpoint scale (sm/md/lg/xl/2xl). */
export function useBreakpoint(): { width: number; breakpoint: BreakpointKey; isMobile: boolean; isDesktop: boolean } {
  const width = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let breakpoint: BreakpointKey = "base";
  for (const key of ["sm", "md", "lg", "xl", "2xl"] as BreakpointKey[]) {
    if (width >= BREAKPOINTS[key]) breakpoint = key;
  }

  return {
    width,
    breakpoint,
    isMobile: width < BREAKPOINTS.md,
    isDesktop: width >= BREAKPOINTS.md,
  };
}
