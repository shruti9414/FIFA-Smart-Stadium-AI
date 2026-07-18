"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ArrowLeft } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSocket } from "@/hooks/useSocket";
import BootSequence from "@/components/demo/boot-sequence";
import HeroIntro from "@/components/demo/hero-intro";
import StadiumVisualization from "@/components/demo/stadium-visualization";
import CinematicScene from "@/components/demo/cinematic-scene";
import IncidentBroadcaster from "@/components/demo/incident-broadcaster";
import AIMetrics from "@/components/demo/ai-metrics";
import EnhancedProgressTimeline from "@/components/demo/enhanced-progress-timeline";
import AICommanderNotification from "@/components/demo/ai-commander-notification";
import MissionCompleteScreen from "@/components/demo/mission-complete-screen";

interface DemoStep {
  id: string;
  title: string;
  description: string;
  narrative: string;
  narrationMessage: string;
  action: () => Promise<void>;
  delay: number;
  completed: boolean;
  sceneType: "intro" | "crowd" | "incident" | "ai" | "parking" | "match" | "resolution" | "sustainability" | "final";
}

interface AICommanderMessage {
  id: string;
  text: string;
  severity: "info" | "warning" | "critical" | "success";
  duration?: number;
}

export default function DemoPage() {
  const reduced = useReducedMotion();
  const [showBoot, setShowBoot] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [showHero, setShowHero] = useState(!showBoot);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [aiMessage, setAIMessage] = useState<AICommanderMessage | null>(null);
  const [metrics, setMetrics] = useState({
    incidents: 0,
    crowdDensity: 65,
    responseTime: 0,
    systemStatus: "Ready",
  });
  const [stats, setStats] = useState({
    incidentsProcessed: 1,
    avgResponseTime: 134,
    crowdSatisfaction: 94,
    aiAccuracy: 98,
    aiDecisionsGenerated: 18,
    emergencyTeamsCoordinated: 1,
    sustainabilityImpact: 125,
  });

  const [steps, setSteps] = useState<DemoStep[]>([
    {
      id: "welcome",
      title: "FIFA Smart Stadium AI",
      description: "AI Operating System for FIFA World Cup 2026",
      narrative: "Initializing AI operating system for stadium operations...",
      narrationMessage: "Systems initialized. Stadium monitoring active.",
      action: async () => {
        setAIMessage({
          id: "msg-1",
          text: "Stadium monitoring systems activated. All sensors responding.",
          severity: "info",
          duration: 3000,
        });
        setMetrics((p) => ({ ...p, systemStatus: "Monitoring" }));
      },
      delay: 2000,
      completed: false,
      sceneType: "intro",
    },
    {
      id: "crowd_surge",
      title: "Crowd Surge Detected",
      description: "Gate 4 approaching maximum capacity - 82% → 94%",
      narrative:
        "AI systems monitor 47 real-time data points across the stadium. Gate 4 experiences rapid crowd surge. Density rising. Analyzing flow patterns...",
      narrationMessage: "Crowd density exceeded safe threshold. AI recommends opening Gate 5 for overflow management.",
      action: async () => {
        await fetch("/api/sim/trigger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenario: "surge" }),
        }).catch(() => null);
        setAIMessage({
          id: "msg-2",
          text: "Crowd density at Gate 4 critical: 94%. Recommending alternative entry routes.",
          severity: "warning",
          duration: 3500,
        });
        setMetrics((p) => ({ ...p, crowdDensity: 94, systemStatus: "Alert: Crowd Surge" }));
      },
      delay: 5000,
      completed: false,
      sceneType: "crowd",
    },
    {
      id: "incident_medical",
      title: "Medical Emergency",
      description: "Visitor reports medical incident at Gate 3, Section B2",
      narrative:
        "Medical alert received. AI severity assessment: HIGH. Incident location: Gate 3, Section B2. Symptoms indicate potential cardiac event. Immediate intervention required.",
      narrationMessage: "Medical emergency detected. Dispatching nearest medical team. Response time: 2 minutes 14 seconds.",
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
        }).catch(() => null);
        setAIMessage({
          id: "msg-3",
          text: "CRITICAL: Medical emergency at Gate 3, B2. Medical team dispatched. ETA: 2 minutes.",
          severity: "critical",
          duration: 4000,
        });
        setMetrics((p) => ({ ...p, incidents: p.incidents + 1, systemStatus: "Critical: Medical" }));
        setIncidents((p) => [{ id: Date.now(), type: "MEDICAL", location: "Gate 3, B2" }, ...p.slice(0, 3)]);
        setStats((p) => ({
          ...p,
          incidentsProcessed: Math.max(p.incidentsProcessed, 1),
          emergencyTeamsCoordinated: Math.max(p.emergencyTeamsCoordinated, 1),
        }));
      },
      delay: 5000,
      completed: false,
      sceneType: "incident",
    },
    {
      id: "ai_recommendation",
      title: "AI Decision Support",
      description: "System recommends immediate medical team dispatch + crowd rerouting",
      narrative:
        "Autonomous decision engine activates. Optimal response: Deploy medical team to Gate 3. Estimated response time: 2 minutes 14 seconds. Simultaneously initiating crowd reroute through Gate 5 and Emergency Exit 7. Staff repositioning: +3 medical personnel, +2 security.",
      narrationMessage: "AI has generated optimal response strategy. Executing multi-department coordination automatically.",
      action: async () => {
        setAIMessage({
          id: "msg-4",
          text: "Response strategy optimized. AI coordinating medical, security, and crowd management teams.",
          severity: "info",
          duration: 3500,
        });
        setMetrics((p) => ({ ...p, responseTime: 134, systemStatus: "Resolving" }));
        setStats((p) => ({
          ...p,
          avgResponseTime: 134,
          aiDecisionsGenerated: 18,
          emergencyTeamsCoordinated: 1,
        }));
      },
      delay: 4000,
      completed: false,
      sceneType: "ai",
    },
    {
      id: "parking_update",
      title: "Transportation Optimization",
      description: "Parking Lot A at 92% capacity - overflow routing active",
      narrative:
        "Transportation AI detects Lot A approaching saturation. Predictive model shows continued inflow. Activating overflow protocol. Redirecting arriving vehicles to Lot B (31% available) and Premium Lot C (58% available). ETA updates broadcast to navigation systems.",
      narrationMessage: "Parking optimization active. Vehicles being routed to Lots B and C to balance capacity.",
      action: async () => {
        setAIMessage({
          id: "msg-5",
          text: "Parking Lot A near capacity. Routing new arrivals to Lots B (31% available) and C (58% available).",
          severity: "warning",
          duration: 3500,
        });
        setMetrics((p) => ({ ...p, systemStatus: "Transport Optimized" }));
      },
      delay: 4000,
      completed: false,
      sceneType: "parking",
    },
    {
      id: "match_event",
      title: "Match Event: GOAL!",
      description: "Argentina scores! Crowd surge +12% - predictive systems engaged",
      narrative:
        "Goal scored! Argentina takes the lead. Crowd sentiment spike detected across 45,000 sensors. Predicted restroom demand increase: 340% in next 8 minutes. Preemptive facility prep initiated. Additional staff deployed to facilities. Concession restock prioritized.",
      narrationMessage: "Goal detected! Predictive models anticipate 340% increase in facility demand. Pre-positioning staff now.",
      action: async () => {
        setAIMessage({
          id: "msg-6",
          text: "Match event: Goal scored! AI predicting +340% restroom demand. Preemptively deploying staff.",
          severity: "info",
          duration: 3500,
        });
        setMetrics((p) => ({ ...p, crowdDensity: Math.min(98, p.crowdDensity + 8) }));
        setStats((p) => ({
          ...p,
          crowdSatisfaction: Math.min(94, p.crowdSatisfaction + 3),
        }));
      },
      delay: 4000,
      completed: false,
      sceneType: "match",
    },
    {
      id: "resolution",
      title: "Incident Resolution",
      description: "Medical team secured patient - status: RESOLVED",
      narrative:
        "Medical team arrived at scene. Patient stabilized. Secondary assessment complete. Patient transported to medical center via optimal route avoiding crowd congestion. Full incident log recorded. Post-incident analysis initiated. System returning to normal operations.",
      narrationMessage: "Incident successfully resolved. Patient transported to medical center. System returning to normal.",
      action: async () => {
        setAIMessage({
          id: "msg-7",
          text: "Incident resolved. Patient safely transported to medical center. All metrics normalized.",
          severity: "success",
          duration: 3500,
        });
        setMetrics((p) => ({ ...p, systemStatus: "Normal", crowdDensity: 78 }));
        setStats((p) => ({ ...p, aiAccuracy: 98 }));
      },
      delay: 4000,
      completed: false,
      sceneType: "resolution",
    },
    {
      id: "sustainability",
      title: "Real-time Sustainability",
      description: "Stadium operating at 78% renewable energy with 94% waste diversion",
      narrative:
        "Sustainability systems reporting nominal. Current operations: 78% powered by renewable sources with 14MW solar capacity. Water reclamation system processing 125,000 gallons. Waste diversion: 94% through AI-optimized sorting. Carbon footprint: -245 tons offset through reforestation program.",
      narrationMessage: "Sustainability metrics excellent. Stadium operating 78% renewable with zero environmental impact.",
      action: async () => {
        setAIMessage({
          id: "msg-8",
          text: "Sustainability systems optimal: 78% renewable energy, 94% waste diversion, 125K gallons water saved.",
          severity: "success",
          duration: 3500,
        });
        setStats((p) => ({ ...p, sustainabilityImpact: 125 }));
      },
      delay: 4000,
      completed: false,
      sceneType: "sustainability",
    },
    {
      id: "closing",
      title: "System Ready",
      description: "All systems nominal for FIFA World Cup 2026",
      narrative:
        "FIFA Smart Stadium AI operating at peak efficiency. All monitoring systems green. Real-time crowd management: ✓ Medical response: ✓ Transportation optimization: ✓ Sustainability: ✓ Staff coordination: ✓ Fan experience: ✓ Ready for FIFA World Cup 2026.",
      narrationMessage: "All systems operational and ready. FIFA Smart Stadium AI prepared for World Cup 2026.",
      action: async () => {
        setAIMessage({
          id: "msg-9",
          text: "FIFA Smart Stadium AI ready for FIFA World Cup 2026. All systems operational. ✓",
          severity: "success",
          duration: 3000,
        });
        setMetrics((p) => ({ ...p, systemStatus: "Ready for 2026" }));
      },
      delay: 3000,
      completed: false,
      sceneType: "final",
    },
  ]);

  const stadiumRef = useRef<any>(null);

  useSocket("incident:new", (payload) => {
    setIncidents((prev) => [
      { id: payload.incidentId, type: payload.type.toUpperCase(), location: payload.locationDesc },
      ...prev.slice(0, 3),
    ]);
  });

  useSocket("crowd:update", (payload) => {
    if (payload.locationType === "gate") {
      setMetrics((p) => ({ ...p, crowdDensity: payload.densityPct }));
      if (stadiumRef.current) {
        stadiumRef.current.updateGate(payload.locationId, payload.densityPct);
      }
    }
  });

  const runDemo = useCallback(async () => {
    setShowHero(false);
    setIsRunning(true);
    setMetrics({
      incidents: 0,
      crowdDensity: 65,
      responseTime: 0,
      systemStatus: "Running",
    });

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
    setShowHero(true);
    setShowBoot(false);
    setIncidents([]);
    setAIMessage(null);
    setMetrics({
      incidents: 0,
      crowdDensity: 65,
      responseTime: 0,
      systemStatus: "Ready",
    });
    setStats({
      incidentsProcessed: 1,
      avgResponseTime: 134,
      crowdSatisfaction: 94,
      aiAccuracy: 98,
      aiDecisionsGenerated: 18,
      emergencyTeamsCoordinated: 1,
      sustainabilityImpact: 125,
    });
    setSteps((prev) => prev.map((s) => ({ ...s, completed: false })));
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1428] overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          background: isRunning
            ? [
                "radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.1) 0%, transparent 50%)",
                "radial-gradient(ellipse at 80% 80%, rgba(34,211,238,0.1) 0%, transparent 50%)",
                "radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.1) 0%, transparent 50%)",
              ]
            : "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.05) 0%, transparent 50%)",
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Boot Sequence */}
      <AnimatePresence>
        {showBoot && (
          <BootSequence onComplete={() => { setShowBoot(false); setShowHero(true); }} />
        )}
      </AnimatePresence>

      {/* Hero Screen */}
      <AnimatePresence>
        {showHero && !showBoot && (
          <motion.div
            key="hero"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-40"
          >
            <HeroIntro onStart={() => runDemo()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {!showHero && !showBoot && (
        <>
          {/* Top Control Bar */}
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="absolute top-0 left-0 right-0 z-30 backdrop-blur-xl bg-black/20 border-b border-cyan-500/20 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft size={20} className="text-cyan-400" />
                </motion.button>
              </Link>
              <div className="hidden sm:block">
                <h2 className="text-lg font-bold text-cyan-300">FIFA Smart Stadium AI</h2>
                <p className="text-xs text-cyan-400/70">Live Mission Control</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (isRunning ? setIsRunning(false) : runDemo())}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm transition-all ${
                  isRunning
                    ? "bg-red-500/30 border border-red-500 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    : "bg-cyan-500/20 border border-cyan-500 text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause size={16} /> <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={16} /> <span className="hidden sm:inline">Start</span>
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetDemo}
                className="px-3 sm:px-4 py-2 rounded-lg bg-slate-500/20 border border-slate-500 text-slate-300 hover:bg-slate-500/30 transition-all flex items-center gap-2 text-sm"
              >
                <RotateCcw size={16} /> <span className="hidden sm:inline">Reset</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Enhanced Progress Timeline */}
          {isRunning && (
            <EnhancedProgressTimeline
              steps={steps}
              currentStepIndex={currentStep}
              isRunning={isRunning}
            />
          )}

          {/* Main Layout */}
          <div className="pt-16 sm:pt-20 pb-4 sm:pb-6 px-3 sm:px-6 h-screen overflow-hidden flex flex-col gap-3 sm:gap-4">
            {/* Top Row: Stadium Visualization + Metrics */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 min-h-0">
              {/* Stadium (Left 2 cols) */}
              <div className="col-span-1 lg:col-span-2 min-h-0">
                <StadiumVisualization
                  ref={stadiumRef}
                  crowdDensity={metrics.crowdDensity}
                  incident={currentStep !== null && steps[currentStep]?.sceneType === "incident"}
                  isRunning={isRunning}
                />
              </div>

              {/* Right Metrics */}
              <div className="min-h-0 overflow-y-auto">
                <AIMetrics metrics={metrics} isRunning={isRunning} />
              </div>
            </div>

            {/* Bottom Row: Cinematic Scene + Incident Feed */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 min-h-0">
              {/* Scene (Left) */}
              <div className="min-h-0">
                <CinematicScene
                  step={currentStep !== null ? steps[currentStep] : null}
                  isRunning={isRunning}
                  allSteps={steps}
                  currentStepIndex={currentStep}
                />
              </div>

              {/* Incident Broadcaster (Right) */}
              <div className="min-h-0">
                <IncidentBroadcaster incidents={incidents} isRunning={isRunning} />
              </div>
            </div>
          </div>

          {/* AI Commander Notification */}
          <AICommanderNotification message={aiMessage} />

          {/* Mission Complete Screen */}
          <AnimatePresence>
            {!isRunning && currentStep === null && steps.every((s) => s.completed) && (
              <motion.div
                key="completion"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-30"
              >
                <MissionCompleteScreen stats={stats} onReset={resetDemo} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
