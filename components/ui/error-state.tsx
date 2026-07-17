import { AlertTriangle, RotateCw } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

/** Full-block error — rare, reserved for total fetch failure (not AI-unavailable, which uses InlineErrorNotice/AlertBanner). */
export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "This section couldn't load. You can try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-state-critical/10">
        <Icon icon={AlertTriangle} size={28} className="text-state-critical" />
      </div>
      <h3 className="font-display text-lg font-semibold text-text-primary">{title}</h3>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          <Icon icon={RotateCw} size={14} />
          Try again
        </Button>
      )}
    </div>
  );
}

/** Scoped inline fallback — e.g. "AI unavailable, facts still shown". Never blocks the rest of the screen. */
export function InlineErrorNotice({ message, className }: { message: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-sm border border-state-warning/30 bg-state-warning/10 px-3 py-2 text-xs text-state-warning",
        className
      )}
    >
      <Icon icon={AlertTriangle} size={14} />
      {message}
    </div>
  );
}
