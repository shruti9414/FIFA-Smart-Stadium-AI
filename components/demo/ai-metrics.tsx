import { motion } from "framer-motion";
import { Activity, AlertCircle, Clock, Users } from "lucide-react";

interface AIMetricsProps {
  metrics: {
    incidents: number;
    crowdDensity: number;
    responseTime: number;
    systemStatus: string;
  };
  isRunning: boolean;
}

export default function AIMetrics({ metrics, isRunning }: AIMetricsProps) {
  const getStatusColor = (status: string) => {
    if (status.includes("Critical")) return "text-red-400 bg-red-500/20 border-red-500/50";
    if (status.includes("Alert")) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
    if (status.includes("Resolving")) return "text-blue-400 bg-blue-500/20 border-blue-500/50";
    if (status.includes("2026")) return "text-green-400 bg-green-500/20 border-green-500/50";
    return "text-cyan-400 bg-cyan-500/20 border-cyan-500/50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full h-full flex flex-col gap-4"
    >
      {/* System Status */}
      <motion.div
        className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-4 space-y-3"
        whileHover={{ borderColor: "rgba(34, 211, 238, 0.5)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <p className="text-xs font-mono text-cyan-400/60">SYSTEM STATUS</p>
        </div>

        <motion.div
          className={`p-3 rounded-lg border ${getStatusColor(metrics.systemStatus)}`}
          animate={{
            boxShadow:
              metrics.systemStatus.includes("Critical") ||
              metrics.systemStatus.includes("Alert") ||
              metrics.systemStatus.includes("Running")
                ? [
                    "0 0 10px rgba(34, 211, 238, 0.2)",
                    "0 0 20px rgba(34, 211, 238, 0.4)",
                    "0 0 10px rgba(34, 211, 238, 0.2)",
                  ]
                : "0 0 0px rgba(34, 211, 238, 0)",
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="font-semibold text-sm">{metrics.systemStatus}</p>
        </motion.div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {/* Incidents */}
        <motion.div
          className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-4 space-y-2"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-red-400" />
            <p className="text-xs font-mono text-red-400/60">INCIDENTS</p>
          </div>

          <motion.div
            className="text-3xl font-black text-red-400"
            key={metrics.incidents}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.4 }}
          >
            {metrics.incidents}
          </motion.div>

          <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-red-400"
              animate={{ width: `${Math.min(metrics.incidents * 30, 100)}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </motion.div>

        {/* Crowd Density */}
        <motion.div
          className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-4 space-y-2"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-yellow-400" />
            <p className="text-xs font-mono text-yellow-400/60">CROWD DENSITY</p>
          </div>

          <motion.div
            className={`text-3xl font-black ${
              metrics.crowdDensity > 85
                ? "text-red-400"
                : metrics.crowdDensity > 70
                  ? "text-yellow-400"
                  : "text-green-400"
            }`}
            key={metrics.crowdDensity}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.4 }}
          >
            {metrics.crowdDensity}%
          </motion.div>

          <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${
                metrics.crowdDensity > 85
                  ? "from-red-500 to-red-400"
                  : metrics.crowdDensity > 70
                    ? "from-yellow-500 to-yellow-400"
                    : "from-green-500 to-green-400"
              }`}
              animate={{ width: `${metrics.crowdDensity}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </motion.div>

        {/* Response Time */}
        <motion.div
          className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-4 space-y-2"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-blue-400" />
            <p className="text-xs font-mono text-blue-400/60">RESPONSE TIME</p>
          </div>

          <motion.div
            className="text-3xl font-black text-blue-400"
            key={metrics.responseTime}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.4 }}
          >
            {metrics.responseTime}
            <span className="text-sm ml-1">s</span>
          </motion.div>

          <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
              animate={{ width: `${Math.min((metrics.responseTime / 300) * 100, 100)}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-4 space-y-2"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-cyan-400" />
            <p className="text-xs font-mono text-cyan-400/60">HEALTH</p>
          </div>

          <motion.div
            className="text-3xl font-black text-cyan-400"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            99%
          </motion.div>

          <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
              animate={{ width: "99%" }}
            />
          </div>
        </motion.div>
      </div>

      {/* AI Processing */}
      <motion.div
        className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl p-4 space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs font-mono text-cyan-400/60">AI PROCESSING</p>

        <div className="space-y-2">
          {isRunning && (
            <>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      animate={{ width: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
                <span className="text-xs text-cyan-400/60">Analysis</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      animate={{ width: ["30%", "100%", "30%"] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </div>
                </div>
                <span className="text-xs text-cyan-400/60">Decision</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-green-500"
                      animate={{ width: ["70%", "100%", "70%"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                </div>
                <span className="text-xs text-cyan-400/60">Execution</span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
