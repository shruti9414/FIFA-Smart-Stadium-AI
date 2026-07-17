"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Mic, X } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { IconButton } from "@/components/ui/icon-button";
import { AIBadge } from "@/components/shared/ai-badge";
import { ConfidenceGauge } from "@/components/shared/confidence-gauge";
import { AIThinkingChip } from "@/components/shared/ai-thinking-chip";
import { StadiumNavigator } from "@/components/fan/stadium-navigator";
import { useGates, useCrowd } from "@/hooks/useStadiumData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { slideInPanel } from "@/lib/motion/variants";
import { fallbackNavigation } from "@/lib/utils/aiFallback";
import { cn } from "@/lib/utils/cn";
import type { NavigationResult } from "@/lib/ai/navigation";
import type { StadiumGate, StadiumSection } from "@/lib/types/db";

const USER_SECTION = "208";

export function NavigateTab({ showHeader = true }: { showHeader?: boolean }) {
  const reduced = useReducedMotion();
  const { gates } = useGates();
  const { crowd } = useCrowd();
  const [sections, setSections] = useState<StadiumSection[]>([]);
  const [selected, setSelected] = useState<{ gate: StadiumGate; section: StadiumSection } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NavigationResult | null>(null);

  useEffect(() => {
    fetch("/api/sections")
      .then((r) => r.json())
      .then((json) => setSections(json.data ?? []));
  }, []);

  const selectDestination = useCallback(
    async (gate: StadiumGate, section: StadiumSection) => {
      setSelected({ gate, section });
      setLoading(true);
      setResult(null);
      try {
        const res = await fetch("/api/ai/navigation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destinationType: "seat", destinationLabel: section.name, seatSection: section.name }),
        });
        if (!res.ok) {
          setResult(fallbackNavigation(section.name, gate.name));
          return;
        }
        setResult((await res.json()).data);
      } catch {
        setResult(fallbackNavigation(section.name, gate.name));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const onVoiceResult = useCallback(
    (transcript: string) => {
      const lower = transcript.toLowerCase();
      const match = sections.find((s) => lower.includes(s.name.toLowerCase()) || lower.includes(s.zone.toLowerCase()));
      if (match) {
        const gate = gates.find((g) => g.section_id === match.id);
        if (gate) selectDestination(gate, match);
      }
    },
    [sections, gates, selectDestination]
  );
  const { listening, toggle: toggleVoice, supported: voiceSupported } = useVoiceInput(onVoiceResult);

  return (
    <div className="relative">
      {showHeader && (
        <div className="mb-4 text-center">
          <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">Interactive Stadium Navigator</h2>
          <p className="mt-1 text-sm text-text-secondary">Tap a zone, or say your destination. Drag to rotate, scroll to zoom.</p>
        </div>
      )}

      {/* Full-width stadium — no reserved empty column. Route info renders as a floating overlay, not a permanent side panel. */}
      <div className="relative">
        <StadiumNavigator
          gates={gates}
          sections={sections}
          crowd={crowd}
          userSectionName={USER_SECTION}
          selectedGateId={selected?.gate.id ?? null}
          onSelectGate={selectDestination}
          routeActive={Boolean(result)}
        />

        {voiceSupported && (
          <motion.button
            onClick={toggleVoice}
            whileTap={{ scale: 0.92 }}
            className={cn(
              "absolute left-1/2 top-2 z-20 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full shadow-lg",
              listening ? "gradient-ai-core animate-pulse-glow" : "glass"
            )}
            aria-label={listening ? "Stop listening" : "Voice navigation"}
          >
            <Mic size={20} className={listening ? "text-void" : "text-accent-cyan"} />
          </motion.button>
        )}

        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.gate.id}
              variants={slideInPanel("right", reduced)}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-2 top-2 z-20 w-[calc(100%-1rem)] sm:right-4 sm:top-4 sm:w-80"
            >
              <GlassCard elevation="L2" padding="lg" className="relative space-y-3">
                <IconButton
                  icon={X}
                  label="Close"
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-2"
                  onClick={() => {
                    setSelected(null);
                    setResult(null);
                  }}
                />

                {loading && (
                  <div className="flex justify-center py-4">
                    <AIThinkingChip label="Gemini is finding your best route..." />
                  </div>
                )}

                {result && (
                  <>
                    <div className="flex items-center justify-between pr-6">
                      <AIBadge />
                      <ConfidenceGauge confidence={result.confidence} size={40} />
                    </div>
                    <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                      <MapPin size={16} className="text-accent-cyan" />
                      Route to {selected.section.name}
                    </h3>
                    {result.warning && <p className="text-sm text-accent-cyan">{result.warning}</p>}
                    <ol className="space-y-2">
                      {result.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm text-text-primary">
                          <span className="font-mono text-accent-cyan">{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    <div className="flex items-center justify-between border-t border-border-subtle pt-3 font-mono text-xs text-text-secondary">
                      <span>Via {result.recommendedGate}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        ~{result.etaMin} min
                      </span>
                    </div>
                  </>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
