"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Siren, Zap, FileWarning } from "lucide-react";
import { TopBar } from "@/components/shared/top-bar";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import { Stadium3DProduction } from "@/components/mission-control/stadium-3d-production";
import { IncidentQueue } from "@/components/mission-control/incident-queue";
import { OperationalTimeline } from "@/components/mission-control/operational-timeline";
import { useGates, useCrowd, useIncidents, useMatch } from "@/hooks/useStadiumData";
import { formatClock } from "@/lib/utils/format";
import type { StadiumSection } from "@/lib/types/db";

export default function MissionControlPage() {
  const { gates } = useGates();
  const { crowd } = useCrowd();
  const { incidents } = useIncidents();
  const { match } = useMatch();

  const [sections, setSections] = useState<StadiumSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);
  const [aiCommands, setAiCommands] = useState<any[]>([
    {
      id: "cmd-1",
      title: "Open Gate 3A",
      rationale: "Crowd surge detected in North sector. Redistribute 2K pax",
      confidence: 92,
      impact: "Crowd Flow",
      status: "pending",
    },
    {
      id: "cmd-2",
      title: "Activate Medical Team",
      rationale: "Minor incident reported in Section 12. Deploy paramedics",
      confidence: 87,
      impact: "Safety",
      status: "pending",
    },
  ]);
  const [triggering, setTriggering] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sections")
      .then((r) => r.json())
      .then((json) => setSections(json.data ?? []))
      .catch((err) => console.error("Failed to fetch sections:", err));
  }, []);

  // When incident is selected, focus on its section
  useEffect(() => {
    if (selectedIncidentId) {
      const incident = incidents.find((i) => i.id === selectedIncidentId);
      if (incident) {
        setSelectedSectionId(incident.location_id || null);
      }
    }
  }, [selectedIncidentId, incidents]);

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

  const approveCommand = (commandId: string) => {
    setAiCommands((prev) =>
      prev.map((cmd) => (cmd.id === commandId ? { ...cmd, status: "approved" } : cmd))
    );
  };

  const rejectCommand = (commandId: string) => {
    setAiCommands((prev) => prev.filter((cmd) => cmd.id !== commandId));
  };

  // Filter AI commands based on selected incident
  const relevantCommands = selectedIncidentId
    ? aiCommands.filter((cmd) =>
        cmd.rationale.toLowerCase().includes(incidents.find((i) => i.id === selectedIncidentId)?.location_desc.toLowerCase() || "")
      )
    : aiCommands;

  return (
    <div className="flex flex-col h-screen w-screen bg-black overflow-hidden">
      {/* Top Bar */}
      <TopBar
        title="🎮 Mission Control"
        right={
          <>
            {match && (
              <motion.span className="font-mono text-xs text-accent-cyan" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

      {/* Main 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden gap-0">
        {/* Left: Incident Queue */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 flex flex-col overflow-hidden"
        >
          <IncidentQueue
            incidents={incidents}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={setSelectedIncidentId}
          />
        </motion.div>

        {/* Center: 3D Stadium */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 relative overflow-hidden"
          style={{ minHeight: 0 }}
        >
          <Stadium3DProduction
            sections={sections}
            gates={gates}
            crowd={crowd}
            incidents={incidents}
          />

          {/* Live Stats Overlay */}
          <div className="absolute top-4 left-4 pointer-events-none space-y-1 z-50">
            <div className="text-xs text-accent-cyan font-mono bg-black/60 p-2 rounded border border-accent-cyan/30">
              <div>🏟️ {sections.length} Sections</div>
              <div>🚪 {gates.filter(g => g.status === "open").length}/{gates.length} Gates Open</div>
              <div>🚨 {incidents.filter(i => i.status !== "resolved").length} Active Incidents</div>
            </div>
          </div>

          {/* Selected Incident Info */}
          {selectedIncidentId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 max-w-sm pointer-events-none"
            >
              {incidents.find((i) => i.id === selectedIncidentId) && (
                <div className="bg-black/80 border border-accent-cyan/50 rounded p-3 text-xs space-y-1">
                  <div className="text-accent-cyan font-bold">
                    Incident #{selectedIncidentId}
                  </div>
                  <div className="text-text-secondary">
                    {incidents.find((i) => i.id === selectedIncidentId)?.type.replace(/_/g, " ")}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Right: AI Commander */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-96 border-l border-accent-cyan/20 bg-gradient-to-b from-void/80 to-void overflow-y-auto"
        >
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-xs font-bold text-accent-cyan uppercase tracking-wider mb-1">
                🤖 AI Commander
              </h3>
              {selectedIncidentId && (
                <p className="text-xs text-text-secondary">
                  Incident-specific recommendations
                </p>
              )}
            </div>

            <AnimatePresence>
              {(selectedIncidentId ? relevantCommands : aiCommands).map((cmd, idx) => (
                <motion.div
                  key={cmd.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 rounded-lg bg-gradient-to-r from-accent-cyan/10 to-accent-emerald/10 border border-accent-cyan/30 hover:border-accent-cyan/60 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-text-primary">{cmd.title}</p>
                      <p className="text-xs text-text-secondary mt-1">{cmd.rationale}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-xs font-mono text-accent-cyan">{cmd.confidence}%</p>
                      <p className="text-xs text-accent-emerald">{cmd.impact}</p>
                    </div>
                  </div>

                  {cmd.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => approveCommand(cmd.id)}
                        className="flex-1 px-2 py-1 rounded text-xs bg-state-success/20 text-state-success border border-state-success/50 hover:bg-state-success/30 transition font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectCommand(cmd.id)}
                        className="flex-1 px-2 py-1 rounded text-xs bg-state-critical/20 text-state-critical border border-state-critical/50 hover:bg-state-critical/30 transition font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {cmd.status === "approved" && (
                    <div className="mt-3 px-2 py-1 rounded text-xs bg-state-success/20 text-state-success border border-state-success/50 text-center font-semibold">
                      ✓ Approved
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {(selectedIncidentId ? relevantCommands : aiCommands).length === 0 && (
              <div className="p-4 rounded-lg border border-border-subtle text-center">
                <p className="text-xs text-text-secondary">
                  {selectedIncidentId ? "No recommendations for this incident" : "No commands pending"}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom: Operational Timeline */}
      <OperationalTimeline incidents={incidents} />
    </div>
  );
}
