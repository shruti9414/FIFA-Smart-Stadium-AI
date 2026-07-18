"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, AlertTriangle, CheckCircle2, Zap, MessageSquare, Users } from "lucide-react";
import { TopBar } from "@/components/shared/top-bar";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import { StatusChip } from "@/components/ui/status-chip";
import { AIReasoningCard } from "@/components/shared/ai-reasoning-card";
import { useSocket } from "@/hooks/useSocket";
import { fadeSlideUp, staggerChildren } from "@/lib/motion/variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatClock, formatDate } from "@/lib/utils/format";
import type { IncidentRow, IncidentAiNoteRow } from "@/lib/types/db";

interface IncidentDetail extends IncidentRow {
  aiNotes?: IncidentAiNoteRow[];
  relatedIncidents?: IncidentRow[];
  actionLog?: Array<{ timestamp: string; action: string; actor: string }>;
}

export default function IncidentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const incidentId = params.id as string;
  const reduced = useReducedMotion();

  const [incident, setIncident] = useState<IncidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusHistory, setStatusHistory] = useState<Array<{ status: string; timestamp: string }>>([]);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/incidents/${incidentId}`);
        if (!response.ok) throw new Error("Incident not found");
        const data = await response.json();
        setIncident(data);

        // Simulate status history
        setStatusHistory([
          { status: "reported", timestamp: new Date(data.created_at).toISOString() },
          { status: data.status, timestamp: new Date(data.updated_at).toISOString() },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load incident");
      } finally {
        setLoading(false);
      }
    };

    if (incidentId) fetchIncident();
  }, [incidentId]);

  useSocket("incident:updated", (payload) => {
    if (payload.incidentId === parseInt(incidentId)) {
      setIncident((prev) => prev ? { ...prev, status: payload.status } : null);
    }
  });

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: "bg-state-critical text-white",
      high: "bg-state-warning text-void",
      medium: "bg-accent-blue text-white",
      low: "bg-state-success text-white",
    };
    return colors[severity] || colors.medium;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopBar title="Incident Details" left={<Link href="/ops/incidents"><Button variant="ghost" size="sm"><ArrowLeft size={18} /> Back</Button></Link>} />
        <div className="flex flex-1 items-center justify-center p-4">
          <ErrorState title="Incident Not Found" message={error || "This incident no longer exists."} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-void">
      <TopBar
        title="Incident Details"
        left={<Link href="/ops/incidents"><Button variant="ghost" size="sm"><ArrowLeft size={18} /></Button></Link>}
      />

      <motion.div
        variants={staggerChildren(reduced, 60)}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto p-4 sm:p-6"
      >
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header Card */}
          <motion.div variants={fadeSlideUp(reduced)}>
            <GlassCard className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="font-display text-3xl font-bold text-text-primary">
                        {incident.type.replace("_", " ").toUpperCase()}
                      </h1>
                      <p className="mt-2 text-text-secondary">{incident.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                      <StatusChip status={incident.status} />
                    </div>
                  </div>

                  <Divider />

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs font-semibold uppercase text-text-muted">Location</p>
                      <p className="mt-1 font-mono text-sm text-text-primary">{incident.location_desc || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-text-muted">Reported By</p>
                      <p className="mt-1 font-mono text-sm text-text-primary">{incident.reported_by}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-text-muted">Reported At</p>
                      <p className="mt-1 font-mono text-sm text-text-primary">{formatClock(incident.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-text-muted">Duration</p>
                      <p className="mt-1 font-mono text-sm text-text-primary">
                        {Math.round((new Date(incident.updated_at).getTime() - new Date(incident.created_at).getTime()) / 60000)} min
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Timeline */}
          <motion.div variants={fadeSlideUp(reduced)}>
            <GlassCard className="p-6">
              <h2 className="font-display text-xl font-semibold text-text-primary mb-4">Status Timeline</h2>
              <div className="space-y-4">
                {statusHistory.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeSlideUp(reduced)}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full ${item.status === "resolved" ? "bg-state-success" : "bg-accent-cyan"}`} />
                      {idx < statusHistory.length - 1 && <div className="h-8 w-0.5 bg-border-subtle my-1" />}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-semibold text-text-primary capitalize">{item.status.replace("_", " ")}</p>
                      <p className="text-xs text-text-muted mt-1">{formatDate(item.timestamp)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Summary & Decision Support */}
          <motion.div variants={fadeSlideUp(reduced)}>
            <GlassCard className="p-6">
              <h2 className="font-display text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Zap size={20} className="text-accent-cyan" />
                AI Analysis & Recommendations
              </h2>
              <div className="space-y-4">
                <AIReasoningCard
                  title="Incident Summary"
                  icon={AlertTriangle}
                  facts={[
                    `Type: ${incident.type}`,
                    `Severity: ${incident.severity}`,
                    `Location: ${incident.location_desc}`,
                    `Duration: ${Math.round((new Date(incident.updated_at).getTime() - new Date(incident.created_at).getTime()) / 60000)} minutes`,
                  ]}
                  reasoning="Incident has been classified and tracked through resolution workflow."
                  confidence={0.95}
                />

                <Divider />

                <AIReasoningCard
                  title="Recommended Actions"
                  icon={CheckCircle2}
                  facts={[
                    incident.severity === "critical" ? "Deploy emergency response team immediately" : "Monitor situation closely",
                    "Notify relevant departments (medical/security/ops)",
                    "Establish incident perimeter if needed",
                    "Prepare public communication if necessary",
                  ]}
                  reasoning="Actions tailored to incident severity and type."
                  confidence={0.88}
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Action Log */}
          <motion.div variants={fadeSlideUp(reduced)}>
            <GlassCard className="p-6">
              <h2 className="font-display text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-accent-emerald" />
                Action Log
              </h2>
              <div className="space-y-2">
                {statusHistory.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded border border-border-subtle p-3">
                    <Clock size={16} className="mt-0.5 text-text-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-text-primary">{formatDate(item.timestamp)}</p>
                      <p className="text-sm text-text-secondary mt-1">Status changed to <span className="font-semibold capitalize">{item.status}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Commander Notes */}
          <motion.div variants={fadeSlideUp(reduced)}>
            <GlassCard className="p-6">
              <h2 className="font-display text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Users size={20} className="text-accent-cyan" />
                Commander Notes
              </h2>
              <div className="space-y-3">
                <div className="rounded bg-surface p-4 border border-border-subtle">
                  <p className="text-sm text-text-secondary">
                    No commander notes yet. Use the Incident Center to add notes and coordinate response.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Related Incidents */}
          {statusHistory.length > 1 && (
            <motion.div variants={fadeSlideUp(reduced)}>
              <GlassCard className="p-6">
                <h2 className="font-display text-xl font-semibold text-text-primary mb-4">Related Incidents</h2>
                <p className="text-sm text-text-secondary">No related incidents found.</p>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
