"use client";

import { CloudSun, Thermometer, Users, DoorOpen, ParkingCircle, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useGates, useCrowd, useParking } from "@/hooks/useStadiumData";
import { useCountUp } from "@/hooks/useCountUp";
import { formatNumber } from "@/lib/utils/format";
import { seededRange } from "@/lib/utils/seededStats";

const today = new Date().toISOString().slice(0, 10);
const temp = Math.round(seededRange(`weather-${today}`, 18, 27));
const conditions = ["Clear", "Partly Cloudy", "Mild Breeze"][Math.round(seededRange(`weather-cond-${today}`, 0, 2))];

export function LiveWidgetsRow() {
  const { gates } = useGates();
  const { crowd } = useCrowd();
  const { parking } = useParking();

  const totalPeople = crowd.filter((c) => c.location_type === "section").reduce((sum, c) => sum + (c.people_count_estimate ?? 0), 0);
  const displayPeople = useCountUp(totalPeople);
  const openGates = gates.filter((g) => g.status === "open").length;
  const avgParking = parking.length ? Math.round(parking.reduce((s, p) => s + (p.occupied_spots / p.total_spots) * 100, 0) / parking.length) : 0;

  const widgets = [
    { icon: CloudSun, label: "Weather", value: conditions, tone: "text-accent-cyan" },
    { icon: Thermometer, label: "Temperature", value: `${temp}°C`, tone: "text-accent-emerald" },
    { icon: Users, label: "Fans Inside", value: formatNumber(displayPeople), tone: "text-accent-cyan" },
    { icon: DoorOpen, label: "Gates Open", value: `${openGates}/${gates.length || 8}`, tone: "text-state-success" },
    { icon: ParkingCircle, label: "Parking", value: `${avgParking}% full`, tone: avgParking > 85 ? "text-state-warning" : "text-state-success" },
    { icon: CheckCircle2, label: "Entry Status", value: "Checked In", tone: "text-state-success" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {widgets.map((w) => (
        <GlassCard key={w.label} padding="sm" className="flex flex-col items-center gap-1.5 text-center">
          <w.icon size={18} className={w.tone} strokeWidth={1.75} />
          <span className="font-mono text-sm font-semibold text-text-primary">{w.value}</span>
          <span className="font-mono text-[9px] uppercase tracking-wide text-text-muted">{w.label}</span>
        </GlassCard>
      ))}
    </div>
  );
}
