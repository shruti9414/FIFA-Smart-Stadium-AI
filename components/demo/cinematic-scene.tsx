import { motion } from "framer-motion";
import {
  AlertTriangle,
  Activity,
  ParkingCircle,
  Trophy,
  Leaf,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  narrative: string;
  completed: boolean;
  sceneType: string;
}

interface CinematicSceneProps {
  step: Step | null;
  isRunning: boolean;
  allSteps: Step[];
  currentStepIndex: number | null;
}

export default function CinematicScene({
  step,
  isRunning,
  allSteps,
  currentStepIndex,
}: CinematicSceneProps) {
  const getSceneIcon = (sceneType: string) => {
    switch (sceneType) {
      case "crowd":
        return <AlertTriangle className="w-8 h-8" />;
      case "incident":
        return <Activity className="w-8 h-8" />;
      case "ai":
        return <Clock className="w-8 h-8" />;
      case "parking":
        return <ParkingCircle className="w-8 h-8" />;
      case "match":
        return <Trophy className="w-8 h-8" />;
      case "resolution":
        return <CheckCircle className="w-8 h-8" />;
      case "sustainability":
        return <Leaf className="w-8 h-8" />;
      default:
        return <Users className="w-8 h-8" />;
    }
  };

  const getSceneColor = (sceneType: string) => {
    switch (sceneType) {
      case "crowd":
        return "from-yellow-600 to-orange-600";
      case "incident":
        return "from-red-600 to-red-500";
      case "ai":
        return "from-blue-600 to-blue-500";
      case "parking":
        return "from-purple-600 to-purple-500";
      case "match":
        return "from-green-600 to-emerald-500";
      case "resolution":
        return "from-green-600 to-green-500";
      case "sustainability":
        return "from-teal-600 to-cyan-500";
      default:
        return "from-cyan-600 to-blue-500";
    }
  };

  const getBackgroundPattern = (sceneType: string) => {
    const patterns: Record<string, string> = {
      crowd: "radial-gradient(circle at 30% 50%, rgba(251, 146, 60, 0.1) 0%, transparent 60%)",
      incident: "radial-gradient(circle at 70% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 60%)",
      ai: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)",
      parking:
        "radial-gradient(circle at 20% 30%, rgba(147, 51, 234, 0.1) 0%, transparent 60%)",
      match: "radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 60%)",
      resolution:
        "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 60%)",
      sustainability:
        "radial-gradient(circle at 40% 40%, rgba(20, 184, 166, 0.1) 0%, transparent 60%)",
    };
    return patterns[sceneType] || patterns["ai"];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl overflow-hidden flex flex-col relative"
    >
      {/* Background Pattern */}
      {step && (
        <motion.div
          className="absolute inset-0"
          animate={{ background: getBackgroundPattern(step.sceneType) }}
          transition={{ duration: 0.8 }}
        />
      )}

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-6 h-full">
        {step ? (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 flex-1"
          >
            {/* Header */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getSceneColor(
                  step.sceneType
                )} flex items-center justify-center text-white shadow-lg`}
              >
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  {getSceneIcon(step.sceneType)}
                </motion.div>
              </div>

              <div>
                <motion.h2 className="text-2xl font-bold text-white mb-1">{step.title}</motion.h2>
                <p className="text-sm text-cyan-300/70">{step.description}</p>
              </div>
            </motion.div>

            {/* Narrative - Typing Effect */}
            <motion.div
              className="flex-1 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs font-mono text-cyan-400/60 uppercase tracking-widest">AI NARRATIVE</p>

              <motion.div className="h-24 relative">
                <motion.p
                  className="text-base leading-relaxed text-slate-200 font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  {step.narrative}
                </motion.p>

                {/* Typing cursor effect */}
                {isRunning && (
                  <motion.span
                    className="absolute bottom-0 right-0 w-1 h-6 bg-cyan-400"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-cyan-400/60">SCENARIO PROGRESS</p>
                <p className="text-xs text-cyan-400/60">
                  {currentStepIndex !== null ? currentStepIndex + 1 : 0} / {allSteps.length}
                </p>
              </div>
              <div className="w-full h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width:
                      currentStepIndex !== null ? `${((currentStepIndex + 1) / allSteps.length) * 100}%` : "0%",
                  }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Idle State
          <motion.div
            className="flex flex-col items-center justify-center h-full gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1], rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Users size={32} className="text-white" />
            </motion.div>
            <p className="text-center">
              <span className="text-lg font-bold text-cyan-300">Ready for Demonstration</span>
              <br />
              <span className="text-sm text-slate-400">Click Start to begin scenario</span>
            </p>
          </motion.div>
        )}
      </div>

      {/* Animated Border Glow */}
      <motion.div
        className="absolute -inset-px rounded-xl pointer-events-none"
        animate={{
          boxShadow: step
            ? [
                `0 0 20px rgba(${
                  step.sceneType === "incident"
                    ? "239, 68, 68"
                    : step.sceneType === "crowd"
                      ? "251, 146, 60"
                      : "34, 211, 238"
                }, 0.2)`,
                `0 0 40px rgba(${
                  step.sceneType === "incident"
                    ? "239, 68, 68"
                    : step.sceneType === "crowd"
                      ? "251, 146, 60"
                      : "34, 211, 238"
                }, 0.4)`,
                `0 0 20px rgba(${
                  step.sceneType === "incident"
                    ? "239, 68, 68"
                    : step.sceneType === "crowd"
                      ? "251, 146, 60"
                      : "34, 211, 238"
                }, 0.2)`,
              ]
            : "0 0 0px rgba(34, 211, 238, 0)",
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
