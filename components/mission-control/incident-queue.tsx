"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Search, Filter, Clock, MapPin } from "lucide-react";
import type { IncidentRow } from "@/lib/types/db";

interface IncidentQueueProps {
  incidents: IncidentRow[];
  selectedIncidentId: number | null;
  onSelectIncident: (id: number) => void;
}

type SeverityFilter = "all" | "critical" | "high" | "medium" | "low" | "resolved";

export function IncidentQueue({
  incidents,
  selectedIncidentId,
  onSelectIncident,
}: IncidentQueueProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");

  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((inc) => {
        if (severityFilter !== "all" && inc.severity !== severityFilter) return false;
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            inc.type.toLowerCase().includes(searchLower) ||
            inc.location_desc?.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const severityOrder: Record<string, number> = {
          critical: 0,
          high: 1,
          medium: 2,
          low: 3,
          resolved: 4,
        };
        return (
          severityOrder[a.severity] - severityOrder[b.severity] ||
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
  }, [incidents, searchTerm, severityFilter]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-state-critical/20 border-state-critical/50 text-state-critical";
      case "high":
        return "bg-orange-500/20 border-orange-500/50 text-orange-300";
      case "medium":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-300";
      case "low":
        return "bg-blue-500/20 border-blue-500/50 text-blue-300";
      case "resolved":
        return "bg-state-success/20 border-state-success/50 text-state-success";
      default:
        return "bg-surface/50 border-border-subtle text-text-secondary";
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
    <div className="flex flex-col h-full bg-gradient-to-b from-void/80 to-void border-r border-accent-cyan/20">
      {/* Header */}
      <div className="p-4 space-y-3 border-b border-accent-cyan/10">
        <h3 className="text-xs font-bold text-accent-cyan uppercase tracking-wider flex items-center gap-2">
          <AlertCircle size={14} />
          Incident Queue
        </h3>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-surface/50 border border-border-subtle rounded text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-cyan/50 focus:bg-surface"
          />
        </div>

        {/* Severity Filters */}
        <div className="flex gap-1 flex-wrap">
          {(["all", "critical", "high", "medium", "low", "resolved"] as const).map(
            (severity) => (
              <button
                key={severity}
                onClick={() => setSeverityFilter(severity)}
                className={`px-2 py-1 rounded text-xs font-semibold uppercase transition ${
                  severityFilter === severity
                    ? "bg-accent-cyan text-black"
                    : "bg-surface/50 text-text-secondary hover:bg-surface hover:text-accent-cyan/70 border border-border-subtle"
                }`}
              >
                {severity === "all" ? "All" : severity}
              </button>
            )
          )}
        </div>

        {/* Stats */}
        <div className="text-xs text-text-secondary">
          {filteredIncidents.length} incident{filteredIncidents.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Incident List */}
      <div className="flex-1 overflow-y-auto pr-1">
        <AnimatePresence>
          {filteredIncidents.length > 0 ? (
            <div className="space-y-2 p-4">
              {filteredIncidents.map((incident, idx) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onSelectIncident(incident.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedIncidentId === incident.id
                      ? "bg-accent-cyan/20 border-accent-cyan/60 shadow-lg shadow-accent-cyan/20"
                      : `${getSeverityColor(incident.severity)} hover:border-opacity-100 hover:shadow-md`
                  }`}
                >
                  {/* Severity Badge & Type */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getSeverityBadge(incident.severity)}</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide">
                          #{incident.id} {incident.type.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono opacity-75">
                      {incident.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={12} className="opacity-60" />
                    <span className="text-xs text-text-secondary">{incident.location_desc}</span>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Clock size={12} className="opacity-60" />
                    <span>{new Date(incident.created_at).toLocaleTimeString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-text-secondary text-xs">
              {searchTerm || severityFilter !== "all"
                ? "No incidents match filters"
                : "No active incidents"}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
