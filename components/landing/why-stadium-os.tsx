"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeSlideUp } from "@/lib/motion/variants";

const COMPARISON = [
  { old: "Dashboards show raw numbers", new: "AI explains what the numbers mean and what to do about them" },
  { old: "Staff react after congestion peaks", new: "Trend-based analysis flags risk 10-15 minutes ahead" },
  { old: "One-size-fits-all announcements", new: "Grounded, personalized guidance per fan, per language" },
  { old: "Incidents handled in isolation", new: "AI Incident Commander synthesizes multiple incidents at once" },
  { old: "\"AI\" that's really just a chatbot", new: "Every recommendation shows its confidence and its source facts" },
];

export function WhyStadiumOS() {
  const reduced = useReducedMotion();

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-20 sm:py-28">
      <motion.div
        variants={fadeSlideUp(reduced)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mb-16 text-center"
      >
        <h2 className="font-display text-4xl font-bold sm:text-5xl">Why StadiumOS</h2>
        <p className="mx-auto mt-3 max-w-xl text-text-secondary">
          Existing systems hand operators raw data. This platform hands them a decision — with the reasoning attached.
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-accent-cyan/30 to-transparent sm:block" />

        <div className="space-y-6">
          {COMPARISON.map((row, i) => (
            <motion.div
              key={row.old}
              variants={fadeSlideUp(reduced)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: reduced ? 0 : (i % 3) * 0.06 }}
              className="relative grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-6"
            >
              <div className="rounded-md border border-border-subtle bg-glass/40 px-4 py-3 text-right">
                <span className="text-sm text-text-muted line-through decoration-text-muted/40">{row.old}</span>
              </div>

              <div className="relative z-10 mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-accent-cyan/40 bg-void">
                <span className="absolute h-9 w-9 animate-pulse-glow rounded-full bg-accent-cyan/10" />
                <ArrowRight size={14} className="rotate-90 text-accent-cyan sm:rotate-0" />
              </div>

              <div className="gradient-border rounded-md bg-surface px-4 py-3">
                <span className="text-sm font-medium text-text-primary">{row.new}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
