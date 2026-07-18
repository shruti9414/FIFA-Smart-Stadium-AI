"use client";

import { motion } from "framer-motion";
import { CheckCircle, RotateCcw, ArrowRight, TrendingUp, Zap, Shield, Brain, Users, Leaf, Activity } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface CompletionStats {
  incidentsProcessed: number;
  avgResponseTime: number;
  crowdSafetyScore: number;
  aiDecisionsGenerated: number;
  emergencyTeamsCoordinated: number;
  sustainabilityImpact: number;
}

interface PremiumCompletionProps {
  stats: CompletionStats;
  onReset: () => void;
}

export default function PremiumCompletion({ stats, onReset }: PremiumCompletionProps) {
  const [counters, setCounters] = useState({
    incidents: 0,
    responseTime: 0,
    safety: 0,
    decisions: 0,
    teams: 0,
    sustainability: 0,
  });

  useEffect(() => {
    const intervals = [
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            incidents: Math.min(p.incidents + 1, stats.incidentsProcessed),
          })),
        80
      ),
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            responseTime:
              p.responseTime < stats.avgResponseTime
                ? p.responseTime + Math.ceil(stats.avgResponseTime / 20)
                : stats.avgResponseTime,
          })),
        60
      ),
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            safety: Math.min(p.safety + 1, stats.crowdSafetyScore),
          })),
        40
      ),
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            decisions: Math.min(p.decisions + 2, stats.aiDecisionsGenerated),
          })),
        50
      ),
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            teams: Math.min(p.teams + 1, stats.emergencyTeamsCoordinated),
          })),
        70
      ),
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            sustainability: Math.min(p.sustainability + 1, stats.sustainabilityImpact),
          })),
        45
      ),
    ];

    return () => intervals.forEach(clearInterval);
  }, [stats]);

  const statCards = [
    {
      icon: <Activity size={24} />,
      label: "Incidents Processed",
      value: counters.incidents,
      color: "from-red-600 to-red-500",
      suffix: "",
    },
    {
      icon: <Zap size={24} />,
      label: "Avg Response Time",
      value: counters.responseTime,
      color: "from-blue-600 to-blue-500",
      suffix: "s",
    },
    {
      icon: <Shield size={24} />,
      label: "Crowd Safety Score",
      value: counters.safety,
      color: "from-green-600 to-green-500",
      suffix: "%",
    },
    {
      icon: <Brain size={24} />,
      label: "AI Decisions Generated",
      value: counters.decisions,
      color: "from-purple-600 to-purple-500",
      suffix: "",
    },
    {
      icon: <Users size={24} />,
      label: "Emergency Teams Coordinated",
      value: counters.teams,
      color: "from-orange-600 to-orange-500",
      suffix: "",
    },
    {
      icon: <Leaf size={24} />,
      label: "Sustainability Impact",
      value: counters.sustainability,
      color: "from-teal-600 to-teal-500",
      suffix: "K gal saved",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1428] flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto z-50"
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 80%, rgba(34,211,238,0.2) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center space-y-8 max-w-5xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {/* Success Icon */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.4)]"
            animate={{
              boxShadow: [
                "0 0 40px rgba(34,197,94,0.3)",
                "0 0 80px rgba(34,197,94,0.6)",
                "0 0 40px rgba(34,197,94,0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <CheckCircle size={64} className="text-white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-cyan-300 via-green-300 to-cyan-300 bg-clip-text text-transparent">
            Demonstration Complete
          </h1>
          <p className="text-lg sm:text-xl text-green-300/80 font-light">
            System Status: <span className="font-bold text-green-300">SUCCESS</span>
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, staggerChildren: 0.1 }}
        >
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              className={`group relative p-6 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg overflow-hidden`}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 1.3 + i * 0.1,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-white/5"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              />

              {/* Content */}
              <div className="relative z-10 space-y-3">
                <div className="flex justify-between items-start">
                  <motion.div
                    className="text-white/80 opacity-80 group-hover:opacity-100 transition-opacity"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                    }}
                  >
                    <TrendingUp size={18} className="text-white/60" />
                  </motion.div>
                </div>

                <div>
                  <p className="text-white/70 text-xs sm:text-sm font-mono uppercase">
                    {stat.label}
                  </p>
                  <motion.p
                    className="text-3xl sm:text-4xl font-black text-white mt-1"
                    key={Math.floor(stat.value)}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.4 }}
                  >
                    {stat.value}
                    <span className="text-lg ml-1 opacity-70">{stat.suffix}</span>
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary Message */}
        <motion.div
          className="space-y-4 px-6 py-6 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <motion.p
            className="text-lg sm:text-xl text-slate-100 font-light leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 1 }}
          >
            FIFA Smart Stadium AI successfully demonstrated real-time operational intelligence
            for FIFA World Cup 2026.
          </motion.p>
          <motion.p
            className="text-sm text-cyan-300/70 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 1 }}
          >
            All systems operational. Ready for live deployment. ✓
          </motion.p>
        </motion.div>

        {/* Key Achievements */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.8 }}
        >
          {[
            "✓ Real-time Crowd Management",
            "✓ Emergency Response AI",
            "✓ Transportation Optimization",
            "✓ Live Decision Support",
            "✓ Sustainability Tracking",
            "✓ Multi-language Support",
          ].map((achievement, i) => (
            <motion.div
              key={i}
              className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300/90 text-sm font-semibold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3.1 + i * 0.05 }}
            >
              {achievement}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.4, duration: 0.8 }}
        >
          <motion.button
            onClick={onReset}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(34,211,238,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all"
          >
            <RotateCcw size={18} /> Run Demo Again
          </motion.button>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-slate-700/50 border border-slate-600 text-slate-200 hover:bg-slate-700/70 transition-all"
            >
              <ArrowRight size={18} /> Return to Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-xs text-slate-400/60 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.8, duration: 1 }}
        >
          🏆 FIFA Smart Stadium AI — Championship Software for Championship Events
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
