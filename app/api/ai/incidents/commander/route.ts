import { NextResponse } from "next/server";
import { getIncidentCommanderPlan } from "@/lib/ai/incidentCommander";
import { isGrokConfigured } from "@/lib/ai/grok";
import { getActiveIncidents, saveAiNote } from "@/lib/db/incidents";
import { getAllGates } from "@/lib/db/gates";
import { getLatestCrowdReadings } from "@/lib/db/crowd";
import { getAvailableStaff } from "@/lib/db/staff";

export async function POST() {
  if (!isGrokConfigured()) {
    return NextResponse.json({ error: "AI Incident Commander is temporarily unavailable." }, { status: 503 });
  }

  const [incidents, gates, crowd, staff] = await Promise.all([
    getActiveIncidents(),
    getAllGates(),
    getLatestCrowdReadings(),
    getAvailableStaff(),
  ]);

  if (incidents.length < 2) {
    return NextResponse.json(
      { error: "Commander Mode requires at least 2 concurrent active incidents." },
      { status: 400 }
    );
  }

  const densityByGate = new Map(crowd.filter((c) => c.location_type === "gate").map((c) => [c.location_id, c.density_pct]));

  try {
    const result = await getIncidentCommanderPlan({
      incidents: incidents.map((i) => ({
        id: i.id,
        type: i.type,
        severity: i.severity,
        locationDesc: i.location_desc ?? "",
        description: i.description ?? "",
      })),
      gates: gates.map((g) => ({ name: g.name, densityPct: Number(densityByGate.get(g.id) ?? 0), status: g.status })),
      availableStaff: staff.map((s) => ({ role: s.role })),
    });

    // Attach the commander plan to every active incident it covers, so each incident's detail view can show it was part of a synthesized plan.
    await Promise.all(
      incidents.map((i) => saveAiNote(i.id, "commander_plan", JSON.stringify(result.data), result.meta.confidence ?? null))
    );

    return NextResponse.json(result);
  } catch (error) {
    const criticalIncidents = incidents.filter((i) => i.severity === "critical");
    const highIncidents = incidents.filter((i) => i.severity === "high");

    const fallbackResult = {
      data: {
        situationAssessment: `${criticalIncidents.length + highIncidents.length} high-severity incidents active. Recommend focused resource allocation to critical zones.`,
        rankedActions: [
          {
            priority: 1,
            action: "Deploy all available units to critical incident zones",
            rationale: `${criticalIncidents.length} critical incidents require immediate attention`,
          },
          {
            priority: 2,
            action: "Position medical teams at high-risk gates",
            rationale: `Gates at ${Math.max(...Array.from(densityByGate.values()))}% capacity need emergency support`,
          },
          {
            priority: 3,
            action: "Monitor remaining incidents for escalation",
            rationale: `Non-critical incidents may compound — watch for severity changes`,
          },
        ],
        confidence: 0.65,
      },
      meta: { source: "fallback", cached: false, generatedAt: new Date().toISOString(), confidence: 0.65 },
    };

    await Promise.all(
      incidents.map((i) =>
        saveAiNote(i.id, "commander_plan", JSON.stringify(fallbackResult.data), 0.65)
      )
    );

    return NextResponse.json(fallbackResult);
  }
}
