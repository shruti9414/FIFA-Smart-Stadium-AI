"use client";

import { motion } from "framer-motion";
import { Navigation, Users2, Siren, Languages, MessageCircle, FileText, Radar, Sparkle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AIBadge } from "@/components/shared/ai-badge";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeSlideUp, staggerChildren } from "@/lib/motion/variants";

const FEATURES = [
  { icon: Navigation, title: "AI Navigation Guidance", description: "Routes fans around live congestion in real time — not just a static gate lookup." },
  { icon: Radar, title: "Crowd Analysis", description: "Reads density trends over time to project risk before it becomes a bottleneck." },
  { icon: Sparkle, title: "Operational Recommendations", description: "Correlates gates, parking, and incidents into ranked, explainable actions." },
  { icon: Siren, title: "Emergency Decision Support", description: "Proposes a response plan grounded in live facts — humans always approve." },
  { icon: FileText, title: "Match & Incident Summaries", description: "Turns raw event logs into clean, readable narratives on demand." },
  { icon: Languages, title: "Multilingual Assistance", description: "Fluent, grounded answers in a fan's own language — not word-for-word translation." },
  { icon: MessageCircle, title: "Smart Stadium Assistant", description: "One assistant, context-aware, available everywhere in the app." },
  { icon: Users2, title: "AI Incident Commander", description: "Synthesizes multiple simultaneous incidents into one ranked action plan." },
];

export function CoreFeatures() {
  const reduced = useReducedMotion();

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-32 sm:py-40">
      <motion.div
        variants={fadeSlideUp(reduced)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mb-16 text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-cyan/25 bg-accent-cyan/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent-cyan">
          AI Modules
        </div>
        <h2 className="font-display text-5xl font-bold sm:text-6xl">Where the AI Actually Reasons</h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-text-secondary">
          Every module below fuses multiple live facts into a judgment call — never a single-value lookup dressed up as intelligence.
        </p>
      </motion.div>

      <motion.div
        variants={staggerChildren(reduced)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {FEATURES.map((f, i) => (
          <motion.div key={f.title} variants={fadeSlideUp(reduced)} whileHover={reduced ? undefined : { y: -4 }} className="group">
            <GlassCard padding="lg" className="relative h-full overflow-hidden transition-[border-color,box-shadow] duration-300 group-hover:border-accent-cyan/40 group-hover:shadow-[var(--shadow-glow-cyan)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="mb-5 flex items-center justify-between">
                <motion.div
                  className="flex h-14 w-14 items-center justify-center rounded-sm bg-accent-cyan/10"
                  whileHover={reduced ? undefined : { rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <f.icon size={28} className="text-accent-cyan" strokeWidth={1.75} />
                </motion.div>
                <AIBadge />
              </div>
              <div className="mb-2 font-mono text-xs text-text-muted uppercase tracking-wide">MODULE {String(i + 1).padStart(2, "0")}</div>
              <h3 className="font-display text-lg font-semibold text-text-primary">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{f.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
