import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatRelativeTime,
  formatClock,
  formatDate,
  formatPercent,
} from "@/lib/utils/format";

describe("formatNumber", () => {
  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("adds thousands separator", () => {
    expect(formatNumber(14382)).toBe("14,382");
  });

  it("rounds floats", () => {
    expect(formatNumber(14382.7)).toBe("14,383");
  });

  it("handles large numbers", () => {
    expect(formatNumber(1_000_000)).toBe("1,000,000");
  });

  it("handles negative numbers", () => {
    expect(formatNumber(-500)).toBe("-500");
  });
});

describe("formatRelativeTime", () => {
  const now = new Date("2026-07-19T12:00:00.000Z");

  it("returns 'just now' for < 10 seconds ago", () => {
    const then = new Date(now.getTime() - 5000).toISOString();
    expect(formatRelativeTime(then, now)).toBe("just now");
  });

  it("returns seconds for 10-59 seconds", () => {
    const then = new Date(now.getTime() - 30_000).toISOString();
    expect(formatRelativeTime(then, now)).toBe("30s ago");
  });

  it("returns minutes for 1-59 minutes", () => {
    const then = new Date(now.getTime() - 5 * 60_000).toISOString();
    expect(formatRelativeTime(then, now)).toBe("5m ago");
  });

  it("returns hours for 1-23 hours", () => {
    const then = new Date(now.getTime() - 3 * 3_600_000).toISOString();
    expect(formatRelativeTime(then, now)).toBe("3h ago");
  });

  it("returns a date string for >= 24 hours", () => {
    const then = new Date(now.getTime() - 48 * 3_600_000).toISOString();
    const result = formatRelativeTime(then, now);
    expect(result).not.toContain("ago");
    expect(result.length).toBeGreaterThan(4);
  });

  it("clamps negative diff to 'just now'", () => {
    const future = new Date(now.getTime() + 5000).toISOString();
    expect(formatRelativeTime(future, now)).toBe("just now");
  });
});

describe("formatClock", () => {
  it("returns HH:MM in 24h format", () => {
    const result = formatClock("2026-07-19T14:35:00.000Z");
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe("formatDate", () => {
  it("returns a human-readable date string", () => {
    const result = formatDate("2026-07-19T00:00:00.000Z");
    expect(result).toContain("2026");
    expect(result.length).toBeGreaterThan(6);
  });
});

describe("formatPercent", () => {
  it("handles 0-1 range", () => {
    expect(formatPercent(0.873)).toBe("87%");
  });

  it("handles 0-100 range", () => {
    expect(formatPercent(87)).toBe("87%");
  });

  it("rounds correctly", () => {
    expect(formatPercent(0.876)).toBe("88%");
  });

  it("handles 0%", () => {
    expect(formatPercent(0)).toBe("0%");
  });

  it("handles 100%", () => {
    expect(formatPercent(1)).toBe("100%");
  });

  it("handles exact boundary (1.0 treated as 100%)", () => {
    expect(formatPercent(1.0)).toBe("100%");
  });
});
