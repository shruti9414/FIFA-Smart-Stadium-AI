import type { Transition, Variants } from "framer-motion";

/**
 * §9.6 named motion patterns — implemented once here, referenced by name
 * everywhere. Ambient/looping effects that don't need per-instance JS
 * state (shimmer, gradient-border rotate) live as CSS animations in
 * app/globals.css instead; this file covers entrance/exit/data-driven
 * motion that genuinely needs Framer Motion's orchestration.
 *
 * `prefers-reduced-motion` is handled by callers passing `reduced` from
 * the useReducedMotion() hook — every export here has a reduced-motion
 * counterpart that swaps to instant, non-transformed states.
 */

export const easeStandard: Transition["ease"] = [0.16, 1, 0.3, 1];
export const easeExit: Transition["ease"] = [0.4, 0, 1, 1];

export const DURATION = {
  micro: 0.15,
  standard: 0.28,
  panel: 0.38,
} as const;

/** 1. fadeSlideUp — card/section entrance */
export function fadeSlideUp(reduced = false): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : DURATION.standard, ease: easeStandard },
    },
  };
}

/** 2. staggerChildren — wraps a grid/feed; children should use fadeSlideUp */
export function staggerChildren(reduced = false, staggerMs = 50): Variants {
  return {
    hidden: {},
    visible: {
      transition: reduced
        ? {}
        : { staggerChildren: staggerMs / 1000, delayChildren: 0.05 },
    },
  };
}

/** 4. pulseGlow (data-driven) — used when glow intensity must track a live value (e.g. severity) */
export function pulseGlow(reduced = false, intensity: "low" | "high" = "low") {
  if (reduced) return { opacity: 0.85 };
  return {
    opacity: [0.55, 1, 0.55],
    scale: intensity === "high" ? [1, 1.06, 1] : [1, 1.02, 1],
    transition: { duration: intensity === "high" ? 2 : 4, repeat: Infinity, ease: "easeInOut" as const },
  };
}

/** 6. streamText — token-by-token reveal container + word variants */
export function streamTextContainer(reduced = false, staggerMs = 35): Variants {
  return {
    hidden: {},
    visible: {
      transition: reduced ? {} : { staggerChildren: staggerMs / 1000 },
    },
  };
}
export function streamTextWord(reduced = false): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 4 },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.18 } },
  };
}

/** 7. confidenceSweep — radial arc animating 0 → value on entrance (drives an SVG circle's strokeDashoffset) */
export function confidenceSweep(confidence: number, circumference: number, reduced = false) {
  const target = circumference * (1 - confidence / 100);
  return {
    initial: { strokeDashoffset: circumference },
    animate: {
      strokeDashoffset: target,
      transition: { duration: reduced ? 0 : 0.6, ease: easeStandard },
    },
  };
}

/** 8. zoneHeatPulse — Digital Twin zone breathing scale/opacity, intensity scales with density */
export function zoneHeatPulse(densityPct: number, reduced = false) {
  if (reduced || densityPct < 40) return { scale: 1, opacity: 0.85 };
  const intensity = Math.min((densityPct - 40) / 60, 1); // 0 at 40%, 1 at 100%
  return {
    scale: [1, 1 + 0.04 * intensity, 1],
    opacity: [0.75, 1, 0.75],
    transition: {
      duration: 3.6 - 1.6 * intensity, // faster pulse as density rises
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };
}

/** 9. slideInPanel — SidePanel (desktop, from right) / BottomSheet (mobile, from bottom) */
export function slideInPanel(direction: "right" | "bottom", reduced = false): Variants {
  const offscreen =
    direction === "right" ? { x: reduced ? 0 : 32 } : { y: reduced ? 0 : 32 };
  return {
    hidden: { ...offscreen, opacity: 0 },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration: reduced ? 0 : DURATION.panel, ease: easeStandard },
    },
    exit: {
      ...offscreen,
      opacity: 0,
      transition: { duration: reduced ? 0 : DURATION.micro, ease: easeExit },
    },
  };
}

/** 11. toastEnter — notification slide+fade in from top */
export function toastEnter(reduced = false): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : -16, scale: reduced ? 1 : 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reduced ? 0 : DURATION.standard, ease: easeStandard },
    },
    exit: { opacity: 0, transition: { duration: reduced ? 0 : DURATION.micro } },
  };
}
