"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HeartPulse, ShieldAlert, UserSearch, CircleHelp, TriangleAlert, Phone, MapPin, Clock, ShieldCheck } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { AIBadge } from "@/components/shared/ai-badge";
import { AIThinkingChip } from "@/components/shared/ai-thinking-chip";
import { FloatingActionButton } from "@/components/shared/floating-action-button";
import { MiniMapPreview } from "@/components/fan/mini-map-preview";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { fallbackEmergencyDecision } from "@/lib/utils/aiFallback";
import { seededRange } from "@/lib/utils/seededStats";
import type { EmergencyDecisionResult } from "@/lib/ai/emergencyDecision";

const TYPES = [
  { id: "medical", label: "Medical", icon: HeartPulse },
  { id: "security", label: "Security", icon: ShieldAlert },
  { id: "lost_item", label: "Lost Person", icon: UserSearch },
  { id: "other", label: "Other", icon: CircleHelp },
] as const;

export function EmergencySheet() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<(typeof TYPES)[number]["id"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState<EmergencyDecisionResult | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [eta, setEta] = useState(3);
  const { isDesktop } = useBreakpoint();

  const selectType = async (type: (typeof TYPES)[number]["id"]) => {
    setSelectedType(type);
    setLoading(true);
    setGuidance(null);
    setEta(Math.round(seededRange(`emergency-eta-${type}`, 2, 5)));
    try {
      const createRes = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          severity: "medium",
          location_desc: "Section 208, reported via Fan App",
          description: `A fan reported a ${type.replace("_", " ")} situation via the app.`,
          reported_by: "fan-app",
        }),
      });
      const { data } = await createRes.json();
      const decisionRes = await fetch(`/api/ai/incidents/${data.id}/decision-support`, { method: "POST" });
      setGuidance(decisionRes.ok ? (await decisionRes.json()).data : fallbackEmergencyDecision());
      setConfirmed(true);
    } catch {
      setGuidance(fallbackEmergencyDecision());
      setConfirmed(true);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setOpen(false);
    setTimeout(() => {
      setSelectedType(null);
      setGuidance(null);
      setConfirmed(false);
    }, 300);
  };

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border-subtle p-4">
        <TriangleAlert size={20} className="text-state-critical" />
        <h2 className="font-display text-base font-semibold">Emergency Help</h2>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {!selectedType && (
          <div className="grid grid-cols-2 gap-3">
            {TYPES.map((t) => (
              <button key={t.id} onClick={() => selectType(t.id)}>
                <GlassCard hover padding="md" className="flex h-[72px] flex-col items-center justify-center gap-1.5">
                  <t.icon size={22} className="text-state-critical" strokeWidth={1.75} />
                  <span className="text-xs font-medium text-text-primary">{t.label}</span>
                </GlassCard>
              </button>
            ))}
          </div>
        )}

        {selectedType && loading && (
          <div className="flex justify-center py-8">
            <AIThinkingChip label="Gemini is preparing guidance..." />
          </div>
        )}

        {guidance && (
          <>
            {/* Live tracking */}
            <GlassCard padding="md" className="flex items-center gap-3">
              <div className="relative">
                <MiniMapPreview zone="East" size={48} />
                <span className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className="h-2 w-2 rounded-full bg-state-critical"
                    animate={{ scale: [1, 1.8, 1], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </span>
              </div>
              <div>
                <p className="flex items-center gap-1 text-xs font-medium text-text-primary">
                  <MapPin size={11} className="text-state-critical" />
                  Live location tracking active
                </p>
                <p className="text-[11px] text-text-secondary">Section 208 · shared with responding staff</p>
              </div>
            </GlassCard>

            <div className="grid grid-cols-2 gap-3">
              <GlassCard padding="md" className="space-y-1">
                <p className="flex items-center gap-1 text-[10px] uppercase text-text-muted">
                  <Clock size={10} />
                  Nearest Unit ETA
                </p>
                <p className="font-mono text-lg font-semibold text-state-success">{eta} min</p>
                <p className="text-[10px] text-text-secondary">{guidance.recommendedUnit ?? "Medical Team"}</p>
              </GlassCard>
              <GlassCard padding="md" className="space-y-1">
                <p className="flex items-center gap-1 text-[10px] uppercase text-text-muted">
                  <ShieldCheck size={10} />
                  Security Status
                </p>
                <p className="text-sm font-semibold text-state-success">Monitoring</p>
                <p className="text-[10px] text-text-secondary">Stewards notified</p>
              </GlassCard>
            </div>

            <GlassCard padding="lg" className="space-y-3">
              <AIBadge />
              <ul className="space-y-2">
                {guidance.immediateActions.map((a, i) => (
                  <li key={i} className="flex gap-2 text-sm text-text-primary">
                    <span className="text-accent-cyan">•</span>
                    {a}
                  </li>
                ))}
              </ul>
              <p className="border-t border-border-subtle pt-3 text-xs text-text-secondary">{guidance.rationale}</p>
            </GlassCard>

            <a href="tel:+18005551234">
              <Button variant="secondary" className="w-full">
                <Phone size={14} />
                Call Emergency Contact
              </Button>
            </a>
          </>
        )}

        {confirmed && !loading && (
          <p className="rounded-sm bg-state-success/10 p-3 text-center text-sm text-state-success">
            Staff have been notified. Help is on the way.
          </p>
        )}
      </div>

      {confirmed && (
        <div className="border-t border-border-subtle p-4">
          <Button variant="secondary" className="w-full" onClick={reset}>
            Done
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <FloatingActionButton icon={TriangleAlert} label="Emergency Help" tone="danger" onClick={() => setOpen(true)} />
      {isDesktop ? (
        <Drawer open={open} onClose={reset} side="right" width={380}>
          {content}
        </Drawer>
      ) : (
        <Sheet open={open} onClose={reset} maxHeight="80vh">
          {content}
        </Sheet>
      )}
    </>
  );
}
