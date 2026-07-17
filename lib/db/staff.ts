import { getPool } from "@/lib/db/pool";
import type { StaffRow } from "@/lib/types/db";

export async function getAllStaff(): Promise<StaffRow[]> {
  const [rows] = await getPool().query("SELECT * FROM staff ORDER BY role, name");
  return rows as StaffRow[];
}

export async function getAvailableStaff(): Promise<StaffRow[]> {
  const [rows] = await getPool().query("SELECT * FROM staff WHERE status = 'available' ORDER BY role");
  return rows as StaffRow[];
}
