"use client";

import { useMemo } from "react";
import { UtensilsCrossed, DoorOpen, Car } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AIBadge } from "@/components/shared/ai-badge";
import { ConfidenceGauge } from "@/components/shared/confidence-gauge";
import { useFoodStalls, useGates, useParking } from "@/hooks/useStadiumData";

/** Synthesized (not a fresh Gemini call per render) AI-style suggestion cards — derived from the same live facts the Assistant and Navigate features reason over, framed as quick proactive tips. */
export function AISuggestionsSection() {
  const { foodStalls } = useFoodStalls();
  const { gates } = useGates();
  const { parking } = useParking();

  const suggestions = useMemo(() => {
    const list: { icon: typeof UtensilsCrossed; title: string; rationale: string; confidence: number }[] = [];

    const bestFood = [...foodStalls].filter((f) => f.status === "open").sort((a, b) => a.wait_time_min - b.wait_time_min)[0];
    if (bestFood) {
      list.push({
        icon: UtensilsCrossed,
        title: `Grab food at ${bestFood.name}`,
        rationale: `Only ${bestFood.wait_time_min} min wait right now — shortest line among open stalls.`,
        confidence: 88,
      });
    }

    const congested = gates.find((g) => g.status === "congested");
    const alternate = gates.find((g) => g.status === "open" && g.zone === congested?.zone);
    if (congested) {
      list.push({
        icon: DoorOpen,
        title: alternate ? `Avoid ${congested.name} — use ${alternate.name}` : `${congested.name} is busy`,
        rationale: alternate
          ? `${congested.name} has a long queue right now; ${alternate.name} in the same zone is moving faster.`
          : `Queue estimate is ${congested.current_queue_estimate} min — consider waiting a few minutes before heading over.`,
        confidence: 91,
      });
    }

    const bestParking = [...parking].sort((a, b) => a.occupied_spots / a.total_spots - b.occupied_spots / b.total_spots)[0];
    if (bestParking) {
      const pct = Math.round((bestParking.occupied_spots / bestParking.total_spots) * 100);
      list.push({
        icon: Car,
        title: `${bestParking.lot_name} has the most space`,
        rationale: `${pct}% full — your best option if you're arriving by car.`,
        confidence: 82,
      });
    }

    return list;
  }, [foodStalls, gates, parking]);

  if (suggestions.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {suggestions.map((s) => (
        <GlassCard key={s.title} padding="md" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-accent-cyan/10">
              <s.icon size={18} className="text-accent-cyan" strokeWidth={1.75} />
            </div>
            <ConfidenceGauge confidence={s.confidence} size={36} />
          </div>
          <div className="flex items-center justify-between">
            <AIBadge />
          </div>
          <h4 className="text-sm font-semibold text-text-primary">{s.title}</h4>
          <p className="text-xs text-text-secondary">{s.rationale}</p>
        </GlassCard>
      ))}
    </div>
  );
}
