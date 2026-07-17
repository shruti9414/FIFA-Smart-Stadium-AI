"use client";

import { useState } from "react";
import { HeartPulse, ShieldAlert, Users, Flame, CloudRain, HelpCircle } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { Chip } from "@/components/ui/chip";
import { StatusChip } from "@/components/ui/status-chip";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { IncidentRow } from "@/lib/types/db";
import type { Severity } from "@/lib/types/ui";

const TYPE_ICON: Record<string, typeof HeartPulse> = {
  medical: HeartPulse,
  security: ShieldAlert,
  crowd_surge: Users,
  fire: Flame,
  weather: CloudRain,
  lost_item: HelpCircle,
  other: HelpCircle,
};

const SEVERITY_BORDER: Record<Severity, string> = {
  low: "border-l-state-success",
  medium: "border-l-state-warning",
  high: "border-l-state-critical",
  critical: "border-l-state-critical",
};

interface Props {
  incidents: IncidentRow[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function IncidentList({ incidents, selectedId, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");

  const filtered = incidents.filter((i) => {
    const matchesSearch = search === "" || i.type.includes(search.toLowerCase()) || i.location_desc?.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === "all" || i.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 space-y-2 border-b border-border-subtle bg-void/80 p-3 backdrop-blur">
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search incidents..." />
        <div className="flex gap-1.5 overflow-x-auto">
          {(["all", "critical", "high", "medium", "low"] as const).map((s) => (
            <Chip key={s} selected={severityFilter === s} onClick={() => setSeverityFilter(s)}>
              {s}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex-1 divide-y divide-border-subtle overflow-y-auto">
        {filtered.map((incident) => {
          const TypeIcon = TYPE_ICON[incident.type] ?? HelpCircle;
          const isSelected = incident.id === selectedId;
          return (
            <button
              key={incident.id}
              onClick={() => onSelect(incident.id)}
              className={cn(
                "flex w-full items-center gap-3 border-l-[3px] px-3 py-3 text-left transition-colors",
                SEVERITY_BORDER[incident.severity],
                isSelected ? "bg-glass-elevated" : "hover:bg-glass"
              )}
            >
              <TypeIcon size={16} className="shrink-0 text-text-secondary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">{incident.location_desc}</p>
                <p className="font-mono text-[11px] text-text-muted">{formatRelativeTime(incident.created_at)}</p>
              </div>
              <StatusChip
                tone={incident.status === "resolved" ? "success" : incident.status === "reported" ? "critical" : "warning"}
                label={incident.status.replace("_", " ")}
              />
            </button>
          );
        })}
        {filtered.length === 0 && <p className="p-4 text-center text-sm text-text-secondary">No matching incidents.</p>}
      </div>
    </div>
  );
}
