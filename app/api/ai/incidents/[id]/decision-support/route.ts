import { NextResponse } from "next/server";
import { getEmergencyDecisionSupport } from "@/lib/ai/emergencyDecision";
import { isGrokConfigured } from "@/lib/ai/grok";
import { getIncidentById, saveAiNote } from "@/lib/db/incidents";
import { getAllGates } from "@/lib/db/gates";
import { getLatestCrowdReadings } from "@/lib/db/crowd";
import { getAvailableStaff } from "@/lib/db/staff";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isGrokConfigured()) {
    return NextResponse.json({ error: "AI decision support is temporarily unavailable." }, { status: 503 });
  }

  const { id } = await params;
  const incident = await getIncidentById(Number(id));
  if (!incident) return NextResponse.json({ error: "Incident not found" }, { status: 404 });

  const [gates, crowd, staff] = await Promise.all([getAllGates(), getLatestCrowdReadings(), getAvailableStaff()]);
  const nearbyGates = incident.gate_id ? gates.filter((g) => g.id === incident.gate_id) : gates.slice(0, 3);
  const nearbyDensity = incident.gate_id
    ? crowd.find((c) => c.location_type === "gate" && c.location_id === incident.gate_id)?.density_pct ?? null
    : null;

  try {
    const result = await getEmergencyDecisionSupport({
      incidentType: incident.type,
      severity: incident.severity,
      locationDesc: incident.location_desc ?? "",
      description: incident.description ?? "",
      nearbyDensityPct: nearbyDensity !== null ? Number(nearbyDensity) : null,
      nearbyGates: nearbyGates.map((g) => ({ name: g.name, status: g.status })),
      availableStaff: staff.map((s) => ({ role: s.role })),
    });

    await saveAiNote(incident.id, "decision_support", JSON.stringify(result.data), result.meta.confidence ?? null);

    return NextResponse.json(result);
  } catch (error) {
    const needsEvacuation = incident.severity === "critical";
    const recommendedUnit = incident.type === "structural_damage" || incident.type === "fire" ? "Fire Department" : "Police";

    const fallbackDecision = {
      evacuationNeeded: needsEvacuation,
      recommendedUnit,
      recommendedExitClosures: nearbyGates.length > 0 ? [nearbyGates[0].name] : [],
      immediateActions: [
        `Deploy ${recommendedUnit} to ${incident.location_desc}`,
        `Monitor nearby crowd density (currently ${nearbyDensity ?? 0}%)`,
        needsEvacuation ? "Prepare evacuation routes" : "Establish a safety perimeter",
      ],
      rationale: `${incident.type} at ${incident.severity} severity requires immediate ${needsEvacuation ? "evacuation" : "containment"} measures.`,
      confidence: 0.6,
    };

    await saveAiNote(incident.id, "decision_support", JSON.stringify(fallbackDecision), 0.6);

    return NextResponse.json({
      data: fallbackDecision,
      meta: { source: "fallback", cached: false, generatedAt: new Date().toISOString(), confidence: 0.6 },
    });
  }
}
