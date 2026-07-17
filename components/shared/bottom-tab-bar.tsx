"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface BottomTabBarProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
}

/** §10.2 mobile nav — fixed, safe-area aware, sliding active-pill indicator. */
export function BottomTabBar({ tabs, active, onChange }: BottomTabBarProps) {
  return (
    <nav className="glass-elevated fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex flex-1 flex-col items-center justify-center gap-1 text-xs"
          >
            {isActive && (
              <motion.div
                layoutId="bottom-tab-active"
                className="absolute inset-x-3 top-1.5 h-8 rounded-sm bg-accent-cyan/10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon icon={tab.icon} size={20} className={cn("relative z-10", isActive ? "text-accent-cyan" : "text-text-secondary")} />
            <span className={cn("relative z-10 font-medium", isActive ? "text-accent-cyan" : "text-text-secondary")}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
