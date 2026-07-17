import { seededRange } from "@/lib/utils/seededStats";

export function PlayerCard({ name, team, minute }: { name: string; team: string; minute: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const jersey = Math.round(seededRange(`jersey-${name}`, 2, 23));

  return (
    <div className="glass flex shrink-0 flex-col items-center gap-1.5 rounded-md p-3" style={{ width: 96 }}>
      <div className="gradient-ai-core flex h-12 w-12 items-center justify-center rounded-full font-display text-sm font-bold text-void">
        {initials}
      </div>
      <span className="truncate text-center text-[11px] font-medium text-text-primary" title={name}>
        {name}
      </span>
      <div className="flex items-center gap-1.5 font-mono text-[9px] text-text-muted">
        <span>#{jersey}</span>
        <span>·</span>
        <span>{minute}&apos;</span>
      </div>
      <span className="truncate text-[9px] text-text-secondary">{team}</span>
    </div>
  );
}
