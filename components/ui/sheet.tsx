"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Portal } from "@/components/ui/portal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { slideInPanel } from "@/lib/motion/variants";
import { cn } from "@/lib/utils/cn";

/** §10.2/§10.5 BottomSheet — mobile overlay with a swipe-down-to-dismiss drag handle (§9.8). */
export interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeight?: string;
  className?: string;
}

export function Sheet({ open, onClose, children, maxHeight = "85vh", className }: SheetProps) {
  const reduced = useReducedMotion();
  const variants = slideInPanel("bottom", reduced);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 80 || info.velocity.y > 500) onClose();
  };

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end">
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
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={handleDragEnd}
              style={{ maxHeight }}
              className={cn(
                "glass-elevated relative z-10 flex w-full flex-col rounded-t-lg pb-[env(safe-area-inset-bottom)]",
                className
              )}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-8 rounded-full bg-border-emphasis" />
              </div>
              <div className="flex-1 overflow-y-auto">{children}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
