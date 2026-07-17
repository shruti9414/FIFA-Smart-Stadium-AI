import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function LoadingSpinner({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <Loader2
      size={size}
      strokeWidth={2}
      className={cn("animate-spin text-accent-cyan", className)}
      aria-label="Loading"
    />
  );
}
