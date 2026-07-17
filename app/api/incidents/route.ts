import { NextResponse } from "next/server";
import { getAllIncidents, createIncident, getIncidentById } from "@/lib/db/incidents";
import { emitGlobal } from "@/lib/socket/server";

export async function GET() {
  const incidents = await getAllIncidents();
  return NextResponse.json({ data: incidents });
}

/** Fan-side Emergency Help and the sim engine both create incidents through here — the cross-screen live-event trigger. */
export async function POST(req: Request) {
  const body = await req.json();
  const id = await createIncident({
    type: body.type,
    severity: body.severity ?? "medium",
    location_desc: body.location_desc ?? "Unspecified location",
    gate_id: body.gate_id ?? null,
    section_id: body.section_id ?? null,
    description: body.description ?? "",
    reported_by: body.reported_by ?? "fan-app",
  });

  const incident = await getIncidentById(id);
  if (incident) {
    try {
      emitGlobal("incident:new", {
        incidentId: incident.id,
        type: incident.type,
        severity: incident.severity,
        status: incident.status,
        locationDesc: incident.location_desc ?? "",
      });
    } catch {
      // Socket server not initialized (e.g. route hit outside the custom server) — non-fatal, facts are still saved.
    }
  }

  return NextResponse.json({ data: { id } }, { status: 201 });
}
