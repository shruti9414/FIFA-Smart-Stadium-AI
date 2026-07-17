import { NextResponse } from "next/server";
import { getAllGates } from "@/lib/db/gates";

export async function GET() {
  const gates = await getAllGates();
  return NextResponse.json({ data: gates });
}
