"use client";

import { motion } from "framer-motion";
import {
  PlayCircle,
  AlertTriangle,
  AlertCircle,
  Zap,
  ParkingCircle,
  Trophy,
  CheckCircle,
  Leaf,
  Target,
} from "lucide-react";

interface Step {
  id: string;
  title: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface ProgressTimelineProps {
  steps: Step[];
  currentStepIndex: number | null;
  isRunning: boolean;
}

export default function ProgressTimeline({
  steps,
  currentStepIndex,
  isRunning,
}: ProgressTimelineProps) {
  const icons = [
    <PlayCircle key="0" size={18} />,
    <AlertTriangle key="1" size={18} />,
    <AlertCircle key="2" size={18} />,
    <Zap key="3" size={18} />,
    <ParkingCircle key="4" size={18} />,
    <Trophy key="5" size={18} />,
    <CheckCircle key="6" size={18} />,
    <Leaf key="7" size={18} />,
    <Target key="8" size={18} />,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 left-6 right-6 z-30 hidden lg:block"
    >
      <div className="backdrop-blur-xl bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4">
        {/* Timeline Title */}
        <p className="text-xs font-mono text-cyan-400/60 uppercase tracking-widest mb-3">
          Presentation Progress — {currentStepIndex !== null ? currentStepIndex + 1 : 0} / {steps.length}
        </p>

        {/* Timeline */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((step, idx) => {
            const isCurrent = currentStepIndex === idx;
            const isCompleted = step.completed;
            const isUpcoming = idx > (currentStepIndex || -1);

            return (
              <motion.div
                key={step.id}
                className="flex items-center gap-2 flex-shrink-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {/* Step Button */}
                <motion.div
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full
                    transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-green-500/30 border border-green-500/60"
                        : isCurrent
                          ? "bg-cyan-500/30 border border-cyan-500/60"
                          : "bg-slate-700/50 border border-slate-600/50"
                    }
                  `}
                  whileHover={{
                    scale: 1.1,
                  }}
                  animate={{
                    boxShadow: isCurrent
                      ? [
                          "0 0 10px rgba(34, 211, 238, 0.3)",
                          "0 0 20px rgba(34, 211, 238, 0.6)",
                          "0 0 10px rgba(34, 211, 238, 0.3)",
                        ]
                      : "0 0 0px rgba(34, 211, 238, 0)",
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{
                      scale: isCurrent ? [1, 1.1, 1] : 1,
                      rotate: isCompleted ? 360 : 0,
                    }}
                    transition={{
                      duration: isCompleted ? 0.6 : 2,
                      repeat: isCurrent ? Infinity : 0,
                      ...(isCurrent && { repeatType: "loop" }),
                    }}
                    className={`
                      ${isCompleted ? "text-green-300" : isCurrent ? "text-cyan-300" : "text-slate-400"}
                    `}
                  >
                    {icons[idx]}
                  </motion.div>
                </motion.div>

                {/* Connector */}
                {idx < steps.length - 1 && (
                  <motion.div
                    className="w-6 h-0.5 flex-shrink-0 relative"
                    animate={{
                      background: isCompleted
                        ? "linear-gradient(90deg, rgb(34, 197, 94) 0%, rgb(34, 197, 94) 100%)"
                        : isCurrent
                          ? "linear-gradient(90deg, rgb(34, 211, 238) 0%, rgba(34, 211, 238, 0.2) 100%)"
                          : "rgba(100, 116, 139, 0.3)",
                    }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-3 pt-3 border-t border-cyan-500/10 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500/60 animate-pulse" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-600/60" />
            <span>Upcoming</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
