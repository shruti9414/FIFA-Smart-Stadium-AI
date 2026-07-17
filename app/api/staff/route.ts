import { NextResponse } from "next/server";
import { getAllStaff } from "@/lib/db/staff";

export async function GET() {
  const staff = await getAllStaff();
  return NextResponse.json({ data: staff });
}
