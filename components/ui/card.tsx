import { cn } from "@/lib/utils/cn";

/** Solid (non-glass) surface container — used for content nested inside a GlassCard, where stacking blur looks muddy. */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

const PADDING: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({ padding = "md", className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border-subtle rounded-md",
        PADDING[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
