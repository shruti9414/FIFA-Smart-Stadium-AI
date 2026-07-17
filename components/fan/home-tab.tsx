"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navigation, UtensilsCrossed, Trophy, Sparkles, Radio } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AIBadge } from "@/components/shared/ai-badge";
import { ConfidenceGauge } from "@/components/shared/confidence-gauge";
import { StreamingText } from "@/components/shared/streaming-text";
import { StadiumHeroAtmosphere } from "@/components/fan/stadium-hero-atmosphere";
import { TicketCard } from "@/components/fan/ticket-card";
import { useMatch } from "@/hooks/useStadiumData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeSlideUp, staggerChildren } from "@/lib/motion/variants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { fallbackBriefing } from "@/lib/utils/aiFallback";

const QUICK_TILES = [
  { id: "navigate", label: "Navigate", icon: Navigation, tone: "text-accent-cyan", bg: "bg-accent-cyan/10" },
  { id: "amenities", label: "Amenities", icon: UtensilsCrossed, tone: "text-accent-emerald", bg: "bg-accent-emerald/10" },
  { id: "match", label: "Match", icon: Trophy, tone: "text-accent-blue", bg: "bg-accent-blue/10" },
] as const;

const TICKET = { section: "208", row: "C", seat: "14", gate: "Gate 4", holder: "M. Rodriguez" };
const FIRST_NAME = TICKET.holder.split(" ")[0] === "M." ? "Michael" : TICKET.holder.split(" ")[0];

function useCountdown(kickoffAt: string | undefined) {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    if (!kickoffAt) return;
    const tick = () => {
      const diff = new Date(kickoffAt).getTime() - Date.now();
      if (diff <= 0) return setLabel(null);
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      setLabel(`Kickoff in ${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [kickoffAt]);
  return label;
}

/** The cinematic hero — reused standalone in the desktop long-scroll and inside HomeTab for mobile. */
export function HeroSection() {
  const reduced = useReducedMotion();
  const { match } = useMatch();
  const [briefing, setBriefing] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(90);
  const [sessionToken] = useLocalStorage("assistant-session-fan", () => crypto.randomUUID());
  const countdown = useCountdown(match?.status === "scheduled" ? match.kickoff_at : undefined);

  useEffect(() => {
    if (!match) return;
    fetch("/api/ai/assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionToken,
        context: "fan",
        language: "en",
        message: `Write a short, personal welcome briefing for a fan named ${FIRST_NAME}. Start with "Welcome ${FIRST_NAME}." then one sentence on current gate/crowd conditions and a specific actionable tip (e.g. an alternate gate) if anything is congested, including an approximate time saved. Keep it to 2 short sentences total.`,
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => {
        setBriefing(json.data.reply);
        setConfidence(90);
      })
      .catch(() => {
        setBriefing(`Welcome ${FIRST_NAME}. ${fallbackBriefing()}`);
        setConfidence(70);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(match)]);

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 pt-6 pb-10">
      <StadiumHeroAtmosphere />

      <motion.div variants={staggerChildren(reduced, 100)} initial="hidden" animate="visible" className="relative z-10 flex w-full flex-col items-center gap-7 text-center">
        <motion.div variants={fadeSlideUp(reduced)} className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/25 bg-accent-cyan/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-accent-cyan">
          <Radio size={12} className="animate-pulse-glow" />
          {match?.venue ?? "MetLife Stadium"}
        </motion.div>

        <motion.div variants={fadeSlideUp(reduced)} className="flex items-center gap-6 sm:gap-12">
          <TeamBadge name={match?.home_team ?? "---"} />
          <div className="flex flex-col items-center">
            <span className="font-mono text-7xl font-bold tabular-nums text-text-primary sm:text-8xl">
              {match ? `${match.home_score}-${match.away_score}` : "–:–"}
            </span>
            <span className="mt-2 font-mono text-sm font-semibold uppercase tracking-widest text-accent-cyan">
              {countdown ?? (match?.status === "live" ? `● LIVE — ${match.minute}'` : match?.status ?? "Upcoming")}
            </span>
          </div>
          <TeamBadge name={match?.away_team ?? "---"} />
        </motion.div>

        <motion.div variants={fadeSlideUp(reduced)} className="w-full max-w-lg">
          <GlassCard elevation="L2" padding="lg" gradientBorder className="text-left shadow-[var(--shadow-glow-cyan)]">
            <div className="mb-2 flex items-center justify-between">
              <AIBadge />
              {briefing && <ConfidenceGauge confidence={confidence} size={36} />}
            </div>
            {briefing ? (
              <p className="text-base text-text-primary">
                <StreamingText text={briefing} />
              </p>
            ) : (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Sparkles size={14} className="animate-pulse-glow text-accent-cyan" />
                Gemini is analyzing today&apos;s conditions...
              </div>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function HomeTab({ onNavigateTab }: { onNavigateTab: (tab: string) => void }) {
  const reduced = useReducedMotion();

  return (
    <div>
      <HeroSection />

      <motion.div variants={staggerChildren(reduced)} initial="hidden" animate="visible" className="mx-auto max-w-2xl space-y-4 px-4 pb-4">
        <motion.div variants={fadeSlideUp(reduced)}>
          <TicketCard ticket={TICKET} />
        </motion.div>

        <motion.div variants={fadeSlideUp(reduced)} className="grid grid-cols-3 gap-3">
          {QUICK_TILES.map((tile) => (
            <button key={tile.id} onClick={() => onNavigateTab(tile.id)} className="group">
              <GlassCard hover padding="md" className="flex flex-col items-center gap-2 text-center transition-transform duration-200 group-hover:-translate-y-1">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tile.bg}`}>
                  <tile.icon size={20} className={tile.tone} strokeWidth={1.75} />
                </div>
                <span className="text-xs font-medium text-text-secondary">{tile.label}</span>
              </GlassCard>
            </button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function TeamBadge({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border-emphasis bg-glass-elevated font-display text-lg font-bold shadow-lg sm:h-24 sm:w-24 sm:text-xl">
        {name.slice(0, 3).toUpperCase()}
      </div>
      <span className="max-w-[110px] truncate text-sm text-text-secondary">{name}</span>
    </div>
  );
}
