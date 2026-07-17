import { NextResponse } from "next/server";
import { getOpsRecommendations } from "@/lib/ai/opsRecommendations";
import { isGrokConfigured } from "@/lib/ai/grok";
import { getAllGates } from "@/lib/db/gates";
import { getLatestCrowdReadings } from "@/lib/db/crowd";
import { getAllParking } from "@/lib/db/parking";
import { getAllFoodStalls } from "@/lib/db/foodStalls";
import { getActiveIncidents } from "@/lib/db/incidents";
import { getAllStaff } from "@/lib/db/staff";

export async function GET() {
  if (!isGrokConfigured()) {
    return NextResponse.json({ error: "AI recommendations are temporarily unavailable." }, { status: 503 });
  }

  const [gates, crowd, parking, foodStalls, incidents, staff] = await Promise.all([
    getAllGates(),
    getLatestCrowdReadings(),
    getAllParking(),
    getAllFoodStalls(),
    getActiveIncidents(),
    getAllStaff(),
  ]);

  const densityByGate = new Map(crowd.filter((c) => c.location_type === "gate").map((c) => [c.location_id, c.density_pct]));

  const result = await getOpsRecommendations({
    gates: gates.map((g) => ({
      name: g.name,
      densityPct: Number(densityByGate.get(g.id) ?? 0),
      status: g.status,
      queueEstimate: g.current_queue_estimate,
    })),
    parking: parking.map((p) => ({
      lotName: p.lot_name,
      occupancyPct: Math.round((p.occupied_spots / p.total_spots) * 100),
      status: p.status,
    })),
    foodStalls: foodStalls.map((f) => ({ name: f.name, waitTimeMin: f.wait_time_min })),
    incidents: incidents.map((i) => ({
      id: i.id,
      type: i.type,
      severity: i.severity,
      status: i.status,
      locationDesc: i.location_desc ?? "",
    })),
    staff: staff.map((s) => ({ role: s.role, status: s.status })),
  });

  return NextResponse.json(result);
}
