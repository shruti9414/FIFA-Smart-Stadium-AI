"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Portal } from "@/components/ui/portal";
import { IconButton } from "@/components/ui/icon-button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

/**
 * §9.7 Dialog — the single sanctioned full-modal pattern (e.g. the
 * demo-scenario-trigger confirmation). Avoid reaching for this outside
 * that use case; prefer Drawer/Sheet for anything content-heavy.
 */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const reduced = useReducedMotion();

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="glass-scrim absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              onClick={onClose}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
              transition={{ duration: reduced ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "glass-elevated relative z-10 w-full max-w-md rounded-lg p-6",
                className
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 id="modal-title" className="font-display text-lg font-semibold text-text-primary">
                  {title}
                </h2>
                <IconButton icon={X} label="Close" size="sm" onClick={onClose} />
              </div>
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
