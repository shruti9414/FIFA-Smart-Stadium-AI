import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

/** §9.7 Badge — generic status/label pill (gate status, severity, "cached", etc). */
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide font-sans",
  {
    variants: {
      tone: {
        neutral: "bg-glass-elevated text-text-secondary border border-border-subtle",
        success: "bg-state-success/15 text-state-success border border-state-success/30",
        warning: "bg-state-warning/15 text-state-warning border border-state-warning/30",
        critical: "bg-state-critical/15 text-state-critical border border-state-critical/30",
        info: "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ tone, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {children}
    </span>
  );
}
