import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * "Gemini is analyzing..." — shown wherever an AI call is in flight.
 * Deliberately distinct from Skeleton (fact-loading) so users can tell
 * which part of the screen is fact-loading vs AI-reasoning (§10.6).
 */
export function AIThinkingChip({ label = "Gemini is analyzing...", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 text-xs font-medium text-accent-cyan",
        className
      )}
    >
      <Sparkles size={12} className="animate-pulse-glow" strokeWidth={2} />
      {label}
    </span>
  );
}
