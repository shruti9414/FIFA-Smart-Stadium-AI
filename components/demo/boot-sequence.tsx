"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [stage, setStage] = useState(0);

  const stages = [
    { text: "Connecting to Stadium Sensors...", duration: 800 },
    { text: "Connecting AI Models...", duration: 800 },
    { text: "Loading Live Crowd Data...", duration: 800 },
    { text: "Synchronizing Emergency Systems...", duration: 800 },
    { text: "Calibrating Real-time Analytics...", duration: 600 },
    { text: "Initializing Neural Networks...", duration: 600 },
    { text: "Activating Decision Support...", duration: 600 },
    { text: "Mission Control Online", duration: 1000 },
  ];

  useEffect(() => {
    if (stage < stages.length) {
      const timer = setTimeout(() => setStage(stage + 1), stages[stage].duration);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [stage, stages, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1428] flex flex-col items-center justify-center overflow-hidden z-50"
    >
      {/* Animated Background Grid */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.1) 0%, transparent 70%)",
            "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.2) 0%, transparent 70%)",
            "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.1) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Scanning Lines */}
      <motion.div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            animate={{
              y: [0, 800],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.25,
              repeat: Infinity,
            }}
          />
        ))}
      </motion.div>

      {/* Central Logo Area */}
      <motion.div
        className="relative z-10 space-y-12 max-w-2xl text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <motion.div
            className="relative"
            animate={{
              boxShadow: [
                "0 0 30px rgba(34,211,238,0.3)",
                "0 0 60px rgba(34,211,238,0.6)",
                "0 0 30px rgba(34,211,238,0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              FIFA Smart Stadium AI
            </div>
            <div className="text-lg text-cyan-400/60 font-mono mt-2 tracking-widest">
              MISSION CONTROL
            </div>
          </motion.div>
        </motion.div>

        {/* Loading Status */}
        <motion.div className="space-y-6">
          {/* Current Stage */}
          <div className="space-y-2">
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <p className="text-xl text-cyan-300 font-mono">
                {stages[Math.min(stage, stages.length - 1)].text}
              </p>
              {stage < stages.length - 1 && (
                <motion.span
                  animate={{ opacity: [0, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block ml-2"
                >
                  ▌
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-1 bg-slate-700/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"
                animate={{
                  width: `${((stage + 1) / stages.length) * 100}%`,
                }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <div className="text-xs text-cyan-400/60 text-right font-mono">
              {Math.round(((stage + 1) / stages.length) * 100)}%
            </div>
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-center gap-2">
            {stages.map((_, idx) => (
              <motion.div
                key={idx}
                className="w-2 h-2 rounded-full"
                animate={{
                  backgroundColor:
                    idx < stage
                      ? "rgb(34, 211, 238)"
                      : idx === stage
                        ? "rgb(34, 211, 238)"
                        : "rgba(34, 211, 238, 0.2)",
                  scale: idx === stage ? 1.3 : 1,
                  boxShadow:
                    idx === stage
                      ? "0 0 10px rgba(34, 211, 238, 0.6)"
                      : "none",
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Success Message */}
        {stage >= stages.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="pt-8 space-y-3"
          >
            <motion.div
              className="text-4xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ✓
            </motion.div>
            <p className="text-green-400 font-bold text-lg">
              SYSTEMS READY
            </p>
            <p className="text-cyan-300/70 text-sm">
              Launching presentation...
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Corner Accents */}
      <motion.div
        className="absolute top-4 left-4 w-8 h-8 border-2 border-cyan-500/30"
        animate={{
          borderColor: [
            "rgba(34, 211, 238, 0.3)",
            "rgba(34, 211, 238, 0.6)",
            "rgba(34, 211, 238, 0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-4 right-4 w-8 h-8 border-2 border-cyan-500/30"
        animate={{
          borderColor: [
            "rgba(34, 211, 238, 0.3)",
            "rgba(34, 211, 238, 0.6)",
            "rgba(34, 211, 238, 0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
    </motion.div>
  );
}
