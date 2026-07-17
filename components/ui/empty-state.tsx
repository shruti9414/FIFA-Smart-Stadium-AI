import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

/** §9.7 EmptyState — icon + headline + subtext + optional CTA. Used consistently across the product (no active incidents, no recommendations yet, etc). */
export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-glass">
        <Icon icon={icon} size={32} className="text-text-secondary" />
      </div>
      <h3 className="font-display text-lg font-semibold text-text-primary">{title}</h3>
      {description && <p className="max-w-sm text-sm text-text-secondary">{description}</p>}
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}
