"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";
import { AIReasoningCard } from "@/components/shared/ai-reasoning-card";
import { AIThinkingChip } from "@/components/shared/ai-thinking-chip";
import { InlineErrorNotice } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import type { AiRecommendation } from "@/lib/types/ai";
import type { StadiumGate } from "@/lib/types/db";

interface Props {
  gates: StadiumGate[];
  onFactClick?: (fact: string) => void;
}

export function RecommendationFeed({ gates, onFactClick }: Props) {
  const [recommendations, setRecommendations] = useState<(AiRecommendation & { generatedAt: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core fetch — has no synchronous setState calls before the first await,
  // so it's safe to invoke directly from the mount effect below. Callers
  // that need to reset `loading`/`error` first (the manual refresh button)
  // do so themselves before calling this, outside of any effect.
  const fetchRecommendations = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/ops-recommendations");
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "AI recommendations unavailable.");
        return;
      }
      const json = await res.json();
      setError(null);
      setRecommendations(json.data.recommendations.map((r: AiRecommendation) => ({ ...r, generatedAt: json.meta.generatedAt })));
    } catch {
      setError("Connection issue fetching recommendations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchRecommendations();
  }, [fetchRecommendations]);

  const approve = async (rec: AiRecommendation) => {
    const text = `${rec.title} ${rec.rationale}`.toLowerCase();
    const targetGate = gates.find((g) => text.includes(g.name.toLowerCase()) && g.status !== "open");
    if (targetGate) {
      await fetch(`/api/gates/${targetGate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "open" }),
      });
    }
    setRecommendations((prev) => prev.filter((r) => r !== rec));
  };

  const dismiss = (rec: AiRecommendation) => {
    setRecommendations((prev) => prev.filter((r) => r !== rec));
  };

  return (
    <div className="flex h-full flex-col min-h-0">
      <div className="flex items-center justify-between px-1 pb-2">
        <h2 className="font-display text-xs font-semibold uppercase tracking-wide text-text-secondary">🤖 Recommendations</h2>
        <div className="flex items-center gap-2">
          {loading && <AIThinkingChip />}
          <IconButton icon={RefreshCw} label="Refresh" size="sm" variant="ghost" onClick={load} disabled={loading} />
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1 min-h-0">
        {loading && !recommendations.length && (
          <div className="space-y-1">
            {[1, 2].map(i => (
              <div key={i} className="h-12 bg-surface rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-state-critical/10 border border-state-critical/30 p-3">
            <p className="text-xs text-state-critical">AI service temporarily unavailable. Manual monitoring active.</p>
          </div>
        )}

        {!loading && !error && recommendations.length === 0 && (
          <EmptyState
            icon={Sparkles}
            title="All Clear"
            description="Stadium optimized. AI monitoring active."
          />
        )}

        <AnimatePresence>
          {recommendations.map((rec, i) => (
            <AIReasoningCard
              key={`${rec.title}-${i}`}
              title={rec.title}
              rationale={rec.rationale}
              confidence={rec.confidence}
              affectedFacts={rec.affectedFacts}
              generatedAt={rec.generatedAt}
              onFactClick={(fact) => onFactClick?.(fact)}
              onApprove={() => approve(rec)}
              onDismiss={() => dismiss(rec)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
