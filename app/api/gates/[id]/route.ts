import { NextResponse } from "next/server";
import { getGateById, updateGateStatus } from "@/lib/db/gates";
import { emitGlobal } from "@/lib/socket/server";

/** Manual gate status change — the human "Approve" action on a Mission Control recommendation (e.g. "Reopen Gate 4B") lands here. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gateId = Number(id);
  const { status } = await req.json();

  await updateGateStatus(gateId, status);
  const gate = await getGateById(gateId);
  if (!gate) return NextResponse.json({ error: "Gate not found" }, { status: 404 });

  try {
    emitGlobal("gate:update", { gateId: gate.id, status: gate.status, queueEstimate: gate.current_queue_estimate });
  } catch {
    // Socket server not initialized — non-fatal.
  }

  return NextResponse.json({ data: gate });
}
