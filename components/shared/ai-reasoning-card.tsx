"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { AIBadge } from "@/components/shared/ai-badge";
import { ConfidenceGauge } from "@/components/shared/confidence-gauge";
import { FactChipRow } from "@/components/shared/fact-chip-row";
import { formatRelativeTime } from "@/lib/utils/format";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeSlideUp } from "@/lib/motion/variants";
import { cn } from "@/lib/utils/cn";

/**
 * §4/§9.7 — the shared explainable-AI pattern. Header → body → confidence
 * → facts → human action. Proportions and internal order never change
 * between Mission Control, Incident Center, and the Assistant (§10.6) —
 * only overall width/scale varies by context via `size`.
 */
export interface AIReasoningCardProps {
  title: string;
  rationale: string;
  confidence: number;
  affectedFacts: string[];
  generatedAt: string;
  cached?: boolean;
  onFactClick?: (fact: string, index: number) => void;
  onApprove?: () => void;
  onDismiss?: () => void;
  approveLabel?: string;
  dismissLabel?: string;
  size?: "rail" | "full";
  className?: string;
}

export function AIReasoningCard({
  title,
  rationale,
  confidence,
  affectedFacts,
  generatedAt,
  cached = false,
  onFactClick,
  onApprove,
  onDismiss,
  approveLabel = "Approve",
  dismissLabel = "Dismiss",
  size = "rail",
  className,
}: AIReasoningCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div variants={fadeSlideUp(reduced)} initial="hidden" animate="visible">
      <GlassCard
        elevation="L1"
        padding={size === "full" ? "lg" : "md"}
        className={cn("space-y-3", className)}
      >
        <div className="flex items-center justify-between">
          <AIBadge cached={cached} />
          <span className="font-mono text-[11px] text-text-muted">{formatRelativeTime(generatedAt)}</span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className={cn("font-display font-semibold text-text-primary", size === "full" ? "text-xl" : "text-base")}>
              {title}
            </h3>
            <p className="text-sm text-text-secondary">{rationale}</p>
          </div>
          <ConfidenceGauge confidence={confidence} size={size === "full" ? 56 : 44} className="shrink-0" />
        </div>

        <FactChipRow facts={affectedFacts} onFactClick={onFactClick} />

        {(onApprove || onDismiss) && (
          <div className="flex gap-2 pt-1">
            {onDismiss && (
              <Button variant="ghost" size="sm" className="flex-1" onClick={onDismiss}>
                {dismissLabel}
              </Button>
            )}
            {onApprove && (
              <Button variant="primary" size="sm" className="flex-1" onClick={onApprove}>
                {approveLabel}
              </Button>
            )}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
