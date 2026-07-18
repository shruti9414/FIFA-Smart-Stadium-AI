import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";

interface HeroIntroProps {
  onStart: () => void;
}

export default function HeroIntro({ onStart }: HeroIntroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1428] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background Grid */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      </motion.div>

      {/* Animated Particles */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.1) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 80%, rgba(34,211,238,0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Central Content */}
      <motion.div
        className="relative z-10 text-center space-y-8 max-w-4xl px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="space-y-4"
        >
          <motion.h1
            className="text-7xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent"
            animate={{
              textShadow: [
                "0 0 20px rgba(34,211,238,0.5)",
                "0 0 40px rgba(34,211,238,0.8)",
                "0 0 20px rgba(34,211,238,0.5)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            FIFA Smart Stadium AI
          </motion.h1>

          <motion.p
            className="text-2xl text-cyan-300/80 font-light tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            AI Operating System for FIFA World Cup 2026
          </motion.p>
        </motion.div>

        {/* Subtitle with typing effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="space-y-4"
        >
          <p className="text-lg text-slate-300/70 max-w-2xl mx-auto leading-relaxed">
            Experience real-time crowd management, emergency response, transportation optimization, and sustainability
            monitoring—powered by advanced AI and real-time decision support.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-cyan-400/60 font-mono">
            <motion.span
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              ▌
            </motion.span>
            <span>Initializing systems...</span>
          </div>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          className="grid grid-cols-4 gap-4 my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          {[
            { label: "Real-time Gates", value: "47" },
            { label: "AI Models", value: "2" },
            { label: "Endpoints", value: "9" },
            { label: "Languages", value: "10+" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="backdrop-blur-xl bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-center"
              whileHover={{ scale: 1.05, borderColor: "rgba(34,211,238,0.6)" }}
              transition={{ delay: 2.1 + i * 0.1 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-2xl font-bold text-cyan-300">{stat.value}</div>
              <div className="text-xs text-cyan-400/60 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          onClick={onStart}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 40px rgba(34,211,238,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          className="mt-12 px-10 py-4 rounded-lg font-bold text-lg flex items-center gap-3 justify-center mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_50px_rgba(34,211,238,0.6)] transition-all"
        >
          <Play size={20} /> Start Demonstration
        </motion.button>

        {/* Footer */}
        <motion.p
          className="text-sm text-slate-400/50 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          Watch as AI manages real-time stadium operations during a live match
        </motion.p>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </div>
  );
}
