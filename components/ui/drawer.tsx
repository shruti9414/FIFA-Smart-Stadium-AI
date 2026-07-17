"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Portal } from "@/components/ui/portal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { slideInPanel } from "@/lib/motion/variants";
import { cn } from "@/lib/utils/cn";

/**
 * §10.5 SidePanel — desktop overlay (Assistant panel, zone detail panel).
 * Scrim keeps the underlying screen visible/dim rather than fully hidden
 * ("assistant sees what you see").
 */
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: "right" | "left";
  width?: number;
  className?: string;
}

export function Drawer({ open, onClose, children, side = "right", width = 400, className }: DrawerProps) {
  const reduced = useReducedMotion();
  const variants = slideInPanel(side === "right" ? "right" : "bottom", reduced);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex justify-end" style={side === "left" ? { justifyContent: "flex-start" } : undefined}>
            <motion.div
              className="glass-scrim absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              onClick={onClose}
            />
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ width }}
              className={cn(
                "glass-elevated relative z-10 my-4 mr-4 flex h-[calc(100%-2rem)] flex-col rounded-lg",
                side === "left" && "ml-4 mr-0",
                className
              )}
            >
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
