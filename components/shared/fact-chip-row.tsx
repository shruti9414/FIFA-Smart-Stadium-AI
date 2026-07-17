"use client";

import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils/cn";

/** Explainability strip — the specific source facts behind an AI output, tappable to cross-highlight elsewhere on screen. */
export interface FactChipRowProps {
  facts: string[];
  onFactClick?: (fact: string, index: number) => void;
  className?: string;
}

export function FactChipRow({ facts, onFactClick, className }: FactChipRowProps) {
  if (facts.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {facts.map((fact, i) => (
        <Chip key={`${fact}-${i}`} tappable={Boolean(onFactClick)} onClick={() => onFactClick?.(fact, i)}>
          {fact}
        </Chip>
      ))}
    </div>
  );
}
