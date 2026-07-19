import { describe, it, expect } from "vitest";
import { seededRandom, seededRange, seededPick } from "@/lib/utils/seededStats";

describe("seededRandom", () => {
  it("returns a function", () => {
    expect(typeof seededRandom("test-key")).toBe("function");
  });

  it("is deterministic — same key, same sequence", () => {
    const rng1 = seededRandom("match-42");
    const rng2 = seededRandom("match-42");
    for (let i = 0; i < 20; i++) {
      expect(rng1()).toBe(rng2());
    }
  });

  it("different keys produce different sequences", () => {
    const r1 = seededRandom("key-a")();
    const r2 = seededRandom("key-b")();
    expect(r1).not.toBe(r2);
  });

  it("produces values in [0, 1)", () => {
    const rng = seededRandom("stability-check");
    for (let i = 0; i < 50; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("empty string key works without throwing", () => {
    expect(() => seededRandom("")()).not.toThrow();
  });
});

describe("seededRange", () => {
  it("returns a number within [min, max]", () => {
    for (let i = 0; i < 20; i++) {
      const result = seededRange(`key-${i}`, 10, 50);
      expect(result).toBeGreaterThanOrEqual(10);
      expect(result).toBeLessThan(50);
    }
  });

  it("is deterministic", () => {
    expect(seededRange("venue-rating", 1, 5)).toBe(seededRange("venue-rating", 1, 5));
  });

  it("handles reversed range gracefully", () => {
    const result = seededRange("test", 50, 10);
    expect(typeof result).toBe("number");
  });
});

describe("seededPick", () => {
  const fruits = ["apple", "banana", "cherry", "date"];

  it("picks an item from the array", () => {
    const result = seededPick("fruit-key", fruits);
    expect(fruits).toContain(result);
  });

  it("is deterministic", () => {
    expect(seededPick("stable-key", fruits)).toBe(seededPick("stable-key", fruits));
  });

  it("different keys pick different items (most of the time)", () => {
    const picks = Array.from({ length: 10 }, (_, i) => seededPick(`key-${i}`, fruits));
    const unique = new Set(picks);
    expect(unique.size).toBeGreaterThan(1);
  });

  it("works with a single-item array", () => {
    expect(seededPick("any", ["only"])).toBe("only");
  });
});
