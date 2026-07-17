"use client";

import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIBadge } from "@/components/shared/ai-badge";
import { AIThinkingChip } from "@/components/shared/ai-thinking-chip";
import { AIReasoningCard } from "@/components/shared/ai-reasoning-card";
import { formatClock, formatRelativeTime } from "@/lib/utils/format";
import type { IncidentRow } from "@/lib/types/db";
import type { EmergencyDecisionResult } from "@/lib/ai/emergencyDecision";

const SEVERITY_TONE = { low: "success", medium: "warning", high: "critical", critical: "critical" } as const;

interface Props {
  incident: IncidentRow;
  canEscalate: boolean;
  onEscalate: () => void;
}

export function IncidentDetail({ incident, canEscalate, onEscalate }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [decision, setDecision] = useState<EmergencyDecisionResult | null>(null);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [decisionError, setDecisionError] = useState<string | null>(null);

  // The parent renders this component with `key={incident.id}` (see
  // app/ops/incidents/page.tsx), so switching incidents fully remounts it —
  // state above already starts at its correct initial value with no manual
  // reset needed; this effect only needs to perform the fetch.
  useEffect(() => {
    fetch(`/api/ai/incidents/${incident.id}/summary`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => setSummary(json.data.summary))
      .catch(() => setSummary(null))
      .finally(() => setSummaryLoading(false));
  }, [incident.id]);

  const getDecisionSupport = async () => {
    setDecisionLoading(true);
    setDecisionError(null);
    try {
      const res = await fetch(`/api/ai/incidents/${incident.id}/decision-support`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        setDecisionError(err.error ?? "Decision support unavailable.");
        return;
      }
      setDecision((await res.json()).data);
    } finally {
      setDecisionLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone={SEVERITY_TONE[incident.severity]}>{incident.severity}</Badge>
            <h2 className="font-display text-xl font-semibold capitalize text-text-primary">{incident.type.replace("_", " ")}</h2>
          </div>
          <p className="mt-1 text-sm text-text-secondary">{incident.location_desc}</p>
          <p className="font-mono text-xs text-text-muted">
            Reported {formatClock(incident.created_at)} by {incident.reported_by}
          </p>
        </div>
        <Button
          variant={canEscalate ? "primary" : "secondary"}
          size="sm"
          disabled={!canEscalate}
          onClick={onEscalate}
          className={canEscalate ? "animate-pulse-glow" : "opacity-50"}
        >
          <Radio size={14} />
          Escalate to Commander Mode
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard padding="md">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Raw Log</h3>
          <ul className="space-y-2 font-mono text-xs text-text-secondary">
            <li>
              <span className="text-text-muted">{formatClock(incident.created_at)}</span> — Reported by {incident.reported_by}
            </li>
            <li className="text-text-primary">{incident.description}</li>
            <li>
              <span className="text-text-muted">{formatClock(incident.updated_at)}</span> — Status: {incident.status.replace("_", " ")}
            </li>
          </ul>
        </GlassCard>

        <GlassCard padding="md">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">AI Summary</h3>
            {summary && <AIBadge />}
          </div>
          {summaryLoading ? (
            <AIThinkingChip label="Condensing incident log..." />
          ) : summary ? (
            <p className="text-sm text-text-primary">{summary}</p>
          ) : (
            <p className="text-sm text-text-secondary">AI summary unavailable right now.</p>
          )}
        </GlassCard>
      </div>

      {!decision && !decisionLoading && (
        <Button variant="secondary" onClick={getDecisionSupport}>
          Get AI Decision Support
        </Button>
      )}
      {decisionLoading && (
        <div className="flex justify-center py-4">
          <AIThinkingChip label="Preparing emergency decision support..." />
        </div>
      )}
      {decisionError && <p className="text-sm text-state-warning">{decisionError}</p>}
      {decision && (
        <AIReasoningCard
          size="full"
          title={decision.evacuationNeeded ? "Evacuation Recommended" : "Emergency Decision Support"}
          rationale={decision.rationale || ""}
          confidence={decision.confidence || 0}
          affectedFacts={[
            ...(decision.recommendedUnit ? [`Unit: ${decision.recommendedUnit}`] : []),
            ...(decision.recommendedExitClosures ? decision.recommendedExitClosures.map((e) => `Close: ${e}`) : []),
          ]}
          generatedAt={new Date().toISOString()}
        />
      )}
      {decision && decision.immediateActions && decision.immediateActions.length > 0 && (
        <ul className="space-y-1.5 pl-1">
          {decision.immediateActions.map((a, i) => (
            <li key={i} className="flex gap-2 text-sm text-text-primary">
              <span className="text-accent-cyan">•</span>
              {a}
            </li>
          ))}
        </ul>
      )}

      <p className="font-mono text-[10px] text-text-muted">Last updated {formatRelativeTime(incident.updated_at)}</p>
    </div>
  );
}
