"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Siren, Zap, FileWarning, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { TopBar } from "@/components/shared/top-bar";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import { Stadium3DProduction } from "@/components/mission-control/stadium-3d-production";
import { useGates, useCrowd, useIncidents, useMatch } from "@/hooks/useStadiumData";
import { useSocket } from "@/hooks/useSocket";
import { formatClock } from "@/lib/utils/format";
import type { StadiumSection } from "@/lib/types/db";

export default function MissionControlPage() {
  const { gates } = useGates();
  const { crowd } = useCrowd();
  const { incidents } = useIncidents();
  const { match } = useMatch();

  const [sections, setSections] = useState<StadiumSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
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
      .then((json) => setSections(json.data ?? []));
  }, []);

  // Fetch AI recommendations as commands
  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const res = await fetch("/api/ai/ops-recommendations", {
          signal: AbortSignal.timeout(8000)
        });

        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }

        const text = await res.text();
        if (!text) {
          console.warn("Empty response from AI endpoint");
          return;
        }

        const data = JSON.parse(text);
        if (data.data?.recommendations && Array.isArray(data.data.recommendations)) {
          setAiCommands(
            data.data.recommendations.slice(0, 5).map((r: any) => ({
              id: `${r.title}-${Math.random()}`,
              title: r.title || "Command",
              rationale: r.rationale || "AI Generated",
              confidence: r.confidence || 85,
              impact: r.affectedFacts?.[0] || "Strategic",
              status: "pending",
            }))
          );
        }
      } catch (error) {
        // Silently fail - page still works without commands
        console.debug("AI commands unavailable:", error instanceof Error ? error.message : String(error));
      }
    };

    fetchCommands();
    const interval = setInterval(fetchCommands, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

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

  const tickerItems = useMemo(() => {
    return incidents.length > 0
      ? incidents.map((i) => ({
          id: i.id,
          text: `${formatClock(i.created_at)} · ${i.severity.toUpperCase()} · ${i.type.replace("_", " ")} — ${i.location_desc}`,
        }))
      : [{ id: "clear", text: "All systems operational" }];
  }, [incidents]);

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

      {/* Main Grid Layout */}
      <div className="flex flex-1 overflow-hidden gap-0">
        {/* Left Sidebar - Operations Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 border-r border-accent-cyan/20 bg-gradient-to-b from-void/80 to-void overflow-y-auto"
        >
          <div className="p-4 space-y-4">
            {/* Emergency Teams */}
            <div>
              <h3 className="text-xs font-bold text-accent-cyan uppercase tracking-wider mb-3">🚨 Emergency Teams</h3>
              <div className="space-y-2">
                {[
                  { name: "Police", units: 12, status: "active", color: "text-blue-400" },
                  { name: "Medical", units: 8, status: "active", color: "text-red-400" },
                  { name: "Fire", units: 5, status: "active", color: "text-orange-400" },
                  { name: "Volunteers", units: 24, status: "active", color: "text-green-400" },
                ].map((team) => (
                  <div key={team.name} className="flex items-center justify-between p-2 rounded bg-surface/50 border border-border-subtle hover:border-accent-cyan/50 transition">
                    <div>
                      <p className="text-xs font-semibold text-text-primary">{team.name}</p>
                      <p className={`text-xs ${team.color}`}>{team.units} units</p>
                    </div>
                    <span className="text-xs text-state-success">● {team.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div>
              <h3 className="text-xs font-bold text-accent-cyan uppercase tracking-wider mb-3">💊 System Health</h3>
              <div className="space-y-2">
                {[
                  { metric: "Gates", value: "98%", status: "ok" },
                  { metric: "Network", value: "100%", status: "ok" },
                  { metric: "Cameras", value: "95%", status: "ok" },
                  { metric: "Sensors", value: "97%", status: "ok" },
                ].map((item) => (
                  <div key={item.metric} className="flex items-center justify-between p-2 rounded bg-surface/50 border border-border-subtle">
                    <p className="text-xs text-text-secondary">{item.metric}</p>
                    <p className="text-xs font-semibold text-state-success">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center - 3D Stadium */}
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

          {/* Overlay Stats */}
          <div className="absolute top-4 left-4 pointer-events-none space-y-2 z-50">
            <div className="text-xs text-accent-cyan font-mono">
              <div>CAPACITY: {crowd.reduce((sum, c) => sum + (c.density_pct * 100), 0) | 0} / 100K</div>
              <div>INCIDENTS: {incidents.length}</div>
              <div>GATES: {gates.filter(g => g.status === "open").length}/{gates.length}</div>
            </div>
          </div>
        </motion.div>

        {/* Right Sidebar - AI Commander */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-96 border-l border-accent-cyan/20 bg-gradient-to-b from-void/80 to-void overflow-y-auto"
        >
          <div className="p-4 space-y-3">
            <h3 className="text-xs font-bold text-accent-cyan uppercase tracking-wider">🤖 AI Commander</h3>

            <AnimatePresence>
              {aiCommands.map((cmd, idx) => (
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

            {aiCommands.length === 0 && (
              <div className="p-4 rounded-lg border border-border-subtle text-center">
                <p className="text-xs text-text-secondary">No commands pending</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Ticker */}
      <div className="border-t border-accent-cyan/20 bg-gradient-to-r from-void via-void to-void px-4 py-2">
        <div className="text-xs text-text-secondary font-mono overflow-hidden">
          <div className="whitespace-nowrap animate-scroll">
            {tickerItems.length > 0 && tickerItems[0] && (
              <>
                {tickerItems.map((item) => (
                  <span key={item.id} className="inline-block mr-12">
                    {item.text}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
