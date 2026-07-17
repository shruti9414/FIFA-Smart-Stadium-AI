"use client";

import { motion } from "framer-motion";
import { seededRange } from "@/lib/utils/seededStats";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function PossessionBar({ seedKey, homeTeam, awayTeam }: { seedKey: string; homeTeam: string; awayTeam: string }) {
  const reduced = useReducedMotion();
  const home = Math.round(seededRange(`${seedKey}-poss`, 38, 62));
  const away = 100 - home;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="font-semibold text-accent-cyan">{home}%</span>
        <span className="text-[10px] uppercase tracking-wide text-text-muted">Possession</span>
        <span className="font-semibold text-accent-emerald">{away}%</span>
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-glass-elevated">
        <motion.div
          className="h-full bg-accent-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${home}%` }}
          transition={{ duration: reduced ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className="h-full bg-accent-emerald"
          initial={{ width: 0 }}
          animate={{ width: `${away}%` }}
          transition={{ duration: reduced ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-text-secondary">
        <span className="truncate">{homeTeam}</span>
        <span className="truncate">{awayTeam}</span>
      </div>
    </div>
  );
}
