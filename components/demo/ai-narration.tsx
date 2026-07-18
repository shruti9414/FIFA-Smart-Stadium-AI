"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface AIVoiceMessage {
  id: string;
  text: string;
  severity: "info" | "warning" | "critical" | "success";
  timestamp: number;
}

interface AINarrationProps {
  message: AIVoiceMessage | null;
  isRunning: boolean;
}

export default function AINarration({ message, isRunning }: AINarrationProps) {
  const [isMuted, setIsMuted] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "from-red-600 to-red-500 border-red-500/50";
      case "warning":
        return "from-yellow-600 to-yellow-500 border-yellow-500/50";
      case "success":
        return "from-green-600 to-green-500 border-green-500/50";
      default:
        return "from-cyan-600 to-cyan-500 border-cyan-500/50";
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-md z-40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className={`rounded-lg border bg-gradient-to-br ${getSeverityColor(
              message.severity
            )} backdrop-blur-xl p-4 shadow-2xl`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-1">
                <motion.div
                  className="w-3 h-3 rounded-full bg-white"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  AI Assistant
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                {isMuted ? (
                  <VolumeX size={16} className="text-white/60" />
                ) : (
                  <Volume2 size={16} className="text-white" />
                )}
              </motion.button>
            </div>

            {/* Message */}
            <motion.p
              className="text-sm text-white leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {message.text}
            </motion.p>

            {/* Animated Underline */}
            <motion.div
              className="h-0.5 bg-gradient-to-r from-white/0 via-white/60 to-white/0 mt-3"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Running Indicator */}
      {isRunning && !message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-xs text-cyan-400/60 flex items-center gap-2 font-mono"
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-cyan-400"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          AI monitoring systems...
        </motion.div>
      )}
    </motion.div>
  );
}
