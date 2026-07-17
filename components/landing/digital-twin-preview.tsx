"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, DoorOpen, Sparkles, Clock, Radar } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { KPICard } from "@/components/shared/kpi-card";
import { DigitalTwinCanvas } from "@/components/shared/digital-twin-canvas";
import { useGates, useCrowd, useIncidents } from "@/hooks/useStadiumData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeSlideUp } from "@/lib/motion/variants";
import { formatNumber } from "@/lib/utils/format";
import type { StadiumSection } from "@/lib/types/db";

export function DigitalTwinPreview() {
  const reduced = useReducedMotion();
  const { gates } = useGates();
  const { crowd } = useCrowd();
  const { incidents } = useIncidents();
  const [sections, setSections] = useState<StadiumSection[]>([]);

  useEffect(() => {
    fetch("/api/sections")
      .then((r) => r.json())
      .then((json) => setSections(json.data ?? []));
  }, []);

  const totalPeople = crowd
    .filter((c) => c.location_type === "section")
    .reduce((sum, c) => sum + (c.people_count_estimate ?? 0), 0);
  const avgDensity =
    crowd.filter((c) => c.location_type === "gate").reduce((sum, c) => sum + Number(c.density_pct), 0) /
    Math.max(1, crowd.filter((c) => c.location_type === "gate").length);

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/[0.06] blur-[140px]" />

      <motion.div
        variants={fadeSlideUp(reduced)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mb-12 text-center"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-cyan/25 bg-accent-cyan/5 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-accent-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse-glow" />
          Live Digital Twin
        </div>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">Live Stadium Intelligence</h2>
        <p className="mx-auto mt-3 max-w-xl text-text-secondary">
          This is Mission Control&apos;s Digital Twin, previewed here — updating from the exact same live data feed, right now.
        </p>
      </motion.div>

      <motion.div
        variants={fadeSlideUp(reduced)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <GlassCard elevation="L2" padding="lg" className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-accent-cyan/[0.05] to-transparent animate-scan" />
          <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.025]" />

          <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex shrink-0 items-center justify-center">
              <div className="pointer-events-none absolute h-[480px] w-[480px] rounded-full bg-accent-cyan/[0.05] blur-[80px]" />
              <DigitalTwinCanvas gates={gates} sections={sections} crowd={crowd} size={480} interactive={false} className="relative" />
              <div className="absolute -top-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-accent-cyan/30 bg-void/80 px-2.5 py-1 font-mono text-[10px] text-accent-cyan backdrop-blur">
                <Radar size={11} className="animate-pulse-glow" />
                SCANNING
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 lg:w-64 lg:grid-cols-1">
              <KPICard icon={Users} label="Fans Inside" value={totalPeople} className="glass rounded-md" />
              <KPICard icon={DoorOpen} label="Gates Congested" value={gates.filter((g) => g.status === "congested").length} className="glass rounded-md" />
              <KPICard icon={Sparkles} label="Avg Gate Density" value={Math.round(avgDensity)} suffix="%" className="glass rounded-md" />
              <KPICard icon={Clock} label="Active Incidents" value={incidents.filter((i) => i.status !== "resolved").length} className="glass rounded-md" />
            </div>
          </div>
        </GlassCard>
        <p className="mt-4 text-center font-mono text-xs text-text-muted">
          {formatNumber(sections.length)} sections · {formatNumber(gates.length)} gates · live via Socket.io
        </p>
      </motion.div>
    </section>
  );
}
