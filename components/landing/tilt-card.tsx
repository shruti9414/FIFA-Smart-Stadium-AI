"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

/**
 * 3D perspective tilt on hover — the entry cards' signature interaction.
 * Rotation tracks cursor position within the card bounds; a glare layer
 * follows the same position for a glass/holographic read. Framer motion
 * values drive the transform outside React state, so this stays cheap
 * even with many re-renders elsewhere on the page.
 */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const springX = useSpring(rawX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(springY, [0, 1], [8, -8]);
  const rotateY = useTransform(springX, [0, 1], [-8, 8]);
  const glareX = useTransform(springX, (v) => `${v * 100}%`);
  const glareY = useTransform(springY, (v) => `${v * 100}%`);
  // Called unconditionally (Rules of Hooks) — the resulting element is what's conditionally rendered, not this hook call.
  const glareBackground = useTransform([glareX, glareY], (latest: string[]) => {
    const [gx, gy] = latest;
    return `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.10), transparent 55%)`;
  });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width);
    rawY.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    rawX.set(0.5);
    rawY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      whileHover={reduced ? undefined : { scale: 1.015 }}
      className={cn("relative", className)}
    >
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBackground }}
        />
      )}
      {children}
    </motion.div>
  );
}
