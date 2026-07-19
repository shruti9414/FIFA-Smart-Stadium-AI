import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetAllIncidents = vi.fn();
const mockCreateIncident = vi.fn();
const mockGetIncidentById = vi.fn();
const mockEmitGlobal = vi.fn();

vi.mock("@/lib/db/incidents", () => ({
  getAllIncidents: mockGetAllIncidents,
  createIncident: mockCreateIncident,
  getIncidentById: mockGetIncidentById,
}));

vi.mock("@/lib/socket/server", () => ({
  emitGlobal: mockEmitGlobal,
}));

vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: ResponseInit) => ({
      json: async () => data,
      status: init?.status ?? 200,
    }),
  },
}));

describe("GET /api/incidents", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns all incidents", async () => {
    const mockIncidents = [
      { id: 1, type: "crowd_surge", severity: "high", status: "open" },
      { id: 2, type: "medical", severity: "critical", status: "open" },
    ];
    mockGetAllIncidents.mockResolvedValue(mockIncidents);

    const { GET } = await import("@/app/api/incidents/route");
    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({ data: mockIncidents });
    expect(mockGetAllIncidents).toHaveBeenCalledOnce();
  });

  it("returns empty array when no incidents exist", async () => {
    mockGetAllIncidents.mockResolvedValue([]);
    const { GET } = await import("@/app/api/incidents/route");
    const response = await GET();
    const data = await response.json();
    expect(data.data).toEqual([]);
  });
});

describe("POST /api/incidents", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it("creates an incident and returns 201", async () => {
    mockCreateIncident.mockResolvedValue(42);
    mockGetIncidentById.mockResolvedValue({
      id: 42,
      type: "crowd_surge",
      severity: "high",
      status: "open",
      location_desc: "Section A",
    });

    const { POST } = await import("@/app/api/incidents/route");
    const req = {
      json: async () => ({
        type: "crowd_surge",
        severity: "high",
        location_desc: "Section A",
      }),
    } as Request;

    const response = await POST(req);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.data.id).toBe(42);
  });

  it("uses defaults for optional fields", async () => {
    mockCreateIncident.mockResolvedValue(1);
    mockGetIncidentById.mockResolvedValue(null);

    const { POST } = await import("@/app/api/incidents/route");
    const req = {
      json: async () => ({ type: "medical" }),
    } as Request;

    await POST(req);
    expect(mockCreateIncident).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "medical",
        severity: "medium",
        location_desc: "Unspecified location",
        reported_by: "fan-app",
      })
    );
  });

  it("emits socket event after creation", async () => {
    mockCreateIncident.mockResolvedValue(5);
    mockGetIncidentById.mockResolvedValue({
      id: 5,
      type: "fire_alarm",
      severity: "critical",
      status: "open",
      location_desc: "Gate B",
    });

    const { POST } = await import("@/app/api/incidents/route");
    const req = {
      json: async () => ({ type: "fire_alarm", severity: "critical" }),
    } as Request;

    await POST(req);
    expect(mockEmitGlobal).toHaveBeenCalledWith("incident:new", expect.objectContaining({ incidentId: 5 }));
  });

  it("does not throw when socket emit fails", async () => {
    mockCreateIncident.mockResolvedValue(7);
    mockGetIncidentById.mockResolvedValue({
      id: 7,
      type: "medical",
      severity: "low",
      status: "open",
      location_desc: "Section C",
    });
    mockEmitGlobal.mockImplementation(() => { throw new Error("Socket not ready"); });

    const { POST } = await import("@/app/api/incidents/route");
    const req = {
      json: async () => ({ type: "medical" }),
    } as Request;

    await expect(POST(req)).resolves.not.toThrow();
  });
});
