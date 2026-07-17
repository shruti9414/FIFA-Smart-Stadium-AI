import { mulberry32 } from "@/lib/utils/prng";

/** Turns any string into a numeric seed for mulberry32 — stable per entity (e.g. a food stall id or match id). */
function hashSeed(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h << 5) - h + key.charCodeAt(i);
    h |= 0;
  }
  return h;
}

/**
 * Deterministic pseudo-random values for presentation-only stats we
 * don't have real sensors/schema for (venue ratings, walking times, shot
 * map coordinates, momentum curves). Same key always produces the same
 * output, so the UI doesn't flicker between renders/reloads — this is
 * simulated/illustrative data, not AI output and not a DB fact, and is
 * treated as such (never routed through lib/ai/*).
 */
export function seededRandom(key: string): () => number {
  return mulberry32(hashSeed(key));
}

export function seededRange(key: string, min: number, max: number): number {
  const rng = seededRandom(key);
  return min + rng() * (max - min);
}

export function seededPick<T>(key: string, items: T[]): T {
  const rng = seededRandom(key);
  return items[Math.floor(rng() * items.length)];
}
