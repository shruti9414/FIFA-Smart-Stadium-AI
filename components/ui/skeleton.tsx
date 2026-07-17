import { cn } from "@/lib/utils/cn";

/** §9.6 shimmerSkeleton — fact-loading placeholder. Visually distinct from AIThinkingChip (fact vs. AI-generating). */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-sm", className)} />;
}

/** Preset: a card-shaped skeleton for GlassCard-sized content. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass rounded-md p-5 space-y-3", className)}>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

/** Preset: a single list-row skeleton (incident rows, amenity cards, etc). */
export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Skeleton className="h-9 w-9 rounded-xs shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-2.5 w-1/3" />
      </div>
    </div>
  );
}
