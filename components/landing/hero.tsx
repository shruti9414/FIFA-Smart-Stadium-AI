"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Users, Radio, Sparkles } from "lucide-react";
import { TiltCard } from "@/components/landing/tilt-card";
import { HeroAtmosphere } from "@/components/landing/hero-atmosphere";
import { Chip } from "@/components/ui/chip";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { fadeSlideUp, staggerChildren } from "@/lib/motion/variants";
import { ROUTES } from "@/lib/constants/routes";

export function Hero() {
  const reduced = useReducedMotion();
  const { ref, x, y, onMouseMove, onMouseLeave } = useMouseParallax();

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden pt-24 pb-16"
    >
      <HeroAtmosphere parallaxX={x} parallaxY={y} />

      <motion.div
        variants={staggerChildren(reduced, 90)}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-7 px-4 text-center"
      >
        <motion.div variants={fadeSlideUp(reduced)}>
          <Chip tappable={false} className="text-accent-cyan">
            <Radio size={12} className="animate-pulse-glow" />
            FIFA WORLD CUP 2026 · LIVE
          </Chip>
        </motion.div>

        <motion.h1
          variants={fadeSlideUp(reduced)}
          className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl md:text-8xl"
        >
          <span className="gradient-text-pan">The AI Operating System</span>
          <br />
          <span className="text-text-primary">for Smart Stadiums</span>
        </motion.h1>

        <motion.p variants={fadeSlideUp(reduced)} className="max-w-xl text-base text-text-secondary sm:text-lg">
          One live intelligence layer. Two experiences — fans finding their way, and operators running the show.
        </motion.p>

        <motion.div variants={fadeSlideUp(reduced)} className="flex items-center gap-2 font-mono text-[11px] text-text-muted">
          <Sparkles size={12} className="animate-pulse-glow text-accent-cyan" />
          AI reasoning engine online — watching 8 gates, 8 sections, 2 live incidents
        </motion.div>

        <motion.div variants={fadeSlideUp(reduced)} className="mt-3 grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
          <Link href={ROUTES.fan} className="group">
            <TiltCard className="glass rounded-lg border border-border-subtle p-6 text-left transition-[border-color,box-shadow] duration-300 hover:border-accent-cyan/40 hover:shadow-[var(--shadow-glow-cyan)] sm:h-[212px]">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <motion.div
                    className="flex h-11 w-11 items-center justify-center rounded-sm bg-accent-cyan/10"
                    whileHover={reduced ? undefined : { rotate: -8, scale: 1.08 }}
                  >
                    <Users size={22} className="text-accent-cyan" strokeWidth={1.75} />
                  </motion.div>
                  <ArrowRight size={18} className="text-text-muted transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-accent-cyan" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-text-primary sm:text-2xl">Enter as Fan</h2>
                  <p className="mt-1.5 text-sm text-text-secondary">
                    Find your seat, beat the queues, get instant help — in your language.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 border-t border-border-subtle pt-3 font-mono text-[10px] text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-state-success animate-pulse-glow" />
                  Navigation · Amenities · Match · Emergency
                </div>
              </div>
            </TiltCard>
          </Link>

          <Link href={ROUTES.ops} className="group">
            <TiltCard className="glass rounded-lg border border-border-subtle p-6 text-left transition-[border-color,box-shadow] duration-300 hover:border-accent-emerald/40 hover:shadow-[var(--shadow-glow-emerald)] sm:h-[212px]">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <motion.div
                    className="flex h-11 w-11 items-center justify-center rounded-sm bg-accent-emerald/10"
                    whileHover={reduced ? undefined : { rotate: 8, scale: 1.08 }}
                  >
                    <Radio size={22} className="text-accent-emerald" strokeWidth={1.75} />
                  </motion.div>
                  <ArrowRight size={18} className="text-text-muted transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-accent-cyan" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-text-primary sm:text-2xl">Enter Mission Control</h2>
                  <p className="mt-1.5 text-sm text-text-secondary">
                    Mission Control for crowd, safety, and logistics — powered by live AI recommendations.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 border-t border-border-subtle pt-3 font-mono text-[10px] text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse-glow" />
                  Digital Twin · AI Recommendations · Incident Center
                </div>
              </div>
            </TiltCard>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-text-muted"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-5 rounded-full border border-border-emphasis p-1"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
        </motion.div>
      </motion.div>
    </section>
  );
}
