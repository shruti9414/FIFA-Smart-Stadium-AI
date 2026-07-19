import { describe, it, expect } from "vitest";
import { mulberry32, randomWalkStep } from "@/lib/utils/prng";

describe("mulberry32", () => {
  it("returns a function", () => {
    expect(typeof mulberry32(42)).toBe("function");
  });

  it("produces values in [0, 1)", () => {
    const rng = mulberry32(123);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("is deterministic — same seed produces same sequence", () => {
    const rng1 = mulberry32(999);
    const rng2 = mulberry32(999);
    for (let i = 0; i < 20; i++) {
      expect(rng1()).toBe(rng2());
    }
  });

  it("different seeds produce different sequences", () => {
    const rng1 = mulberry32(1);
    const rng2 = mulberry32(2);
    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());
    expect(seq1).not.toEqual(seq2);
  });

  it("seed 0 still works", () => {
    const rng = mulberry32(0);
    const v = rng();
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(1);
  });
});

describe("randomWalkStep", () => {
  const rng = mulberry32(42);

  it("clamps to min", () => {
    const deterministicRng = () => 0;
    const result = randomWalkStep(0, deterministicRng, { min: 0, max: 100, maxDelta: 10 });
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it("clamps to max", () => {
    const deterministicRng = () => 1;
    const result = randomWalkStep(100, deterministicRng, { min: 0, max: 100, maxDelta: 10 });
    expect(result).toBeLessThanOrEqual(100);
  });

  it("stays within bounds across many steps", () => {
    let current = 50;
    for (let i = 0; i < 1000; i++) {
      current = randomWalkStep(current, rng);
      expect(current).toBeGreaterThanOrEqual(0);
      expect(current).toBeLessThanOrEqual(100);
    }
  });

  it("uses defaults when no options provided", () => {
    const r = randomWalkStep(50, () => 0.5);
    expect(r).toBe(50);
  });

  it("respects maxDelta", () => {
    const result = randomWalkStep(50, () => 1, { maxDelta: 4 });
    expect(result).toBe(54);
  });
});
