import { NextResponse } from "next/server";
import { getAllTransport } from "@/lib/db/transport";

export async function GET() {
  const routes = await getAllTransport();
  return NextResponse.json({ data: routes });
}
