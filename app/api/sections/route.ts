import { NextResponse } from "next/server";
import { getAllSections } from "@/lib/db/sections";

export async function GET() {
  const sections = await getAllSections();
  return NextResponse.json({ data: sections });
}
