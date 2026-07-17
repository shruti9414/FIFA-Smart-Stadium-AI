"use client";

import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";

export interface FloatingActionButtonProps extends HTMLMotionProps<"button"> {
  icon: LucideIcon;
  label: string;
  tone?: "danger" | "ai";
  badge?: boolean;
}

/** §9.7 FAB — Emergency (rose + pulseGlow) / Assistant (gradient + idle pulse + insight dot). */
export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ icon, label, tone = "ai", badge = false, className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        aria-label={label}
        whileTap={{ scale: 0.94 }}
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan focus-visible:outline-offset-2",
          tone === "danger" ? "bg-state-critical text-white animate-pulse-glow" : "gradient-ai-core text-void",
          className
        )}
        {...props}
      >
        <Icon icon={icon} size={24} strokeWidth={1.75} />
        {badge && <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-state-critical ring-2 ring-void" />}
      </motion.button>
    );
  }
);
FloatingActionButton.displayName = "FloatingActionButton";
