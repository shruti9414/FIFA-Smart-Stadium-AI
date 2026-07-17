const ZONE_ANGLE: Record<string, number> = { North: 0, East: 90, South: 180, West: 270 };

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Tiny radial "you are here" indicator — a miniature stadium ring highlighting which compass zone a venue sits in. */
export function MiniMapPreview({ zone, size = 40 }: { zone: string; size?: number }) {
  const angle = ZONE_ANGLE[zone] ?? 0;
  const cx = size / 2;
  const cy = size / 2;
  const dot = polar(cx, cy, size * 0.34, angle);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={cx} cy={cy} r={size * 0.42} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={size * 0.18} fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth={1} />
      <circle cx={dot.x} cy={dot.y} r={3} fill="#22D3EE" />
    </svg>
  );
}
