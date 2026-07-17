"use client";

import { cn } from "@/lib/utils/cn";

/** §9.7 Chip — filter chips, tappable explainability/fact chips, suggested-prompt chips. */
export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  tappable?: boolean;
}

export function Chip({ selected = false, tappable = true, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      disabled={!tappable}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium font-mono transition-colors duration-150",
        selected
          ? "bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan"
          : "bg-glass border-border-subtle text-text-secondary hover:border-border-emphasis hover:text-text-primary",
        !tappable && "cursor-default",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
