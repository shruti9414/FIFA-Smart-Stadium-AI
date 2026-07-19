import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetLatestCrowdReadings = vi.fn();

vi.mock("@/lib/db/crowd", () => ({
  getLatestCrowdReadings: mockGetLatestCrowdReadings,
}));

vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown) => ({ json: async () => data, status: 200 }),
  },
}));

describe("GET /api/crowd", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it("returns crowd readings", async () => {
    const mockReadings = [
      { section_id: 1, density_pct: 72, queue_length: 14, updated_at: "2026-07-19T10:00:00Z" },
      { section_id: 2, density_pct: 45, queue_length: 5, updated_at: "2026-07-19T10:00:00Z" },
    ];
    mockGetLatestCrowdReadings.mockResolvedValue(mockReadings);

    const { GET } = await import("@/app/api/crowd/route");
    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({ data: mockReadings });
    expect(mockGetLatestCrowdReadings).toHaveBeenCalledOnce();
  });

  it("returns empty array when no readings", async () => {
    mockGetLatestCrowdReadings.mockResolvedValue([]);
    const { GET } = await import("@/app/api/crowd/route");
    const response = await GET();
    const data = await response.json();
    expect(data.data).toEqual([]);
  });
});
