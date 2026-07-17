import { NextResponse } from "next/server";
import { triggerSurge, triggerIncident } from "@/lib/sim/scenarios";

export async function POST(req: Request) {
  const { scenario } = await req.json();

  if (scenario === "surge") {
    const result = await triggerSurge();
    return NextResponse.json({ data: result });
  }
  if (scenario === "incident") {
    const id = await triggerIncident();
    return NextResponse.json({ data: { incidentId: id } });
  }

  return NextResponse.json({ error: "Unknown scenario. Use 'surge' or 'incident'." }, { status: 400 });
}
