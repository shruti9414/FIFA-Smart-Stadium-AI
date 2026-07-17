import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * §9.7/§10.6 signature component — appears on every AI-originated output,
 * no exceptions. Placement and appearance never vary by screen.
 */
export interface AIBadgeProps {
  cached?: boolean;
  className?: string;
}

export function AIBadge({ cached = false, className }: AIBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xs border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-cyan",
        className
      )}
    >
      <Sparkles size={11} strokeWidth={2} />
      AI
      {cached && <span className="text-text-muted normal-case font-normal">· cached</span>}
    </span>
  );
}
