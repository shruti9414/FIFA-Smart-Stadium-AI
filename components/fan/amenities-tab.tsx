"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, Car, Bus, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Chip } from "@/components/ui/chip";
import { VenueCard } from "@/components/fan/venue-card";
import { VenueDetailDrawer, type VenueDetail } from "@/components/fan/venue-detail-drawer";
import { useFoodStalls, useParking, useTransport } from "@/hooks/useStadiumData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeSlideUp, staggerChildren } from "@/lib/motion/variants";

type Filter = "all" | "food" | "parking" | "transport";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "food", label: "Food" },
  { id: "parking", label: "Parking" },
  { id: "transport", label: "Transport" },
];

const ZONES = ["North", "East", "South", "West"];
function extractZone(text: string): string {
  return ZONES.find((z) => text.includes(z)) ?? "North";
}

export function AmenitiesTab({ onGetDirections }: { onGetDirections?: () => void }) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const [detail, setDetail] = useState<VenueDetail | null>(null);
  const { foodStalls } = useFoodStalls();
  const { parking } = useParking();
  const { transport } = useTransport();

  const bestFood = useMemo(
    () => [...foodStalls].filter((f) => f.status === "open").sort((a, b) => a.wait_time_min - b.wait_time_min)[0],
    [foodStalls]
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <Chip key={f.id} selected={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </Chip>
        ))}
      </div>

      {bestFood && (filter === "all" || filter === "food") && (
        <GlassCard gradientBorder padding="md" className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent-cyan">
            <Sparkles size={12} />
            Best Pick Right Now
          </div>
          <h3 className="font-display text-base font-semibold text-text-primary">{bestFood.name}</h3>
          <p className="text-xs text-text-secondary">
            Only {bestFood.wait_time_min} min wait — shortest line among open {bestFood.category?.toLowerCase()} stalls.
          </p>
        </GlassCard>
      )}

      <motion.div variants={staggerChildren(reduced)} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {(filter === "all" || filter === "food") &&
          foodStalls.map((f) => (
            <motion.div key={`food-${f.id}`} variants={fadeSlideUp(reduced)}>
              <VenueCard
                icon={UtensilsCrossed}
                name={f.name}
                category={f.category ?? "Food"}
                zone={f.zone}
                headerGradient="bg-gradient-to-br from-amber-500/40 to-orange-600/30"
                isBestPick={bestFood?.id === f.id}
                metricLabel="Queue"
                metricValue={`${f.wait_time_min} min`}
                metricPct={Math.min(100, f.wait_time_min * 6)}
                metricTone={f.wait_time_min <= 5 ? "success" : f.wait_time_min <= 12 ? "warning" : "critical"}
                statusLabel={f.status.replace("_", " ")}
                statusTone={f.status === "open" ? "success" : "neutral"}
                seedKey={`food-${f.id}`}
                onClick={() =>
                  setDetail({
                    icon: UtensilsCrossed,
                    name: f.name,
                    category: f.category ?? "Food",
                    zone: f.zone,
                    headerGradient: "bg-gradient-to-br from-amber-500/40 to-orange-600/30",
                    metricLabel: "Queue",
                    metricValue: `${f.wait_time_min} min`,
                    statusLabel: f.status.replace("_", " "),
                    statusTone: f.status === "open" ? "success" : "neutral",
                    seedKey: `food-${f.id}`,
                  })
                }
              />
            </motion.div>
          ))}

        {(filter === "all" || filter === "parking") &&
          parking.map((p) => {
            const pct = Math.round((p.occupied_spots / p.total_spots) * 100);
            const zone = extractZone(p.lot_name);
            return (
              <motion.div key={`parking-${p.id}`} variants={fadeSlideUp(reduced)}>
                <VenueCard
                  icon={Car}
                  name={p.lot_name}
                  category="Parking"
                  zone={zone}
                  headerGradient="bg-gradient-to-br from-blue-500/40 to-indigo-600/30"
                  metricLabel="Occupancy"
                  metricValue={`${p.occupied_spots}/${p.total_spots}`}
                  metricPct={pct}
                  metricTone={pct < 70 ? "success" : pct < 95 ? "warning" : "critical"}
                  statusLabel={p.status}
                  statusTone={p.status === "open" ? "success" : p.status === "filling" ? "warning" : "critical"}
                  seedKey={`parking-${p.id}`}
                  onClick={() =>
                    setDetail({
                      icon: Car,
                      name: p.lot_name,
                      category: "Parking",
                      zone,
                      headerGradient: "bg-gradient-to-br from-blue-500/40 to-indigo-600/30",
                      metricLabel: "Occupancy",
                      metricValue: `${p.occupied_spots}/${p.total_spots}`,
                      statusLabel: p.status,
                      statusTone: p.status === "open" ? "success" : p.status === "filling" ? "warning" : "critical",
                      seedKey: `parking-${p.id}`,
                    })
                  }
                />
              </motion.div>
            );
          })}

        {(filter === "all" || filter === "transport") &&
          transport.map((t) => {
            const zone = extractZone(t.route_name ?? "");
            return (
              <motion.div key={`transport-${t.id}`} variants={fadeSlideUp(reduced)}>
                <VenueCard
                  icon={Bus}
                  name={t.route_name ?? t.mode}
                  category="Transport"
                  zone={zone}
                  headerGradient="bg-gradient-to-br from-violet-500/40 to-purple-600/30"
                  metricLabel="Next Arrival"
                  metricValue={`${t.next_arrival_min} min`}
                  metricPct={Number(t.capacity_pct)}
                  metricTone={t.status === "on_time" ? "success" : t.status === "delayed" ? "warning" : "critical"}
                  statusLabel={t.status.replace("_", " ")}
                  statusTone={t.status === "on_time" ? "success" : t.status === "delayed" ? "warning" : "critical"}
                  seedKey={`transport-${t.id}`}
                  onClick={() =>
                    setDetail({
                      icon: Bus,
                      name: t.route_name ?? t.mode,
                      category: "Transport",
                      zone,
                      headerGradient: "bg-gradient-to-br from-violet-500/40 to-purple-600/30",
                      metricLabel: "Next Arrival",
                      metricValue: `${t.next_arrival_min} min`,
                      statusLabel: t.status.replace("_", " "),
                      statusTone: t.status === "on_time" ? "success" : t.status === "delayed" ? "warning" : "critical",
                      seedKey: `transport-${t.id}`,
                    })
                  }
                />
              </motion.div>
            );
          })}
      </motion.div>

      <VenueDetailDrawer
        venue={detail}
        onClose={() => setDetail(null)}
        onGetDirections={() => {
          setDetail(null);
          onGetDirections?.();
        }}
      />
    </div>
  );
}
