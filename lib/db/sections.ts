import { getPool } from "@/lib/db/pool";
import type { StadiumSection } from "@/lib/types/db";

export async function getAllSections(): Promise<StadiumSection[]> {
  const [rows] = await getPool().query("SELECT * FROM stadium_sections ORDER BY name");
  return rows as StadiumSection[];
}
