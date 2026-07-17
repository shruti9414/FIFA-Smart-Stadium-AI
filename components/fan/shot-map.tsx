"use client";

import { motion } from "framer-motion";
import { seededRange } from "@/lib/utils/seededStats";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { MatchEventRow } from "@/lib/types/db";

interface ShotMapProps {
  events: MatchEventRow[];
  homeTeam: string;
  width?: number;
  height?: number;
}

/** Mini pitch scatter of shot locations — illustrative positions seeded per event, goals highlighted. Not a DB fact; presentation only. */
export function ShotMap({ events, homeTeam, width = 320, height = 200 }: ShotMapProps) {
  const reduced = useReducedMotion();
  const shotEvents = events.filter((e) => e.event_type === "goal" || e.event_type === "var");

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="rounded-sm bg-emerald-950/40">
      <rect x={2} y={2} width={width - 4} height={height - 4} fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth={1.5} />
      <line x1={width / 2} y1={2} x2={width / 2} y2={height - 2} stroke="rgba(16,185,129,0.25)" strokeWidth={1} />
      <circle cx={width / 2} cy={height / 2} r={26} fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth={1} />
      <rect x={2} y={height / 2 - 40} width={36} height={80} fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth={1} />
      <rect x={width - 38} y={height / 2 - 40} width={36} height={80} fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth={1} />

      {shotEvents.map((e, i) => {
        const isHome = e.team === homeTeam;
        const isGoal = e.event_type === "goal";
        const x = isHome ? seededRange(`shot-x-${e.id}`, width * 0.55, width * 0.92) : seededRange(`shot-x-${e.id}`, width * 0.08, width * 0.45);
        const y = seededRange(`shot-y-${e.id}`, height * 0.2, height * 0.8);
        return (
          <motion.circle
            key={e.id}
            cx={x}
            cy={y}
            r={isGoal ? 6 : 4}
            fill={isGoal ? "#22D3EE" : "transparent"}
            stroke={isGoal ? "#22D3EE" : "rgba(255,255,255,0.4)"}
            strokeWidth={1.5}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: reduced ? 0 : i * 0.08, duration: reduced ? 0 : 0.3, type: "spring" }}
          />
        );
      })}
    </svg>
  );
}
