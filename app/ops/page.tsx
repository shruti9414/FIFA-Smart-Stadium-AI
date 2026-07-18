"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Siren, Zap, FileWarning, AlertCircle } from "lucide-react";
import { TopBar } from "@/components/shared/top-bar";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import { Stadium3DProduction } from "@/components/mission-control/stadium-3d-production";
import { OperationalTimeline } from "@/components/mission-control/operational-timeline";
import { useGates, useCrowd, useIncidents, useMatch } from "@/hooks/useStadiumData";
import type { StadiumSection } from "@/lib/types/db";

export default function MissionControlPage() {
  const { gates } = useGates();
  const { crowd } = useCrowd();
  const { incidents } = useIncidents();
  const { match } = useMatch();

  const [sections, setSections] = useState<StadiumSection[]>([]);
  const [triggering, setTriggering] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sections")
      .then((r) => r.json())
      .then((json) => setSections(json.data ?? []))
      .catch((err) => console.error("Failed to fetch sections:", err));
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

  // Get latest 5-8 incidents
  const recentIncidents = incidents
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-state-critical/20 border-state-critical/50";
      case "high":
        return "bg-orange-500/20 border-orange-500/50";
      case "medium":
        return "bg-yellow-500/20 border-yellow-500/50";
      case "low":
        return "bg-blue-500/20 border-blue-500/50";
      default:
        return "bg-surface/50 border-border-subtle";
    }
  };

  const getSeverityBadge = (severity: string) => {
    const icons: Record<string, string> = {
      critical: "🔴",
      high: "🟠",
      medium: "🟡",
      low: "🔵",
      resolved: "✅",
    };
    return icons[severity] || "•";
  };

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

      {/* Main Layout: Left Panel | Center 3D | Right Panel */}
      <div className="flex flex-1 overflow-hidden gap-0">
        {/* LEFT: Emergency Teams + System Health */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-72 border-r border-accent-cyan/20 bg-gradient-to-b from-void/80 to-void overflow-y-auto p-4 space-y-4"
        >
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
        </motion.div>

        {/* CENTER: 3D Stadium (Primary) */}
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
            incidents={incidents.map(i => ({ location_id: i.gate_id ?? undefined }))}
          />

          {/* Live KPIs Overlay */}
          <div className="absolute top-4 left-4 pointer-events-none space-y-1 z-50">
            <div className="text-xs text-accent-cyan font-mono bg-black/60 p-3 rounded border border-accent-cyan/30 space-y-1">
              <div className="font-bold text-sm">📊 Live KPIs</div>
              <div>🏟️ Capacity: {sections.length} zones</div>
              <div>🚪 Gates: {gates.filter(g => g.status === "open").length}/{gates.length} open</div>
              <div>👥 Crowd: {Math.round(crowd.reduce((sum, c) => sum + c.density_pct, 0) / Math.max(1, crowd.length))}% avg density</div>
              <div>🚨 Incidents: {incidents.filter(i => i.status !== "resolved").length} active</div>
            </div>
          </div>

          {/* Match Status Overlay */}
          {match && (
            <div className="absolute top-4 right-4 pointer-events-none">
              <div className="text-xs text-accent-emerald font-mono bg-black/60 p-3 rounded border border-accent-emerald/30 space-y-1">
                <div className="font-bold">⚽ Match Status</div>
                <div>{match.home_team} {match.home_score}-{match.away_score} {match.away_team}</div>
                <div>{match.status} · {match.minute}&apos;</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* RIGHT: Recent Incidents + AI Commander */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 border-l border-accent-cyan/20 bg-gradient-to-b from-void/80 to-void overflow-y-auto"
        >
          <div className="p-4 space-y-4">
            {/* Recent Incidents Mini Queue */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-accent-cyan uppercase tracking-wider">
                  <AlertCircle size={14} className="inline mr-1" />
                  Recent Incidents
                </h3>
                <Link href="/ops/incidents" className="text-xs text-accent-cyan hover:text-accent-emerald">
                  View All →
                </Link>
              </div>

              <div className="space-y-2">
                {recentIncidents.length > 0 ? (
                  recentIncidents.map((incident) => (
                    <Link
                      key={incident.id}
                      href={`/ops/incidents?id=${incident.id}`}
                      className={`block p-2.5 rounded border cursor-pointer transition hover:shadow-md ${getSeverityColor(
                        incident.severity
                      )}`}
                    >
                      <div className="flex items-start gap-2 mb-1">
                        <span>{getSeverityBadge(incident.severity)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">#{incident.id} {incident.type.replace(/_/g, " ")}</p>
                          <p className="text-xs text-text-secondary truncate">{incident.location_desc}</p>
                        </div>
                      </div>
                      <p className="text-xs text-text-muted">
                        {new Date(incident.created_at).toLocaleTimeString()}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="text-xs text-text-secondary p-2">No recent incidents</div>
                )}
              </div>
            </div>

            {/* AI Commander Quick Actions */}
            <div>
              <h3 className="text-xs font-bold text-accent-cyan uppercase tracking-wider mb-3">
                🤖 AI Commander
              </h3>
              <div className="text-xs text-text-secondary p-3 rounded border border-border-subtle bg-surface/20">
                <p>Select an incident to see AI-generated recommendations</p>
                <p className="mt-2">
                  <Link href="/ops/incidents" className="text-accent-cyan hover:text-accent-emerald">
                    Go to Incident Center →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM: Operational Timeline */}
      <OperationalTimeline incidents={incidents} />
    </div>
  );
}
