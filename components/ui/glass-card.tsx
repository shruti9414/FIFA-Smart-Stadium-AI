import { cn } from "@/lib/utils/cn";

/** §9.4 — the exact glassmorphism recipe, reused everywhere. Elevation L1 (default) / L2 (elevated). */
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "L1" | "L2";
  padding?: "none" | "sm" | "md" | "lg";
  gradientBorder?: boolean;
  hover?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

const PADDING: Record<NonNullable<GlassCardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function GlassCard({
  elevation = "L1",
  padding = "md",
  gradientBorder = false,
  hover = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        elevation === "L1" ? "glass" : "glass-elevated",
        "rounded-md",
        PADDING[padding],
        gradientBorder && "gradient-border",
        hover && "glass-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
