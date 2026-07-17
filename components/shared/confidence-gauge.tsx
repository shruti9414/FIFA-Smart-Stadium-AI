"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { confidenceSweep } from "@/lib/motion/variants";
import { formatPercent } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/** §9.7 ConfidenceGauge — radial ring, color-banded (green >80% / amber 50-80% / rose <50%). */
export interface ConfidenceGaugeProps {
  confidence: number; // 0-100
  size?: number;
  className?: string;
}

export function ConfidenceGauge({ confidence, size = 44, className }: ConfidenceGaugeProps) {
  const reduced = useReducedMotion();
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const { initial, animate } = confidenceSweep(confidence, circumference, reduced);

  const color =
    confidence >= 80 ? "var(--color-state-success)" : confidence >= 50 ? "var(--color-state-warning)" : "var(--color-state-critical)";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--color-glass-elevated)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={initial}
          animate={animate}
        />
      </svg>
      <span className="absolute font-mono text-[11px] font-semibold text-text-primary">
        {formatPercent(confidence)}
      </span>
    </div>
  );
}
