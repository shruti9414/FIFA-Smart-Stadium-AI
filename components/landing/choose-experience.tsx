"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Users, Radio, Smartphone, Sparkles, Gauge, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { TiltCard } from "@/components/landing/tilt-card";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeSlideUp, staggerChildren } from "@/lib/motion/variants";
import { ROUTES } from "@/lib/constants/routes";

const BADGES = [
  { icon: Smartphone, label: "Installable App" },
  { icon: Sparkles, label: "Live AI Reasoning" },
  { icon: Gauge, label: "Gemini-Powered" },
  { icon: Trophy, label: "World Cup 2026 Ready" },
];

function CornerBrackets() {
  return (
    <>
      <span className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-accent-cyan/50" />
      <span className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-accent-cyan/50" />
      <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-accent-cyan/50" />
      <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-accent-cyan/50" />
    </>
  );
}

export function ChooseExperience() {
  const reduced = useReducedMotion();

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-32 sm:py-44">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(34,211,238,0.08),transparent_65%)]" />

      <motion.div
        variants={fadeSlideUp(reduced)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="relative mb-14 text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-cyan/25 bg-accent-cyan/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse-glow" />
          System Access
        </div>
        <h2 className="font-display text-4xl font-bold sm:text-6xl">Choose Your Experience</h2>
        <p className="mt-3 text-text-secondary">No login. No setup. Select an entry point — it&apos;s already live.</p>
      </motion.div>

      <motion.div
        variants={staggerChildren(reduced, 120)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        <motion.div variants={fadeSlideUp(reduced)} whileTap={reduced ? undefined : { scale: 0.98 }}>
          <Link href={ROUTES.fan} className="group block">
            <TiltCard className="relative">
              <GlassCard
                elevation="L2"
                padding="lg"
                className="relative h-full min-h-[260px] overflow-hidden transition-[border-color,box-shadow] duration-300 group-hover:border-accent-cyan/40 group-hover:shadow-[var(--shadow-glow-cyan)] cursor-pointer"
              >
                <CornerBrackets />
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-accent-cyan/10">
                      <Users size={28} className="text-accent-cyan" strokeWidth={1.75} />
                    </div>
                    <ArrowRight size={20} className="text-text-muted transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-accent-cyan" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-accent-cyan">Clearance: Fan</div>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-text-primary">Fan Experience</h3>
                    <p className="mt-2 text-sm text-text-secondary">
                      Seat navigation, food finder, live match companion, multilingual AI assistant, and one-tap emergency help.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </TiltCard>
          </Link>
        </motion.div>

        <motion.div variants={fadeSlideUp(reduced)} whileTap={reduced ? undefined : { scale: 0.98 }}>
          <Link href={ROUTES.ops} className="group block">
            <TiltCard className="relative">
              <GlassCard
                elevation="L2"
                padding="lg"
                className="relative h-full min-h-[260px] overflow-hidden transition-[border-color,box-shadow] duration-300 group-hover:border-accent-emerald/40 group-hover:shadow-[var(--shadow-glow-emerald)] cursor-pointer"
              >
                <CornerBrackets />
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-accent-emerald/10">
                      <Radio size={28} className="text-accent-emerald" strokeWidth={1.75} />
                    </div>
                    <ArrowRight size={20} className="text-text-muted transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-accent-cyan" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-accent-emerald">Clearance: Operations</div>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-text-primary">Mission Control</h3>
                    <p className="mt-2 text-sm text-text-secondary">
                      Interactive digital twin, live crowd analysis, AI recommendations with confidence scores, and Incident Center.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </TiltCard>
          </Link>
        </motion.div>

        <motion.div variants={fadeSlideUp(reduced)} whileTap={reduced ? undefined : { scale: 0.98 }}>
          <Link href="/demo" className="group block">
            <TiltCard className="relative">
              <GlassCard
                elevation="L2"
                padding="lg"
                className="relative h-full min-h-[260px] overflow-hidden transition-[border-color,box-shadow] duration-300 group-hover:border-accent-cyan/40 group-hover:shadow-[var(--shadow-glow-cyan)] cursor-pointer"
              >
                <CornerBrackets />
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-accent-cyan/10">
                      <Sparkles size={28} className="text-accent-cyan" strokeWidth={1.75} />
                    </div>
                    <ArrowRight size={20} className="text-text-muted transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-accent-cyan" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-accent-cyan">Mode: Demo</div>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-text-primary">Automated Demo</h3>
                    <p className="mt-2 text-sm text-text-secondary">
                      One-click scenario simulation showing crowd surge, medical emergency, incident response, and AI decision making in real-time.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </TiltCard>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggerChildren(reduced)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
      >
        {BADGES.map((b) => (
          <motion.div key={b.label} variants={fadeSlideUp(reduced)} className="flex items-center gap-2 text-text-secondary">
            <b.icon size={16} strokeWidth={1.75} className="text-accent-cyan" />
            <span className="text-xs font-medium uppercase tracking-wide">{b.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
