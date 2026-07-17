"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { densityToColor } from "@/lib/utils/heatmap";

/** Linear progress — parking occupancy, queue level, toast auto-dismiss shrink bar. */
export interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  colorByValue?: boolean;
  trackClassName?: string;
}

export function ProgressBar({ value, className, colorByValue = false, trackClassName }: ProgressBarProps) {
  const reduced = useReducedMotion();
  const pct = Math.min(100, Math.max(0, value));
  const color = colorByValue ? densityToColor(pct) : undefined;

  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-glass-elevated", trackClassName)}>
      <motion.div
        className={cn("h-full rounded-full", !colorByValue && "gradient-ai-core", className)}
        style={color ? { backgroundColor: color } : undefined}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
