import { cn } from "@/lib/utils/cn";

/** 1px gradient-fade rule (§9.7) — used to separate glass card sections without a hard line. */
export function Divider({ className, orientation = "horizontal" }: { className?: string; orientation?: "horizontal" | "vertical" }) {
  if (orientation === "vertical") {
    return (
      <div
        className={cn(
          "w-px self-stretch bg-gradient-to-b from-transparent via-border-emphasis to-transparent",
          className
        )}
      />
    );
  }
  return (
    <div
      className={cn(
        "h-px w-full bg-gradient-to-r from-transparent via-border-emphasis to-transparent",
        className
      )}
    />
  );
}
