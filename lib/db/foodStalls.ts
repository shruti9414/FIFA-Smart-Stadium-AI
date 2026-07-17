import { getPool } from "@/lib/db/pool";
import type { FoodStallRow } from "@/lib/types/db";

export async function getAllFoodStalls(): Promise<FoodStallRow[]> {
  const [rows] = await getPool().query("SELECT * FROM food_stalls ORDER BY zone, name");
  return rows as FoodStallRow[];
}

export async function updateFoodStallWait(id: number, waitTimeMin: number): Promise<void> {
  await getPool().query("UPDATE food_stalls SET wait_time_min = ? WHERE id = ?", [waitTimeMin, id]);
}
