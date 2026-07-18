"use client";

import { motion } from "framer-motion";
import { AlertCircle, Zap, Users, CheckCircle2, Clock } from "lucide-react";
import type { IncidentRow } from "@/lib/types/db";

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: "incident" | "deployment" | "gate" | "resolution";
  title: string;
  detail: string;
  severity?: string;
}

interface OperationalTimelineProps {
  incidents: IncidentRow[];
}

export function OperationalTimeline({ incidents }: OperationalTimelineProps) {
  // Build timeline events from incidents
  const events: TimelineEvent[] = incidents
    .slice(0, 10)
    .flatMap((incident) => {
      const events: TimelineEvent[] = [
        {
          id: `incident-${incident.id}`,
          timestamp: incident.created_at,
          type: "incident",
          title: `Incident #${incident.id}`,
          detail: `${incident.type.replace(/_/g, " ")} at ${incident.location_desc}`,
          severity: incident.severity,
        },
      ];

      if (incident.status === "resolved") {
        events.push({
          id: `resolution-${incident.id}`,
          timestamp: incident.updated_at,
          type: "resolution",
          title: `Resolved #${incident.id}`,
          detail: `Issue cleared`,
        });
      }

      return events;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getIcon = (type: string) => {
    switch (type) {
      case "incident":
        return <AlertCircle size={14} />;
      case "deployment":
        return <Users size={14} />;
      case "gate":
        return <Zap size={14} />;
      case "resolution":
        return <CheckCircle2 size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "incident":
        return "text-state-critical";
      case "deployment":
        return "text-accent-blue";
      case "gate":
        return "text-accent-emerald";
      case "resolution":
        return "text-state-success";
      default:
        return "text-text-secondary";
    }
  };

  return (
    <div className="border-t border-accent-cyan/20 bg-gradient-to-r from-void via-void to-void px-4 py-3">
      <div className="text-xs font-bold text-accent-cyan uppercase tracking-wider mb-2">
        ⏱️ Operational Timeline
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-accent-cyan/30 scrollbar-track-void">
        {events.length > 0 ? (
          events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded border border-border-subtle bg-surface/30 hover:bg-surface/50 transition"
            >
              <div className={`flex-shrink-0 ${getTypeColor(event.type)}`}>
                {getIcon(event.type)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">
                  {event.title}
                </p>
                <p className="text-xs text-text-secondary truncate">{event.detail}</p>
                <p className="text-xs text-text-muted">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </p>
              </div>
              {event.severity && (
                <div className="text-xs font-mono text-orange-300 flex-shrink-0">
                  {event.severity.toUpperCase()}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-xs text-text-muted">No events yet</div>
        )}
      </div>
    </div>
  );
}
