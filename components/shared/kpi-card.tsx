"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { useCountUp } from "@/hooks/useCountUp";
import { formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/** §9.7 StatTile/KPICard — label, animated count-up value, trend arrow. Used in Mission Control's KPI strip. */
export interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  trend?: "up" | "down" | "flat";
  trendLabel?: string;
  suffix?: string;
  className?: string;
}

const TREND_ICON = { up: ArrowUp, down: ArrowDown, flat: Minus } as const;
const TREND_COLOR = {
  up: "text-state-success",
  down: "text-state-critical",
  flat: "text-text-muted",
} as const;

export function KPICard({ icon, label, value, trend, trendLabel, suffix = "", className }: KPICardProps) {
  const displayValue = useCountUp(value);

  return (
    <div className={cn("flex flex-col gap-1.5 px-4 py-3", className)}>
      <div className="flex items-center gap-1.5 text-text-secondary">
        <Icon icon={icon} size={14} />
        <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <span className="font-mono text-2xl font-semibold text-text-primary tabular-nums">
        {formatNumber(displayValue)}
        {suffix}
      </span>
      {trend && (
        <div className={cn("flex items-center gap-1 text-xs font-medium", TREND_COLOR[trend])}>
          <Icon icon={TREND_ICON[trend]} size={12} />
          {trendLabel}
        </div>
      )}
    </div>
  );
}
