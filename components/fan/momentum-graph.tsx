"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { seededRandom } from "@/lib/utils/seededStats";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Momentum swing across the match — illustrative, seeded per match (not a DB fact or AI output), smoothed random walk from -1 (away) to 1 (home). */
export function MomentumGraph({ seedKey, currentMinute, width = 320, height = 80 }: { seedKey: string; currentMinute: number; width?: number; height?: number }) {
  const reduced = useReducedMotion();
  const points = useMemo(() => {
    const rng = seededRandom(seedKey);
    const n = 24;
    const vals: number[] = [];
    let v = 0;
    for (let i = 0; i < n; i++) {
      v = Math.max(-1, Math.min(1, v + (rng() - 0.5) * 0.6));
      vals.push(v);
    }
    return vals;
  }, [seedKey]);

  const visibleCount = Math.max(2, Math.round((currentMinute / 90) * points.length));
  const visible = points.slice(0, visibleCount);
  const midY = height / 2;
  const stepX = width / (points.length - 1);

  const path = visible
    .map((v, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${midY - v * (midY - 8)}`)
    .join(" ");
  const areaPath = `${path} L ${(visible.length - 1) * stepX} ${midY} L 0 ${midY} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="momentumFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={0} y1={midY} x2={width} y2={midY} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
      <motion.path
        d={areaPath}
        fill="url(#momentumFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.6 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#22D3EE"
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduced ? 0 : 1, ease: "easeOut" }}
      />
    </svg>
  );
}
