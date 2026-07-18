import { motion } from "framer-motion";
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

interface StadiumVisualizationProps {
  crowdDensity: number;
  incident: boolean;
  isRunning: boolean;
}

const StadiumVisualization = forwardRef<any, StadiumVisualizationProps>(
  ({ crowdDensity, incident, isRunning }, ref) => {
    const [gateStates, setGateStates] = useState<Record<number, { density: number; status: string }>>({});
    const [emergencyActive, setEmergencyActive] = useState(false);

    useImperativeHandle(ref, () => ({
      updateGate: (gateId: number, density: number) => {
        setGateStates((prev) => ({
          ...prev,
          [gateId]: {
            density,
            status: density > 85 ? "critical" : density > 70 ? "warning" : "normal",
          },
        }));
      },
    }));

    useEffect(() => {
      setEmergencyActive(incident);
    }, [incident]);

    const getGateColor = (density: number) => {
      if (density > 85) return "from-red-600 to-red-500";
      if (density > 70) return "from-yellow-600 to-yellow-500";
      return "from-green-600 to-green-500";
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-full rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-xl overflow-hidden relative group flex flex-col p-4"
      >
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Animated Background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: isRunning
              ? [
                  "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.08) 0%, transparent 70%)",
                  "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.12) 0%, transparent 70%)",
                  "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.08) 0%, transparent 70%)",
                ]
              : "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.04) 0%, transparent 70%)",
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Stadium Content - Flex layout to prevent clipping */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-0 w-full">
          {/* Stadium SVG Visualization */}
          <svg
            className="w-full h-full max-h-96 sm:max-h-[28rem]"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Stadium Outer Ring */}
            <motion.ellipse
              cx="400"
              cy="300"
              rx="280"
              ry="200"
              fill="none"
              stroke="rgba(34,211,238,0.2)"
              strokeWidth="2"
              animate={{
                stroke: emergencyActive ? "rgba(239,68,68,0.4)" : "rgba(34,211,238,0.2)",
              }}
            />

            {/* Gates - Distributed around stadium */}
            {[
              { id: 1, x: 400, y: 100, label: "Gate 1" },
              { id: 2, x: 620, y: 220, label: "Gate 2" },
              { id: 3, x: 650, y: 380, label: "Gate 3" },
              { id: 4, x: 400, y: 500, label: "Gate 4" },
              { id: 5, x: 150, y: 380, label: "Gate 5" },
              { id: 6, x: 150, y: 220, label: "Gate 6" },
            ].map((gate) => {
              const gateState = gateStates[gate.id] || {
                density: Math.floor(Math.random() * 70),
                status: "normal",
              };
              const isHighDensity = gateState.density > 70;

              return (
                <g key={gate.id}>
                  {/* Gate Circle */}
                  <motion.circle
                    cx={gate.x}
                    cy={gate.y}
                    r="20"
                    fill={`url(#gateGradient${gate.id})`}
                    animate={{
                      r: isHighDensity ? [20, 28, 20] : 20,
                      filter: isHighDensity
                        ? [
                            "drop-shadow(0 0 4px rgba(34,211,238,0.3))",
                            "drop-shadow(0 0 12px rgba(34,211,238,0.6))",
                            "drop-shadow(0 0 4px rgba(34,211,238,0.3))",
                          ]
                        : "drop-shadow(0 0 2px rgba(34,211,238,0.2))",
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient
                      id={`gateGradient${gate.id}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor={getGateColor(gateState.density).split(" ")[1]}
                        stopOpacity="1"
                      />
                      <stop
                        offset="100%"
                        stopColor={getGateColor(gateState.density).split(" ")[3]}
                        stopOpacity="0.7"
                      />
                    </linearGradient>
                  </defs>

                  {/* Density Ring */}
                  <motion.circle
                    cx={gate.x}
                    cy={gate.y}
                    r={40 * (gateState.density / 100)}
                    fill="none"
                    stroke="rgba(34,211,238,0.3)"
                    strokeWidth="1"
                    animate={{
                      strokeOpacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Gate Label */}
                  <text
                    x={gate.x}
                    y={gate.y + 50}
                    textAnchor="middle"
                    fontSize="12"
                    fill="rgba(34,211,238,0.7)"
                    fontWeight="bold"
                  >
                    {gate.label}
                  </text>
                  <text
                    x={gate.x}
                    y={gate.y + 65}
                    textAnchor="middle"
                    fontSize="10"
                    fill="rgba(34,211,238,0.5)"
                  >
                    {gateState.density}%
                  </text>
                </g>
              );
            })}

            {/* Central Stadium Area */}
            <motion.circle
              cx="400"
              cy="300"
              r="100"
              fill="rgba(34,211,238,0.05)"
              stroke="rgba(34,211,238,0.15)"
              strokeWidth="2"
              animate={{
                fill: emergencyActive ? "rgba(239,68,68,0.1)" : "rgba(34,211,238,0.05)",
                stroke: emergencyActive ? "rgba(239,68,68,0.3)" : "rgba(34,211,238,0.15)",
              }}
            />

            {/* Crowd Density Indicator */}
            <motion.circle
              cx="400"
              cy="300"
              r={80 * (crowdDensity / 100)}
              fill="rgba(34,211,238,0.2)"
              animate={{
                fill: crowdDensity > 80 ? "rgba(239,68,68,0.3)" : "rgba(34,211,238,0.2)",
              }}
            />
          </svg>
        </div>

        {/* Information Section - Below SVG with safe spacing */}
        <motion.div
          className="relative z-10 flex flex-col justify-between gap-3 mt-4 pt-3 border-t border-cyan-500/20 min-h-fit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Label and Density */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-mono text-cyan-400/60">OVERALL DENSITY</p>
              <motion.p
                className={`text-2xl sm:text-3xl font-bold font-mono mt-1 ${
                  crowdDensity > 80
                    ? "text-red-400"
                    : crowdDensity > 70
                      ? "text-yellow-400"
                      : "text-green-400"
                }`}
                animate={{
                  color:
                    crowdDensity > 80
                      ? "rgb(248, 113, 113)"
                      : crowdDensity > 70
                        ? "rgb(250, 204, 21)"
                        : "rgb(74, 222, 128)",
                }}
              >
                {crowdDensity}%
              </motion.p>
            </div>

            {/* Emergency Badge */}
            {emergencyActive && (
              <motion.div
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/50"
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(239,68,68,0.3)",
                    "0 0 20px rgba(239,68,68,0.6)",
                    "0 0 10px rgba(239,68,68,0.3)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <AlertCircle size={14} className="text-red-400 animate-pulse" />
                <span className="text-xs font-bold text-red-300">EMERGENCY</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Scanning Effect */}
        {isRunning && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "linear-gradient(to bottom, rgba(34,211,238,0.2) 0%, transparent 50%)",
                "linear-gradient(to bottom, transparent 0%, rgba(34,211,238,0.2) 100%)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
      </motion.div>
    );
  }
);

StadiumVisualization.displayName = "StadiumVisualization";

export default StadiumVisualization;
