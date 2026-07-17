import { seededRandom } from "@/lib/utils/seededStats";

/**
 * Stylized QR-like grid — visual only (not a real scannable code, no
 * decoding library needed for a demo ticket). Deterministic per `seed`
 * so the same ticket always renders the same pattern, with fixed
 * finder-squares in three corners for an authentic QR silhouette.
 */
export function QrPattern({ seed, size = 96 }: { seed: string; size?: number }) {
  const cells = 11;
  const rng = seededRandom(seed);
  const cellSize = size / cells;

  const isFinder = (x: number, y: number) =>
    (x < 3 && y < 3) || (x > cells - 4 && y < 3) || (x < 3 && y > cells - 4);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xs bg-white p-1">
      {Array.from({ length: cells }).map((_, y) =>
        Array.from({ length: cells }).map((_, x) => {
          if (isFinder(x, y)) return null;
          if (rng() > 0.55) return null;
          return <rect key={`${x}-${y}`} x={x * cellSize} y={y * cellSize} width={cellSize} height={cellSize} fill="#05070D" />;
        })
      )}
      {[[0, 0], [cells - 3, 0], [0, cells - 3]].map(([fx, fy]) => (
        <g key={`${fx}-${fy}`}>
          <rect x={fx * cellSize} y={fy * cellSize} width={cellSize * 3} height={cellSize * 3} fill="#05070D" />
          <rect x={(fx + 0.5) * cellSize} y={(fy + 0.5) * cellSize} width={cellSize * 2} height={cellSize * 2} fill="white" />
          <rect x={(fx + 1) * cellSize} y={(fy + 1) * cellSize} width={cellSize} height={cellSize} fill="#05070D" />
        </g>
      ))}
    </svg>
  );
}
