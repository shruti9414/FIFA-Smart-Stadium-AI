"use client";

import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface TickerItem {
  id: string | number;
  text: string;
}

/** Auto-scrolling marquee (§10.1 landing ticker, §10.3 denser ops variant) — pauses on hover, edge gradient-fade mask. */
export function Ticker({ items, className, dense = false }: { items: TickerItem[]; className?: string; dense?: boolean }) {
  const reduced = useReducedMotion();
  const doubled = [...items, ...items];

  return (
    <div
      className={cn(
        "relative flex h-10 items-center overflow-hidden border-y border-border-subtle bg-glass",
        dense && "h-8 border-none bg-transparent",
        className
      )}
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      {!dense && (
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent" />
      )}
      <div
        className={cn("flex shrink-0 items-center gap-8 whitespace-nowrap font-mono text-xs text-text-secondary", !reduced && "animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused]")}
      >
        {doubled.map((item, i) => (
          <span key={`${item.id}-${i}`} className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-accent-cyan" />
            {item.text}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
