"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Siren, Zap, FileWarning, AlertCircle, CheckCircle2 } from "lucide-react";
import { TopBar } from "@/components/shared/top-bar";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import { GlassCard } from "@/components/ui/glass-card";
import { Stadium3DTwin } from "@/components/ops/stadium-3d-twin";
import { Ticker, type TickerItem } from "@/components/shared/ticker";
import { ToastStack, type ToastItem } from "@/components/ui/toast";
import { KpiStrip } from "@/components/ops/kpi-strip";
import { RecommendationFeed } from "@/components/ops/recommendation-feed";
import { ZoneDetailPanel } from "@/components/ops/zone-detail-panel";
import { useGates, useCrowd, useIncidents, useMatch } from "@/hooks/useStadiumData";
import { useSocket } from "@/hooks/useSocket";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeSlideUp, staggerChildren } from "@/lib/motion/variants";
import { formatClock } from "@/lib/utils/format";
import type { StadiumSection } from "@/lib/types/db";

export default function MissionControlPage() {
  const reduced = useReducedMotion();
  const { gates } = useGates();
  const { crowd } = useCrowd();
  const { incidents } = useIncidents();
  const { match } = useMatch();
  const [sections, setSections] = useState<StadiumSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [triggering, setTriggering] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sections")
      .then((r) => r.json())
      .then((json) => setSections(json.data ?? []));
  }, []);

  useSocket("incident:new", (payload) => {
    if (payload.severity === "high" || payload.severity === "critical") {
      setToasts((prev) => [...prev, { id: `${payload.incidentId}-${Date.now()}`, message: `New ${payload.severity} incident: ${payload.locationDesc}`, tone: "critical" }]);
    }
  });

  const dismissToast = useCallback((id: ToastItem["id"]) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const selectedGate = gates.find((g) => g.section_id === selectedSectionId);
  const selectedDensity = crowd.find((c) => c.location_type === "section" && c.location_id === selectedSectionId)?.density_pct ?? 0;

  const tickerItems = useMemo<TickerItem[]>(() => {
    const items = incidents.map((i) => ({
      id: i.id,
      text: `${formatClock(i.created_at)} · ${i.severity.toUpperCase()} · ${i.type.replace("_", " ")} — ${i.location_desc}`,
    }));
    return items.length ? items : [{ id: "clear", text: "No incidents reported — all systems normal" }];
  }, [incidents]);

  const triggerScenario = async (scenario: "surge" | "incident") => {
    setTriggering(scenario);
    try {
      await fetch("/api/sim/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });
    } finally {
      setTriggering(null);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-br from-void via-void to-void/95">
      <TopBar
        title="🎮 Mission Control"
        right={
          <>
            {match && (
              <motion.span className="hidden font-mono text-xs text-accent-cyan sm:inline" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                🔴 LIVE · {match.home_team} {match.home_score}-{match.away_score} {match.away_team} · {match.minute}&apos;
              </motion.span>
            )}
            <Tooltip content="Trigger crowd surge">
              <IconButton icon={Zap} label="Surge" size="sm" variant="ghost" onClick={() => triggerScenario("surge")} disabled={triggering === "surge"} />
            </Tooltip>
            <Tooltip content="Trigger incident">
              <IconButton icon={FileWarning} label="Incident" size="sm" variant="ghost" onClick={() => triggerScenario("incident")} disabled={triggering === "incident"} />
            </Tooltip>
            <Link href="/ops/incidents">
              <IconButton icon={Siren} label="Incidents" size="sm" variant="glass" className="relative">
                {incidents.some(i => i.status !== "resolved") && (
                  <motion.span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-state-critical animate-pulse" />
                )}
              </IconButton>
            </Link>
          </>
        }
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-1 overflow-hidden gap-3 p-3 lg:p-4">
        <motion.div
          variants={fadeSlideUp(reduced)}
          initial="hidden"
          animate="visible"
          className="flex-1 min-w-0 relative"
        >
          <GlassCard
            elevation="L2"
            padding="lg"
            className="h-full rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(34,211,238,0.2)]"
          >
            <div className="absolute top-4 left-4 z-10">
              <h3 className="font-display text-sm font-semibold text-accent-cyan uppercase tracking-wider">🏟️ Stadium 3D</h3>
            </div>

            <Stadium3DTwin
              sections={sections}
              gates={gates}
              crowd={crowd}
              selectedId={selectedSectionId}
              onSelect={(id) => setSelectedSectionId(id === selectedSectionId ? null : id)}
              incidents={incidents}
            />

            {selectedSection && (
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <ZoneDetailPanel
                  section={selectedSection}
                  gate={selectedGate}
                  density={Number(selectedDensity)}
                  onClose={() => setSelectedSectionId(null)}
                />
              </div>
            )}
          </GlassCard>
        </motion.div>

        <motion.div
          variants={staggerChildren(reduced, 50)}
          initial="hidden"
          animate="visible"
          className="w-80 lg:w-96 flex flex-col gap-2 overflow-y-auto pr-1"
        >
          <motion.div variants={fadeSlideUp(reduced)}>
            <GlassCard elevation="L1" padding="md" className="bg-gradient-to-br from-state-critical/20 via-state-critical/5 to-transparent border-state-critical/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-state-critical animate-pulse" />
                <h3 className="font-display text-xs font-bold text-state-critical uppercase tracking-wider">ALERTS</h3>
              </div>
              {incidents.length === 0 ? (
                <p className="text-xs text-text-secondary">All systems nominal</p>
              ) : (
                <div className="space-y-2">
                  {incidents.slice(0, 3).map(inc => (
                    <motion.div key={inc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-xs p-2 rounded bg-state-critical/10 border border-state-critical/30">
                      <p className="font-semibold text-state-critical">{inc.type.replace('_', ' ')}</p>
                      <p className="text-text-secondary">{inc.location_desc}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeSlideUp(reduced)}>
            <GlassCard elevation="L1" padding="md">
              <div className="flex items-center gap-2 mb-2">
                {incidents.length === 0 ? (
                  <CheckCircle2 size={16} className="text-state-success" />
                ) : (
                  <AlertCircle size={16} className="text-state-critical" />
                )}
                <h3 className="font-mono text-xs font-semibold text-text-secondary uppercase">Status</h3>
              </div>
              <p className="font-display text-2xl font-bold text-text-primary mb-1">
                {incidents.length === 0 ? "98%" : "92%"}
              </p>
              <p className="text-xs text-text-secondary">Systems operational</p>
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeSlideUp(reduced)}>
            <GlassCard elevation="L1" padding="md">
              <h3 className="font-display text-xs font-bold text-accent-cyan mb-3 uppercase">Metrics</h3>
              <KpiStrip gates={gates} crowd={crowd} incidents={incidents} />
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeSlideUp(reduced)} className="flex-1 min-h-64">
            <GlassCard elevation="L1" padding="md" className="h-full flex flex-col">
              <RecommendationFeed gates={gates} onFactClick={() => {}} />
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeSlideUp(reduced)}>
            <Link href="/ops/incidents">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-accent-cyan/30 to-accent-emerald/20 hover:from-accent-cyan/40 hover:to-accent-emerald/30 border border-accent-cyan/50 text-accent-cyan font-semibold text-sm"
              >
                Incident Center
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="border-t border-border-subtle">
        <Ticker items={tickerItems} dense />
      </div>
    </div>
  );
}
