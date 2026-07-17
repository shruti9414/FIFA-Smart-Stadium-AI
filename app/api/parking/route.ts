import { NextResponse } from "next/server";
import { getAllParking } from "@/lib/db/parking";

export async function GET() {
  const lots = await getAllParking();
  return NextResponse.json({ data: lots });
}
