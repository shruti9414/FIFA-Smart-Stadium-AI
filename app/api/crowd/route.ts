import { NextResponse } from "next/server";
import { getLatestCrowdReadings } from "@/lib/db/crowd";

export async function GET() {
  const readings = await getLatestCrowdReadings();
  return NextResponse.json({ data: readings });
}
