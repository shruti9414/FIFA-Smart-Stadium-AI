import { getPool } from "@/lib/db/pool";
import type { ParkingRow } from "@/lib/types/db";
import type { ParkingStatus } from "@/lib/types/ui";

export async function getAllParking(): Promise<ParkingRow[]> {
  const [rows] = await getPool().query("SELECT * FROM parking ORDER BY lot_name");
  return rows as ParkingRow[];
}

export async function updateParkingOccupancy(id: number, occupiedSpots: number, status: ParkingStatus): Promise<void> {
  await getPool().query("UPDATE parking SET occupied_spots = ?, status = ? WHERE id = ?", [occupiedSpots, status, id]);
}
