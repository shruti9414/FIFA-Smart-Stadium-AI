import { NextResponse } from "next/server";
import { analyzeCrowd } from "@/lib/ai/crowdAnalysis";
import { isGrokConfigured } from "@/lib/ai/grok";
import { getCrowdHistory } from "@/lib/db/crowd";
import { getAllGates } from "@/lib/db/gates";
import { getAllSections } from "@/lib/db/sections";

export async function POST(req: Request) {
  if (!isGrokConfigured()) {
    return NextResponse.json({ error: "AI crowd analysis is temporarily unavailable." }, { status: 503 });
  }

  const body = await req.json();
  const { locationType, locationId } = body as { locationType: "gate" | "section"; locationId: number };

  const [history, gates, sections] = await Promise.all([
    getCrowdHistory(locationType, locationId, 8),
    getAllGates(),
    getAllSections(),
  ]);

  const label =
    locationType === "gate"
      ? gates.find((g) => g.id === locationId)?.name ?? `Gate ${locationId}`
      : sections.find((s) => s.id === locationId)?.name ?? `Section ${locationId}`;

  const result = await analyzeCrowd({
    locationLabel: label,
    window: history.map((h) => ({ densityPct: Number(h.density_pct), recordedAt: h.recorded_at })),
  });

  return NextResponse.json(result);
}
