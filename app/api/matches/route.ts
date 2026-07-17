import { NextResponse } from "next/server";
import { getLiveMatch } from "@/lib/db/matches";

/** Single-stadium demo scope — always returns today's match, live or most recent. */
export async function GET() {
  const match = await getLiveMatch();
  return NextResponse.json({ data: match });
}
