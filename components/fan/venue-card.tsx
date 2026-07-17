"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Star, MapPin, Footprints, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusChip } from "@/components/ui/status-chip";
import { MiniMapPreview } from "@/components/fan/mini-map-preview";
import { seededRange } from "@/lib/utils/seededStats";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

export interface VenueCardProps {
  icon: LucideIcon;
  name: string;
  category: string;
  zone: string;
  headerGradient: string;
  isBestPick?: boolean;
  metricLabel: string;
  metricValue: string;
  metricPct: number; // 0-100, drives the animated live bar
  metricTone: "success" | "warning" | "critical";
  statusLabel: string;
  statusTone: "success" | "warning" | "critical" | "neutral";
  seedKey: string;
  onClick?: () => void;
}

export function VenueCard({
  icon: Icon,
  name,
  category,
  zone,
  headerGradient,
  isBestPick = false,
  metricLabel,
  metricValue,
  metricPct,
  metricTone,
  statusLabel,
  statusTone,
  seedKey,
  onClick,
}: VenueCardProps) {
  const reduced = useReducedMotion();
  const rating = seededRange(`${seedKey}-rating`, 3.6, 5.0);
  const walkMin = Math.round(seededRange(`${seedKey}-walk`, 2, 9));
  const distanceM = Math.round(seededRange(`${seedKey}-dist`, 40, 320));

  const barColor = metricTone === "success" ? "bg-state-success" : metricTone === "warning" ? "bg-state-warning" : "bg-state-critical";

  return (
    <GlassCard
      padding="none"
      hover
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn("group relative flex h-full flex-col overflow-hidden text-left", isBestPick && "border-accent-cyan/40", onClick && "cursor-pointer")}
    >
      {isBestPick && (
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full border border-accent-cyan/40 bg-void/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-accent-cyan backdrop-blur">
          <Sparkles size={9} />
          AI Pick
        </div>
      )}

      {/* "photo" header — gradient + watermark icon, since no real venue photography exists */}
      <div className={cn("relative flex h-20 items-center justify-center overflow-hidden", headerGradient)}>
        <Icon size={56} className="absolute -bottom-3 -right-3 text-white/10" strokeWidth={1} />
        <Icon size={22} className="relative z-10 text-white/90" strokeWidth={1.75} />
        <div className="absolute left-2 top-2">
          <MiniMapPreview zone={zone} size={32} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-text-primary">{name}</h4>
            <p className="text-[11px] text-text-secondary">{category}</p>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 font-mono text-[11px] text-state-warning">
            <Star size={11} fill="currentColor" />
            {rating.toFixed(1)}
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-text-muted">
          <span className="flex items-center gap-1">
            <Footprints size={10} />
            {walkMin} min
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={10} />
            {distanceM}m
          </span>
        </div>

        <div className="mt-auto space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-text-muted">{metricLabel}</span>
            <span className="font-mono text-text-secondary">{metricValue}</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-glass-elevated">
            <motion.div
              className={cn("h-full rounded-full", barColor)}
              initial={{ width: 0 }}
              animate={{ width: `${metricPct}%` }}
              transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <StatusChip tone={statusTone} label={statusLabel} />
        </div>
      </div>
    </GlassCard>
  );
}
