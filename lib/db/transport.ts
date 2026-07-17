import { getPool } from "@/lib/db/pool";
import type { TransportRow } from "@/lib/types/db";

export async function getAllTransport(): Promise<TransportRow[]> {
  const [rows] = await getPool().query("SELECT * FROM transport ORDER BY mode, route_name");
  return rows as TransportRow[];
}
