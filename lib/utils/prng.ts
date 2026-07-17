/**
 * Seeded PRNG (mulberry32) — the simulation engine (later phase) uses this
 * so demo behavior is reproducible run-to-run instead of relying on
 * Math.random(), which can't be seeded and would make rehearsing a live
 * demo unreliable.
 */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bounded random walk step — used to nudge density/queue/occupancy values realistically. */
export function randomWalkStep(
  current: number,
  rng: () => number,
  { min = 0, max = 100, maxDelta = 4 }: { min?: number; max?: number; maxDelta?: number } = {}
): number {
  const delta = (rng() - 0.5) * 2 * maxDelta;
  return Math.min(max, Math.max(min, current + delta));
}
