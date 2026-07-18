import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Activity, Zap } from "lucide-react";

interface Incident {
  id: number;
  type: string;
  location: string;
}

interface IncidentBroadcasterProps {
  incidents: Incident[];
  isRunning: boolean;
}

export default function IncidentBroadcaster({ incidents, isRunning }: IncidentBroadcasterProps) {
  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "MEDICAL":
        return <Activity size={16} className="text-red-400" />;
      case "SECURITY":
        return <AlertCircle size={16} className="text-yellow-400" />;
      case "CROWD":
        return <Zap size={16} className="text-orange-400" />;
      default:
        return <AlertCircle size={16} className="text-cyan-400" />;
    }
  };

  const getIncidentColor = (type: string) => {
    switch (type) {
      case "MEDICAL":
        return "border-red-500/50 bg-red-500/10";
      case "SECURITY":
        return "border-yellow-500/50 bg-yellow-500/10";
      case "CROWD":
        return "border-orange-500/50 bg-orange-500/10";
      default:
        return "border-cyan-500/50 bg-cyan-500/10";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full h-full rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-cyan-500/20 flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full bg-red-400"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <p className="text-xs font-mono text-cyan-400/60 uppercase tracking-widest">INCIDENT FEED (LIVE)</p>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

        {incidents.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {incidents.map((incident, idx) => (
              <motion.div
                key={incident.id}
                layout
                initial={{ opacity: 0, y: -20, x: 100 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 20, x: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileHover={{ scale: 1.02, paddingRight: 8 }}
                className={`relative p-3 rounded-lg border ${getIncidentColor(incident.type)} transition-all`}
              >
                {/* Animated Border Glow */}
                <motion.div
                  className="absolute -inset-px rounded-lg pointer-events-none"
                  animate={{
                    boxShadow: [
                      `0 0 8px rgba(${
                        incident.type === "MEDICAL" ? "239, 68, 68" : "34, 211, 238"
                      }, 0.2)`,
                      `0 0 16px rgba(${
                        incident.type === "MEDICAL" ? "239, 68, 68" : "34, 211, 238"
                      }, 0.4)`,
                      `0 0 8px rgba(${
                        incident.type === "MEDICAL" ? "239, 68, 68" : "34, 211, 238"
                      }, 0.2)`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Content */}
                <div className="relative z-10 flex items-start gap-3">
                  {/* Icon */}
                  <motion.div
                    className="mt-0.5 flex-shrink-0"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: idx * 0.1, duration: 1.5, repeat: Infinity }}
                  >
                    {getIncidentIcon(incident.type)}
                  </motion.div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-xs">{incident.type}</p>
                      <motion.span
                        className="text-xs opacity-60"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        LIVE
                      </motion.span>
                    </div>
                    <p className="text-xs text-slate-300 truncate">{incident.location}</p>
                  </div>

                  {/* Timestamp */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-400">Now</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center h-full gap-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <AlertCircle size={24} className="text-cyan-400" />
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-cyan-300">No Incidents</p>
              <p className="text-xs text-slate-400">System operating normally</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Stats Footer */}
      <motion.div
        className="px-4 py-3 border-t border-cyan-500/20 bg-slate-900/50 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs text-cyan-400/60">Total Incidents</p>
          <motion.p
            className="text-sm font-bold text-cyan-300"
            key={incidents.length}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.4 }}
          >
            {incidents.length}
          </motion.p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-cyan-400/60">Status</p>
          <div className="flex items-center gap-1">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <p className="text-xs text-green-400 font-semibold">Active Monitoring</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
