import { NextResponse } from "next/server";
import { getAllFoodStalls } from "@/lib/db/foodStalls";

export async function GET() {
  const stalls = await getAllFoodStalls();
  return NextResponse.json({ data: stalls });
}
