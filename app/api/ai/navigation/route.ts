import { NextResponse } from "next/server";
import { getNavigationGuidance } from "@/lib/ai/navigation";
import { isGeminiConfigured } from "@/lib/ai/gemini";
import { getAllGates } from "@/lib/db/gates";
import { getLatestCrowdReadings } from "@/lib/db/crowd";

export async function POST(req: Request) {
  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: "AI navigation is temporarily unavailable." }, { status: 503 });
  }

  const body = await req.json();
  const { destinationType = "seat", destinationLabel, seatSection } = body as {
    destinationType?: "seat" | "gate" | "stall";
    destinationLabel: string;
    seatSection?: string;
  };

  const [gates, crowd] = await Promise.all([getAllGates(), getLatestCrowdReadings()]);
  const densityByGate = new Map(crowd.filter((c) => c.location_type === "gate").map((c) => [c.location_id, c.density_pct]));

  const gateDensities = gates.map((g) => ({
    gateName: g.name,
    densityPct: Number(densityByGate.get(g.id) ?? 0),
    status: g.status,
  }));

  const result = await getNavigationGuidance({
    destination: { type: destinationType, label: destinationLabel },
    seatSection: seatSection ?? null,
    gateDensities,
  });

  return NextResponse.json(result);
}
