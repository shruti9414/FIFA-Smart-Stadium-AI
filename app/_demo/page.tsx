"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, ArrowLeft, Sparkles } from "lucide-react";
import { TopBar } from "@/components/shared/top-bar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { Ticker, type TickerItem } from "@/components/shared/ticker";
import { fadeSlideUp, staggerChildren } from "@/lib/motion/variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSocket } from "@/hooks/useSocket";

interface DemoStep {
  id: string;
  title: string;
  description: string;
  action: () => Promise<void>;
  delay: number;
  completed: boolean;
}

export default function DemoPage() {
  const reduced = useReducedMotion();
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [steps, setSteps] = useState<DemoStep[]>([
    {
      id: "welcome",
      title: "Welcome to FIFA Smart Stadium AI",
      description: "Demonstration of operational intelligence during match day.",
      action: async () => console.log("Welcome"),
      delay: 2000,
      completed: false,
    },
    {
      id: "crowd_surge",
      title: "Monitor: Crowd Surge Detection",
      description: "System detects rising occupancy in Section A1 (82% → 94%)",
      action: async () => {
        await fetch("/api/sim/trigger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenario: "surge" }),
        });
      },
      delay: 4000,
      completed: false,
    },
    {
      id: "incident_medical",
      title: "Emergency: Medical Incident Reported",
      description: "Visitor reports medical emergency at Gate 3, Section B2. AI analyzing response.",
      action: async () => {
        await fetch("/api/incidents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "medical",
            severity: "high",
            location_desc: "Gate 3, Section B2",
            description: "Visitor experiencing chest pain",
            reported_by: "demo@system.com",
          }),
        });
      },
      delay: 5000,
      completed: false,
    },
    {
      id: "ai_recommendation",
      title: "AI Decision Support",
      description: "System recommends immediate medical team dispatch + crowd rerouting via Gate 5",
      action: async () => console.log("AI Recommendation rendered"),
      delay: 3000,
      completed: false,
    },
    {
      id: "parking_update",
      title: "Transportation Update",
      description: "Parking Lot A reaches 92% capacity. AI suggests overflow to Lot B.",
      action: async () => console.log("Parking update"),
      delay: 3000,
      completed: false,
    },
    {
      id: "match_event",
      title: "Match: Goal Scored!",
      description: "Argentina scores! System updates crowd sentiment and predicts increased restroom demand.",
      action: async () => console.log("Match event"),
      delay: 4000,
      completed: false,
    },
    {
      id: "resolution",
      title: "Incident Resolution",
      description: "Medical team resolves incident. Patient transported to medical center. Status: RESOLVED",
      action: async () => console.log("Incident resolved"),
      delay: 3000,
      completed: false,
    },
    {
      id: "sustainability",
      title: "Sustainability in Action",
      description: "Energy: 78% renewable   |   Waste: 94% diverted   |   Water: 125K gal saved",
      action: async () => console.log("Sustainability metrics"),
      delay: 4000,
      completed: false,
    },
    {
      id: "closing",
      title: "Smart Stadium Operations: Live & Operational",
      description: "All systems nominal. AI continuously optimizing for fan safety, operational efficiency, and sustainability.",
      action: async () => console.log("Demo complete"),
      delay: 3000,
      completed: false,
    },
  ]);

  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);

  useSocket("incident:new", (payload) => {
    setTickerItems((prev) => [
      { id: `${payload.incidentId}`, text: `NEW INCIDENT: ${payload.type.toUpperCase()} - ${payload.locationDesc}` },
      ...prev.slice(0, 4),
    ]);
  });

  const runDemo = useCallback(async () => {
    setIsRunning(true);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await steps[i].action();
      await new Promise((resolve) => setTimeout(resolve, steps[i].delay));

      setSteps((prev) => {
        const updated = [...prev];
        updated[i].completed = true;
        return updated;
      });
    }

    setIsRunning(false);
    setCurrentStep(null);
  }, [steps]);

  const resetDemo = useCallback(() => {
    setIsRunning(false);
    setCurrentStep(null);
    setSteps((prev) => prev.map((s) => ({ ...s, completed: false })));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-void via-void to-void/95">
      <TopBar
        title="Presentation Mode"
        left={<Link href="/"><Button variant="ghost" size="sm"><ArrowLeft size={18} /></Button></Link>}
        right={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => (isRunning ? setIsRunning(false) : runDemo())}
              className={isRunning ? "bg-state-critical shadow-[0_0_20px_rgba(244,63,94,0.4)]" : ""}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              {isRunning ? "Running..." : "Start"}
            </Button>
            <Button size="sm" variant="secondary" onClick={resetDemo}>
              <RotateCcw size={16} />
            </Button>
          </div>
        }
      />

      <motion.div
        variants={staggerChildren(false, 60)}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center"
      >
        <div className="mx-auto w-full max-w-3xl space-y-6">
          {/* Status */}
          <motion.div variants={fadeSlideUp(false)}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-text-primary">
                    Automated Scenario Demonstration
                  </h1>
                  <p className="text-text-secondary mt-2">
                    This demo automatically triggers realistic match-day scenarios to showcase AI capabilities.
                  </p>
                </div>
                <Badge className={isRunning ? "bg-state-warning text-void animate-pulse" : "bg-state-success text-white"}>
                  {isRunning ? "Running..." : currentStep !== null ? "Paused" : "Ready"}
                </Badge>
              </div>
            </GlassCard>
          </motion.div>

          {/* Ticker Feed */}
          {tickerItems.length > 0 && (
            <motion.div variants={fadeSlideUp(false)}>
              <GlassCard className="p-6">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-text-muted mb-4">
                  Live Incident Stream
                </h2>
                <Ticker items={tickerItems} />
              </GlassCard>
            </motion.div>
          )}

          {/* Steps */}
          <motion.div variants={fadeSlideUp(false)}>
            <GlassCard className="p-6">
              <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Scenario Sequence</h2>
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <motion.div
                    key={step.id}
                    variants={fadeSlideUp(false)}
                    className={`flex gap-4 p-4 rounded border transition-all duration-300 ${
                      currentStep === idx
                        ? "border-accent-cyan bg-accent-cyan/5 shadow-[0_0_24px_rgba(34,211,238,0.2)]"
                        : step.completed
                          ? "border-state-success bg-state-success/5"
                          : "border-border-subtle"
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 font-mono text-xs font-semibold">
                      {step.completed ? (
                        <div className="w-4 h-4 rounded-full bg-state-success" />
                      ) : currentStep === idx ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                          <Sparkles size={16} className="text-accent-cyan" />
                        </motion.div>
                      ) : (
                        <span className="text-text-muted">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary">{step.title}</p>
                      <p className="text-sm text-text-secondary mt-1">{step.description}</p>
                    </div>
                    <div className="text-right text-xs text-text-muted flex-shrink-0">
                      ~{Math.round(step.delay / 1000)}s
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Info */}
          <motion.div variants={fadeSlideUp(false)}>
            <GlassCard className="p-6 bg-surface/50">
              <p className="text-sm text-text-secondary">
                💡 <span className="font-semibold">Pro Tip:</span> Click "Start Demo" to see the system automatically
                handle crowd surges, medical emergencies, transportation optimization, and AI recommendations. Perfect for
                judges to evaluate the platform's real-time capabilities without manual intervention.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
