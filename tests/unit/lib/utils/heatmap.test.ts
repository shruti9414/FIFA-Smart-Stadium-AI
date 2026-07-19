import { describe, it, expect } from "vitest";
import {
  densityToColor,
  densityToTrafficColor,
  densityToRiskLevel,
} from "@/lib/utils/heatmap";

describe("densityToColor", () => {
  it("returns blue-ish for 0%", () => {
    const result = densityToColor(0);
    expect(result).toMatch(/^rgb\(/);
    expect(result).toBe("rgb(14, 165, 233)");
  });

  it("returns blue for 40% (boundary)", () => {
    expect(densityToColor(40)).toBe("rgb(14, 165, 233)");
  });

  it("returns amber for 70%", () => {
    expect(densityToColor(70)).toBe("rgb(251, 191, 36)");
  });

  it("returns rose for 100%", () => {
    expect(densityToColor(100)).toBe("rgb(244, 63, 94)");
  });

  it("clamps values below 0", () => {
    expect(densityToColor(-10)).toBe(densityToColor(0));
  });

  it("clamps values above 100", () => {
    expect(densityToColor(150)).toBe(densityToColor(100));
  });

  it("interpolates between 40-70 range", () => {
    const result = densityToColor(55);
    expect(result).toMatch(/^rgb\(/);
    // Should be between blue and amber — r is between 14 and 251
    const [r] = result.match(/\d+/g)!.map(Number);
    expect(r).toBeGreaterThan(14);
    expect(r).toBeLessThan(251);
  });
});

describe("densityToTrafficColor", () => {
  it("returns green for 0%", () => {
    expect(densityToTrafficColor(0)).toBe("rgb(16, 185, 129)");
  });

  it("returns green for 45% (boundary)", () => {
    expect(densityToTrafficColor(45)).toBe("rgb(16, 185, 129)");
  });

  it("returns red for 100%", () => {
    expect(densityToTrafficColor(100)).toBe("rgb(244, 63, 94)");
  });

  it("clamps negative values", () => {
    expect(densityToTrafficColor(-5)).toBe(densityToTrafficColor(0));
  });

  it("clamps values above 100", () => {
    expect(densityToTrafficColor(110)).toBe(densityToTrafficColor(100));
  });
});

describe("densityToRiskLevel", () => {
  it("returns low for < 40%", () => {
    expect(densityToRiskLevel(0)).toBe("low");
    expect(densityToRiskLevel(39)).toBe("low");
  });

  it("returns medium for 40-69%", () => {
    expect(densityToRiskLevel(40)).toBe("medium");
    expect(densityToRiskLevel(69)).toBe("medium");
  });

  it("returns high for 70-84%", () => {
    expect(densityToRiskLevel(70)).toBe("high");
    expect(densityToRiskLevel(84)).toBe("high");
  });

  it("returns critical for >= 85%", () => {
    expect(densityToRiskLevel(85)).toBe("critical");
    expect(densityToRiskLevel(100)).toBe("critical");
  });
});
