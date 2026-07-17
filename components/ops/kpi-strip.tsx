"use client";

import { Users, DoorOpen, Siren, Timer } from "lucide-react";
import { KPICard } from "@/components/shared/kpi-card";
import { Divider } from "@/components/ui/divider";
import type { StadiumGate, CrowdDataRow, IncidentRow } from "@/lib/types/db";

export function KpiStrip({ gates, crowd, incidents }: { gates: StadiumGate[]; crowd: CrowdDataRow[]; incidents: IncidentRow[] }) {
  const totalPeople = crowd
    .filter((c) => c.location_type === "section")
    .reduce((sum, c) => sum + (c.people_count_estimate ?? 0), 0);
  const congested = gates.filter((g) => g.status === "congested").length;
  const closed = gates.filter((g) => g.status === "closed").length;
  const activeIncidents = incidents.filter((i) => i.status !== "resolved").length;
  const avgQueue = gates.length ? Math.round(gates.reduce((s, g) => s + g.current_queue_estimate, 0) / gates.length) : 0;

  return (
    <div className="glass flex items-stretch divide-x divide-border-subtle overflow-x-auto rounded-md">
      <KPICard icon={Users} label="Fans Inside" value={totalPeople} className="min-w-[140px]" />
      <Divider orientation="vertical" />
      <KPICard icon={DoorOpen} label="Gates Congested" value={congested} trend={congested > 1 ? "up" : "flat"} trendLabel={`${closed} closed`} className="min-w-[140px]" />
      <Divider orientation="vertical" />
      <KPICard icon={Siren} label="Active Incidents" value={activeIncidents} trend={activeIncidents > 0 ? "up" : "flat"} trendLabel={activeIncidents > 0 ? "needs attention" : "all clear"} className="min-w-[140px]" />
      <Divider orientation="vertical" />
      <KPICard icon={Timer} label="Avg Gate Queue" value={avgQueue} suffix=" min" className="min-w-[140px]" />
    </div>
  );
}
