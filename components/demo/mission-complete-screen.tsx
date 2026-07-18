"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, RotateCcw } from "lucide-react";
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

interface MissionCompleteScreenProps {
  stats: CompletionStats;
  onReset: () => void;
}

export default function MissionCompleteScreen({ stats, onReset }: MissionCompleteScreenProps) {
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
            incidents: Math.min(p.incidents + 1, stats.incidentsProcessed || 0),
          })),
        80
      ),
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            responseTime:
              p.responseTime < (stats.avgResponseTime || 0)
                ? p.responseTime + Math.ceil((stats.avgResponseTime || 0) / 20)
                : stats.avgResponseTime || 0,
          })),
        60
      ),
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            safety: Math.min(p.safety + 1, stats.crowdSafetyScore || 0),
          })),
        40
      ),
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            decisions: Math.min(p.decisions + 2, stats.aiDecisionsGenerated || 0),
          })),
        50
      ),
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            teams: Math.min(p.teams + 1, stats.emergencyTeamsCoordinated || 0),
          })),
        70
      ),
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            sustainability: Math.min(p.sustainability + 1, stats.sustainabilityImpact || 0),
          })),
        45
      ),
    ];

    return () => intervals.forEach(clearInterval);
  }, [stats]);

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
            "radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.08) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 80%, rgba(34,211,238,0.12) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.08) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center space-y-6 sm:space-y-8 max-w-4xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {/* Header with Checkmark */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.3)]"
            animate={{
              boxShadow: [
                "0 0 30px rgba(34,211,238,0.2)",
                "0 0 60px rgba(34,211,238,0.5)",
                "0 0 30px rgba(34,211,238,0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <CheckCircle size={56} className="text-cyan-400" />
            </motion.div>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-cyan-300">Mission Complete</h1>
            <p className="text-sm sm:text-base text-cyan-400/70 font-mono">
              SYSTEM STATUS: <span className="text-green-400 font-bold">SUCCESS</span>
            </p>
          </div>
        </motion.div>

        {/* Mission Summary Dashboard */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {/* Title */}
          <div className="text-left">
            <p className="text-xs font-mono text-cyan-400/60 uppercase tracking-widest mb-4">
              ▸ Mission Summary
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Incidents Processed */}
            <motion.div
              className="rounded-lg border border-cyan-500/20 bg-gradient-to-br from-slate-900/60 to-slate-900/30 backdrop-blur-xl p-4 sm:p-6 space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              whileHover={{ borderColor: "rgba(34, 211, 238, 0.4)" }}
            >
              <p className="text-xs text-cyan-400/60 font-mono uppercase tracking-wide">
                Incidents Processed
              </p>
              <motion.div
                className="text-3xl sm:text-4xl font-bold text-cyan-300 font-mono"
                key={Math.floor(counters.incidents)}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
              >
                {counters.incidents || 0}
              </motion.div>
              <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  animate={{ width: `${(counters.incidents / Math.max(stats.incidentsProcessed, 1)) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>

            {/* Average Response Time */}
            <motion.div
              className="rounded-lg border border-cyan-500/20 bg-gradient-to-br from-slate-900/60 to-slate-900/30 backdrop-blur-xl p-4 sm:p-6 space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ borderColor: "rgba(34, 211, 238, 0.4)" }}
            >
              <p className="text-xs text-cyan-400/60 font-mono uppercase tracking-wide">
                Avg Response Time
              </p>
              <motion.div
                className="text-3xl sm:text-4xl font-bold text-cyan-300 font-mono"
                key={Math.floor(counters.responseTime)}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
              >
                {counters.responseTime || 0}
                <span className="text-lg ml-1 opacity-60">s</span>
              </motion.div>
              <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  animate={{ width: `${Math.min((counters.responseTime / 180) * 100, 100)}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>

            {/* Crowd Safety Score */}
            <motion.div
              className="rounded-lg border border-cyan-500/20 bg-gradient-to-br from-slate-900/60 to-slate-900/30 backdrop-blur-xl p-4 sm:p-6 space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              whileHover={{ borderColor: "rgba(34, 211, 238, 0.4)" }}
            >
              <p className="text-xs text-cyan-400/60 font-mono uppercase tracking-wide">
                Crowd Safety Score
              </p>
              <motion.div
                className="text-3xl sm:text-4xl font-bold text-cyan-300 font-mono"
                key={Math.floor(counters.safety)}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
              >
                {counters.safety || 0}
                <span className="text-lg ml-1 opacity-60">%</span>
              </motion.div>
              <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                  animate={{ width: `${(counters.safety / Math.max(stats.crowdSafetyScore, 100)) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>

            {/* AI Decisions Generated */}
            <motion.div
              className="rounded-lg border border-cyan-500/20 bg-gradient-to-br from-slate-900/60 to-slate-900/30 backdrop-blur-xl p-4 sm:p-6 space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              whileHover={{ borderColor: "rgba(34, 211, 238, 0.4)" }}
            >
              <p className="text-xs text-cyan-400/60 font-mono uppercase tracking-wide">
                AI Decisions Generated
              </p>
              <motion.div
                className="text-3xl sm:text-4xl font-bold text-cyan-300 font-mono"
                key={Math.floor(counters.decisions)}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
              >
                {counters.decisions || 0}
              </motion.div>
              <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  animate={{ width: `${(counters.decisions / Math.max(stats.aiDecisionsGenerated, 1)) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>

            {/* Emergency Teams Coordinated */}
            <motion.div
              className="rounded-lg border border-cyan-500/20 bg-gradient-to-br from-slate-900/60 to-slate-900/30 backdrop-blur-xl p-4 sm:p-6 space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              whileHover={{ borderColor: "rgba(34, 211, 238, 0.4)" }}
            >
              <p className="text-xs text-cyan-400/60 font-mono uppercase tracking-wide">
                Emergency Teams Coordinated
              </p>
              <motion.div
                className="text-3xl sm:text-4xl font-bold text-cyan-300 font-mono"
                key={Math.floor(counters.teams)}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
              >
                {counters.teams || 0}
              </motion.div>
              <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  animate={{ width: `${(counters.teams / Math.max(stats.emergencyTeamsCoordinated, 1)) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>

            {/* Sustainability Impact */}
            <motion.div
              className="rounded-lg border border-cyan-500/20 bg-gradient-to-br from-slate-900/60 to-slate-900/30 backdrop-blur-xl p-4 sm:p-6 space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              whileHover={{ borderColor: "rgba(34, 211, 238, 0.4)" }}
            >
              <p className="text-xs text-cyan-400/60 font-mono uppercase tracking-wide">
                Sustainability Impact
              </p>
              <motion.div
                className="text-3xl sm:text-4xl font-bold text-cyan-300 font-mono"
                key={Math.floor(counters.sustainability)}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
              >
                {counters.sustainability || 0}
                <span className="text-lg ml-1 opacity-60">K gal</span>
              </motion.div>
              <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-green-500"
                  animate={{ width: `${(counters.sustainability / Math.max(stats.sustainabilityImpact, 1)) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Overall System Status */}
        <motion.div
          className="rounded-lg border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl p-4 sm:p-6 space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <p className="text-xs text-green-400/60 font-mono uppercase tracking-widest">
            ▸ Overall System Status
          </p>
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.6 }}
          >
            <p className="text-lg sm:text-xl text-green-300 font-bold">
              ✓ ALL SYSTEMS OPERATIONAL
            </p>
            <p className="text-sm text-green-300/70">
              FIFA Smart Stadium AI successfully demonstrated real-time operational intelligence for FIFA World Cup 2026.
              All monitoring, response, and optimization systems are ready for live deployment.
            </p>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.6 }}
        >
          <motion.button
            onClick={onReset}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(34,211,238,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300 hover:border-cyan-500 transition-all text-sm sm:text-base"
          >
            <RotateCcw size={18} /> Run Demo Again
          </motion.button>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-700/70 transition-all text-sm sm:text-base"
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
          transition={{ delay: 3, duration: 1 }}
        >
          🏆 Mission Control System — FIFA World Cup 2026 Ready
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
