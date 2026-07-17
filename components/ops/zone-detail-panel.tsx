"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Radar } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { AIBadge } from "@/components/shared/ai-badge";
import { ConfidenceGauge } from "@/components/shared/confidence-gauge";
import { AIThinkingChip } from "@/components/shared/ai-thinking-chip";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { slideInPanel } from "@/lib/motion/variants";
import type { StadiumSection, StadiumGate } from "@/lib/types/db";
import type { CrowdAnalysisResult } from "@/lib/ai/crowdAnalysis";

interface Props {
  section: StadiumSection;
  gate: StadiumGate | undefined;
  density: number;
  onClose: () => void;
}

const RISK_TONE: Record<string, "success" | "warning" | "critical"> = { low: "success", medium: "warning", high: "critical", critical: "critical" };

export function ZoneDetailPanel({ section, gate, density, onClose }: Props) {
  const reduced = useReducedMotion();
  const [analysis, setAnalysis] = useState<CrowdAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await fetch("/api/ai/crowd-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationType: "section", locationId: section.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Analysis unavailable.");
        return;
      }
      setAnalysis((await res.json()).data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={slideInPanel("right", reduced)}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute right-4 top-4 z-20 w-72"
    >
      <GlassCard elevation="L2" padding="md" className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-sm font-semibold text-text-primary">{section.name}</h3>
            <p className="text-xs text-text-secondary">{section.zone} · {section.tier}</p>
          </div>
          <IconButton icon={X} label="Close" size="sm" variant="ghost" onClick={onClose} />
        </div>

        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-text-secondary">Density</span>
          <span className="text-text-primary">{Math.round(density)}%</span>
        </div>
        {gate && (
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-text-secondary">{gate.name}</span>
            <Badge tone={gate.status === "open" ? "success" : gate.status === "congested" ? "warning" : "critical"}>{gate.status}</Badge>
          </div>
        )}

        {!analysis && !loading && (
          <Button size="sm" variant="secondary" className="w-full" onClick={runAnalysis}>
            <Radar size={14} />
            Run AI Crowd Analysis
          </Button>
        )}

        {loading && (
          <div className="flex justify-center py-2">
            <AIThinkingChip />
          </div>
        )}

        {error && <p className="text-xs text-state-warning">{error}</p>}

        {analysis && (
          <div className="space-y-2 border-t border-border-subtle pt-3">
            <div className="flex items-center justify-between">
              <AIBadge />
              <ConfidenceGauge confidence={analysis.confidence} size={36} />
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={RISK_TONE[analysis.riskLevel]}>{analysis.riskLevel} risk</Badge>
              <span className="font-mono text-[10px] text-text-muted">{analysis.trend}</span>
            </div>
            <p className="text-xs text-text-primary">{analysis.projection}</p>
            <p className="text-xs text-accent-cyan">{analysis.recommendation}</p>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
