"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";
import type { TabItem } from "@/components/shared/bottom-tab-bar";

export interface SideRailProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
}

/** §10.2 desktop/tablet nav equivalent to BottomTabBar — 88px fixed rail, active tab = gradient pill background. */
export function SideRail({ tabs, active, onChange }: SideRailProps) {
  return (
    <nav className="flex w-[88px] shrink-0 flex-col items-center gap-2 border-r border-border-subtle py-6">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex w-16 flex-col items-center gap-1 rounded-sm py-2.5 text-[11px]"
          >
            {isActive && (
              <motion.div
                layoutId="side-rail-active"
                className="absolute inset-0 rounded-sm bg-accent-cyan/10"
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
