"use client";

import { AnimatePresence, motion } from "framer-motion";

const PARTICLES = Array.from({ length: 16 }).map((_, i) => ({
  angle: (i / 16) * 360,
  color: i % 3 === 0 ? "#22D3EE" : i % 3 === 1 ? "#10B981" : "#3B82F6",
}));

export function GoalCelebration({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden rounded-lg">
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{ backgroundColor: p.color }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * 140,
                y: Math.sin((p.angle * Math.PI) / 180) * 140,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          ))}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="gradient-ai-core rounded-full px-6 py-2 font-display text-lg font-bold text-void shadow-[var(--shadow-glow-cyan)]"
          >
            ⚽ GOAL!
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
