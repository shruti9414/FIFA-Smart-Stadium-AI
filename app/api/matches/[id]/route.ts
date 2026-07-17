import { NextResponse } from "next/server";
import { getMatchById, getMatchEvents } from "@/lib/db/matches";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const matchId = Number(id);
  const [match, events] = await Promise.all([getMatchById(matchId), getMatchEvents(matchId)]);
  if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });
  return NextResponse.json({ data: { ...match, events } });
}
