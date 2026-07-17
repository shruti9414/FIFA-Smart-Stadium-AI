import { NextResponse } from "next/server";
import { summarizeIncident } from "@/lib/ai/incidentSummary";
import { isGrokConfigured } from "@/lib/ai/grok";
import { getIncidentById, getLatestAiNote, saveAiNote } from "@/lib/db/incidents";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = await getIncidentById(Number(id));
  if (!incident) return NextResponse.json({ error: "Incident not found" }, { status: 404 });

  // Cache hit: a summary generated after the incident's last update is still valid.
  const cached = await getLatestAiNote(incident.id, "summary");
  if (cached && new Date(cached.generated_at) >= new Date(incident.updated_at)) {
    return NextResponse.json({
      data: { summary: cached.content },
      meta: { source: "gemini", cached: true, generatedAt: cached.generated_at },
    });
  }

  if (!isGrokConfigured()) {
    return NextResponse.json({ error: "AI incident summary is temporarily unavailable." }, { status: 503 });
  }

  try {
    const result = await summarizeIncident({
      type: incident.type,
      severity: incident.severity,
      status: incident.status,
      locationDesc: incident.location_desc ?? "",
      description: incident.description ?? "",
      reportedBy: incident.reported_by,
      createdAt: incident.created_at,
      updatedAt: incident.updated_at,
    });

    await saveAiNote(incident.id, "summary", result.data.summary, null);

    return NextResponse.json(result);
  } catch (error) {
    const fallbackSummary = `${incident.type} incident (${incident.severity} severity) reported by ${incident.reported_by} at ${incident.location_desc}. Status: ${incident.status}.`;

    await saveAiNote(incident.id, "summary", fallbackSummary, null);

    return NextResponse.json({
      data: { summary: fallbackSummary },
      meta: { source: "fallback", cached: false, generatedAt: new Date().toISOString() },
    });
  }
}
