"use client";

import { Radio, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AIBadge } from "@/components/shared/ai-badge";
import { TicketCard } from "@/components/fan/ticket-card";
import { useMatch } from "@/hooks/useStadiumData";

const TICKET = { section: "208", row: "C", seat: "14", gate: "Gate 4", holder: "M. Rodriguez" };

export function TicketMatchBriefingRow() {
  const { match } = useMatch();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <TicketCard ticket={TICKET} />

      <GlassCard padding="lg" className="flex flex-col justify-center gap-2">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-accent-cyan">
          <Radio size={11} className="animate-pulse-glow" />
          {match?.status === "live" ? "Live Now" : "Match Status"}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">{match?.home_team ?? "TBD"}</span>
          <span className="font-mono text-2xl font-bold tabular-nums text-text-primary">
            {match ? `${match.home_score}-${match.away_score}` : "–:–"}
          </span>
          <span className="text-sm font-medium text-text-primary">{match?.away_team ?? "TBD"}</span>
        </div>
        <p className="text-center font-mono text-xs text-text-secondary">
          {match?.status === "live" ? `${match.minute}' — ${match.stage}` : (match?.stage ?? "")}
        </p>
      </GlassCard>

      <GlassCard padding="lg" className="space-y-2 border-l-2 border-l-accent-cyan">
        <div className="flex items-center justify-between">
          <AIBadge />
        </div>
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="mt-0.5 shrink-0 text-accent-cyan" />
          <p className="text-sm text-text-primary">
            Gate 4 is congested — Navigate suggests Gate 3B instead, saving roughly 8-11 minutes.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
