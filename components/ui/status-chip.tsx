import { cn } from "@/lib/utils/cn";

export type StatusTone = "success" | "warning" | "critical" | "neutral" | "info";

const DOT_COLOR: Record<StatusTone, string> = {
  success: "bg-state-success",
  warning: "bg-state-warning",
  critical: "bg-state-critical",
  info: "bg-accent-cyan",
  neutral: "bg-text-muted",
};

/** Status pill with a colored dot — never color-only (§9.9), label text always accompanies the dot. */
export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone: StatusTone;
  label: string;
  pulse?: boolean;
}

export function StatusChip({ tone, label, pulse = false, className, ...props }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-glass px-2.5 py-1 text-xs font-medium text-text-secondary",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          DOT_COLOR[tone],
          pulse && tone === "critical" && "animate-pulse-glow"
        )}
      />
      {label}
    </span>
  );
}
