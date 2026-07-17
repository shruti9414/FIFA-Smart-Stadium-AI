"use client";

import { useRef } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface ParallaxHandlers {
  ref: React.RefObject<HTMLDivElement | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

/**
 * Container-relative mouse position as spring-smoothed motion values in
 * [-1, 1], for cheap multi-layer parallax (§ hero atmosphere) — driven
 * through Framer's motion values so layers re-render outside React,
 * not via setState on every mousemove.
 */
export function useMouseParallax(): ParallaxHandlers {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.4 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { ref, x, y, onMouseMove, onMouseLeave };
}
