import type { ReactNode } from "react";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface TopBarProps {
  title: string;
  right?: ReactNode;
  left?: ReactNode;
  className?: string;
}

/** §10.3/§10.4 Ops TopBar — 56px, brand + screen title left, nav/actions right. */
export function TopBar({ title, right, left, className }: TopBarProps) {
  return (
    <header className={cn("flex h-14 shrink-0 items-center justify-between border-b border-border-subtle px-4 sm:px-6", className)}>
      <div className="flex items-center gap-3">
        {left}
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-accent-cyan" strokeWidth={1.75} />
          <span className="font-display text-sm font-semibold uppercase tracking-wide text-text-primary">{title}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}
