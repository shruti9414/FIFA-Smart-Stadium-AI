"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, X } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { toastEnter } from "@/lib/motion/variants";
import { cn } from "@/lib/utils/cn";

export interface ToastItem {
  id: string | number;
  message: string;
  tone?: "critical" | "info";
}

export function ToastStack({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: ToastItem["id"]) => void }) {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-2 sm:right-6 sm:top-6">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} reduced={reduced} onDismiss={() => onDismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, reduced, onDismiss }: { toast: ToastItem; reduced: boolean; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      layout
      variants={toastEnter(reduced)}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "glass-elevated pointer-events-auto flex w-80 items-start gap-2.5 rounded-md p-3.5",
        toast.tone === "critical" && "border-l-2 border-l-state-critical"
      )}
    >
      <TriangleAlert size={16} className={cn("mt-0.5 shrink-0", toast.tone === "critical" ? "text-state-critical" : "text-accent-cyan")} />
      <p className="flex-1 text-sm text-text-primary">{toast.message}</p>
      <button onClick={onDismiss} className="text-text-muted hover:text-text-primary">
        <X size={14} />
      </button>
    </motion.div>
  );
}
