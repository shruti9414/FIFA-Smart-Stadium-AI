import { motion } from "framer-motion";
import { CheckCircle, RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface FinalScreenProps {
  stats: {
    incidentsHandled: number;
    avgResponseTime: number;
    crowdSatisfaction: number;
    aiAccuracy: number;
  };
  onReset: () => void;
}

export default function FinalScreen({ stats, onReset }: FinalScreenProps) {
  const [counters, setCounters] = useState({
    incidents: 0,
    responseTime: 0,
    satisfaction: 0,
    accuracy: 0,
  });

  useEffect(() => {
    const intervals = [
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            incidents: Math.min(p.incidents + 1, stats.incidentsHandled),
          })),
        50
      ),
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            responseTime:
              p.responseTime < stats.avgResponseTime
                ? p.responseTime + Math.ceil(stats.avgResponseTime / 30)
                : stats.avgResponseTime,
          })),
        50
      ),
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            satisfaction:
              p.satisfaction < stats.crowdSatisfaction ? p.satisfaction + 1 : stats.crowdSatisfaction,
          })),
        30
      ),
      setInterval(
        () =>
          setCounters((p) => ({
            ...p,
            accuracy: p.accuracy < stats.aiAccuracy ? p.accuracy + 1 : stats.aiAccuracy,
          })),
        30
      ),
    ];

    return () => intervals.forEach(clearInterval);
  }, [stats]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1428] flex flex-col items-center justify-center p-6 overflow-hidden z-50"
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 80%, rgba(34,211,238,0.2) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-50"
          animate={{
            x: Math.sin(i) * 200,
            y: Math.cos(i) * 200,
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          style={{
            left: "50%",
            top: "50%",
          }}
        />
      ))}

      {/* Content */}
      <motion.div
        className="relative z-10 text-center space-y-12 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        {/* Success Icon */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)]"
            animate={{
              boxShadow: [
                "0 0 30px rgba(34,197,94,0.3)",
                "0 0 60px rgba(34,197,94,0.6)",
                "0 0 30px rgba(34,197,94,0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckCircle size={48} className="text-white" />
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
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-green-300 to-cyan-300 bg-clip-text text-transparent">
            Mission Complete
          </h1>
          <p className="text-xl text-green-300/80">FIFA Smart Stadium AI — Ready for World Cup 2026</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, staggerChildren: 0.1 }}
        >
          {[
            {
              label: "Incidents Handled",
              value: counters.incidents,
              icon: "🚨",
              color: "from-red-600 to-red-500",
            },
            {
              label: "Avg Response Time",
              value: `${counters.responseTime}s`,
              icon: "⚡",
              color: "from-blue-600 to-blue-500",
            },
            {
              label: "Crowd Satisfaction",
              value: `${counters.satisfaction}%`,
              icon: "😊",
              color: "from-yellow-600 to-yellow-500",
            },
            {
              label: "AI Accuracy",
              value: `${counters.accuracy}%`,
              icon: "🎯",
              color: "from-cyan-600 to-cyan-500",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className={`p-6 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 1.3 + i * 0.1,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
              <div className="text-xs text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* System Status */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Medical Response", status: "✓" },
              { label: "Crowd Management", status: "✓" },
              { label: "Transportation", status: "✓" },
            ].map((system, i) => (
              <motion.div
                key={i}
                className="px-4 py-3 rounded-lg bg-green-500/20 border border-green-500/50 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-lg font-bold text-green-400">{system.status}</div>
                <div className="text-xs text-green-300/70 mt-1">{system.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Real-time Monitoring", status: "✓" },
              { label: "AI Decision Support", status: "✓" },
              { label: "Sustainability", status: "✓" },
            ].map((system, i) => (
              <motion.div
                key={i}
                className="px-4 py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-lg font-bold text-cyan-400">{system.status}</div>
                <div className="text-xs text-cyan-300/70 mt-1">{system.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Conclusion Message */}
        <motion.div
          className="space-y-4 px-6 py-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
        >
          <p className="text-lg text-slate-200 font-light">
            FIFA Smart Stadium AI is fully operational and ready to manage real-time operations during FIFA World Cup 2026.
            All systems nominal. AI accuracy at peak performance.
          </p>
          <p className="text-sm text-cyan-300/70">
            The system continuously monitors 47 data points, responds to incidents in under 2.5 minutes, and optimizes
            operations across 8 key areas.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col gap-3 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.8 }}
        >
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34,211,238,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
          >
            <RotateCcw size={18} /> Run Demo Again
          </motion.button>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-slate-700/50 border border-slate-600 text-slate-200 hover:bg-slate-700/70"
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
          🏆 Demonstration Complete — Thank you for experiencing FIFA Smart Stadium AI
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
