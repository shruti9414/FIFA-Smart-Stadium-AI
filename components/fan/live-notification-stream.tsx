"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, TriangleAlert, DoorOpen } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

interface LiveNotification {
  id: string;
  icon: typeof Sparkles;
  text: string;
  tone: "ai" | "warning" | "info";
}

/** Sliding live notification stack — real socket events, not decoration. Auto-dismisses each card after 6s. */
export function LiveNotificationStream() {
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const reduced = useReducedMotion();

  const push = (n: Omit<LiveNotification, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [{ ...n, id }, ...prev].slice(0, 3));
    setTimeout(() => setNotifications((prev) => prev.filter((x) => x.id !== id)), 6000);
  };

  useSocket("incident:new", (payload) => {
    push({ icon: TriangleAlert, text: `New ${payload.severity} incident near ${payload.locationDesc}`, tone: "warning" });
  });

  useSocket("gate:update", (payload) => {
    if (payload.status === "congested") {
      push({ icon: DoorOpen, text: `Gate getting busy — AI suggests checking Navigate for alternates`, tone: "ai" });
    }
  });

  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-40 flex w-[92%] max-w-sm -translate-x-1/2 flex-col gap-2 md:left-auto md:right-6 md:translate-x-0">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: reduced ? 0 : -24, scale: reduced ? 1 : 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: reduced ? 0 : 40 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "glass-elevated pointer-events-auto flex items-center gap-2.5 rounded-md px-3.5 py-2.5",
              n.tone === "warning" && "border-l-2 border-l-state-warning",
              n.tone === "ai" && "border-l-2 border-l-accent-cyan"
            )}
          >
            <n.icon size={15} className={n.tone === "warning" ? "text-state-warning" : "text-accent-cyan"} />
            <p className="text-xs text-text-primary">{n.text}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
