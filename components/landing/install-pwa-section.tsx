"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, Globe } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { fadeSlideUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPWASection() {
  const reduced = useReducedMotion();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setCanInstall(false);
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-32 sm:py-40">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/[0.08] blur-[140px]" />

      <motion.div
        variants={fadeSlideUp(reduced)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mb-16 text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-cyan/25 bg-accent-cyan/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse-glow" />
          Installation
        </div>
        <h2 className="font-display text-5xl font-bold sm:text-6xl">Install Our PWA</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
          Get instant access to FIFA Smart Stadium AI. Install on your device for the best experience.
        </p>
      </motion.div>

      <motion.div
        variants={fadeSlideUp(reduced)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* PWA Card - Full Width */}
        <GlassCard elevation="L2" padding="lg" className="relative overflow-hidden group hover:border-accent-cyan/50 transition-colors">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-accent-cyan/[0.05] to-transparent" />
          <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.025]" />

          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue p-4 flex items-center justify-center shrink-0">
                <Globe size={32} className="text-void" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Install FIFA Smart Stadium AI</h3>
                <p className="text-base text-text-secondary mt-2">Get instant access from your browser — no app store needed</p>
              </div>
            </div>

            <p className="text-text-secondary mb-8 leading-relaxed text-lg">
              Download FIFA Smart Stadium AI as a progressive web app. Works on any device, updates automatically, and takes minimal storage. Perfect for instant access during matches.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-accent-cyan font-bold text-xl mt-1 shrink-0">✓</span>
                <div>
                  <p className="font-semibold text-white">Instant Installation</p>
                  <p className="text-sm text-text-secondary mt-1">No app store needed — install directly from your browser</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent-cyan font-bold text-xl mt-1 shrink-0">✓</span>
                <div>
                  <p className="font-semibold text-white">Works Offline</p>
                  <p className="text-sm text-text-secondary mt-1">Access with cached data even without internet</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent-cyan font-bold text-xl mt-1 shrink-0">✓</span>
                <div>
                  <p className="font-semibold text-white">Auto-Updates</p>
                  <p className="text-sm text-text-secondary mt-1">Always get the latest features automatically</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleInstall}
              disabled={!canInstall}
              className="w-full md:w-64 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-blue text-void px-6 py-4 font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="inline mr-2" size={20} />
              Install Now
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
