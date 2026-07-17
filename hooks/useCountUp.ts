"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * §9.6 countUp — smoothly animates a displayed number toward `value` on
 * every change, instead of snapping (used by StatTile/KPICard). When
 * reduced-motion is on, we skip the animated `display` state entirely
 * and return `value` directly rather than synchronously setState-ing it
 * inside the effect.
 */
export function useCountUp(value: number, durationSec = 0.6): number {
  const [display, setDisplay] = useState(value);
  const reduced = useReducedMotion();
  const prevRef = useRef(value);

  useEffect(() => {
    if (reduced) {
      prevRef.current = value;
      return;
    }

    const controls = animate(prevRef.current, value, {
      duration: durationSec,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    prevRef.current = value;

    return () => controls.stop();
  }, [value, reduced, durationSec]);

  return reduced ? value : display;
}
