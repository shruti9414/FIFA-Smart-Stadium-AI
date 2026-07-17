"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { AIBadge } from "@/components/shared/ai-badge";
import { ConfidenceGauge } from "@/components/shared/confidence-gauge";
import { AIThinkingChip } from "@/components/shared/ai-thinking-chip";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeSlideUp } from "@/lib/motion/variants";
import type { IncidentCommanderResult } from "@/lib/ai/incidentCommander";

export function CommanderMode({ onDeescalate }: { onDeescalate: () => void }) {
  const reduced = useReducedMotion();
  const [plan, setPlan] = useState<IncidentCommanderResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ai/incidents/commander", { method: "POST" })
      .then((r) => {
        if (!r.ok) {
          return r.text().then((text) => {
            try {
              const json = JSON.parse(text);
              return Promise.reject(json);
            } catch {
              return Promise.reject({ error: `Server error (${r.status}): ${text.slice(0, 100)}` });
            }
          });
        }
        return r.text().then((text) => {
          if (!text) {
            return Promise.reject({ error: "Empty response from server" });
          }
          try {
            return JSON.parse(text);
          } catch {
            return Promise.reject({ error: `Invalid JSON response: ${text.slice(0, 100)}` });
          }
        });
      })
      .then((json) => setPlan(json.data))
      .catch((e) => {
        const errorMsg =
          typeof e === "string"
            ? e
            : e?.error || e?.message || "Commander Mode unavailable - check logs";
        setError(errorMsg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      variants={fadeSlideUp(reduced)}
      initial="hidden"
      animate="visible"
      className="relative min-h-full space-y-4 overflow-hidden p-4 sm:p-6"
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-[400px] w-[400px] rounded-full bg-state-critical/10 blur-[120px]" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={22} className="text-state-critical" />
          <h2 className="font-display text-xl font-semibold text-text-primary">AI Incident Commander</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onDeescalate}>
          <ArrowLeft size={14} />
          De-escalate
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <AIThinkingChip label="Synthesizing cross-incident action plan..." />
        </div>
      )}

      {error && <p className="text-sm text-state-warning">{error}</p>}

      {plan && (
        <GlassCard elevation="L2" padding="lg" className="relative space-y-4">
          <div className="flex items-center justify-between">
            <AIBadge />
            <ConfidenceGauge confidence={plan.confidence} size={56} />
          </div>
          <p className="text-base text-text-primary">{plan.situationAssessment}</p>

          <div className="space-y-2 border-t border-border-subtle pt-4">
            {plan.rankedActions
              .sort((a, b) => a.priority - b.priority)
              .map((action) => (
                <div key={action.priority} className="flex gap-3 rounded-sm bg-glass p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-state-critical/20 font-mono text-xs font-bold text-state-critical">
                    {action.priority}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{action.action}</p>
                    <p className="text-xs text-text-secondary">{action.rationale}</p>
                  </div>
                </div>
              ))}
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
}
