"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Zap, AlertTriangle } from "lucide-react";

interface AICommanderMessage {
  id: string;
  text: string;
  severity: "info" | "warning" | "critical" | "success";
  duration?: number;
}

interface AICommanderNotificationProps {
  message: AICommanderMessage | null;
}

export default function AICommanderNotification({ message }: AICommanderNotificationProps) {
  const [displayMessage, setDisplayMessage] = useState<AICommanderMessage | null>(null);

  useEffect(() => {
    if (!message) {
      setDisplayMessage(null);
      return;
    }

    setDisplayMessage(message);
    const duration = message.duration || 3500;
    const timer = setTimeout(() => {
      setDisplayMessage(null);
    }, duration);

    return () => clearTimeout(timer);
  }, [message]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle size={16} className="text-red-400 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />;
      case "success":
        return <CheckCircle size={16} className="text-green-400 flex-shrink-0" />;
      default:
        return <Zap size={16} className="text-cyan-400 flex-shrink-0" />;
    }
  };

  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          bg: "from-red-900/40 to-red-900/20",
          border: "border-red-500/40",
          text: "text-red-300",
        };
      case "warning":
        return {
          bg: "from-yellow-900/40 to-yellow-900/20",
          border: "border-yellow-500/40",
          text: "text-yellow-300",
        };
      case "success":
        return {
          bg: "from-green-900/40 to-green-900/20",
          border: "border-green-500/40",
          text: "text-green-300",
        };
      default:
        return {
          bg: "from-cyan-900/40 to-cyan-900/20",
          border: "border-cyan-500/40",
          text: "text-cyan-300",
        };
    }
  };

  const colors = getSeverityColors(displayMessage?.severity || "info");

  return (
    <AnimatePresence>
      {displayMessage && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 max-w-xs z-40`}
        >
          <div
            className={`rounded-lg border ${colors.border} bg-gradient-to-br ${colors.bg} backdrop-blur-xl p-3 sm:p-4 shadow-xl flex gap-3 items-start`}
          >
            {/* Icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {getSeverityIcon(displayMessage.severity)}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`${colors.text} text-sm leading-snug font-medium line-clamp-3`}>
                {displayMessage.text}
              </p>
              <motion.div
                className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent mt-2"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* Progress Bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: displayMessage.duration || 3.5, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
