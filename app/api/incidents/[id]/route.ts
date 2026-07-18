import { NextResponse } from "next/server";
import { getPool } from "@/lib/db/pool";
import type { IncidentRow } from "@/lib/types/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT * FROM incidents WHERE id = ? LIMIT 1",
      [parseInt(id)]
    );
    const incident = (rows as IncidentRow[])[0];

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    return NextResponse.json(incident);
  } catch (err) {
    console.error("[incidents] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch incident" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { status, description } = body;

    const pool = getPool();
    await pool.query("UPDATE incidents SET status = ?, description = ?, updated_at = NOW() WHERE id = ?", [
      status || undefined,
      description || undefined,
      parseInt(id),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[incidents] PATCH error:", err);
    return NextResponse.json({ error: "Failed to update incident" }, { status: 500 });
  }
}
