import { getPool } from "@/lib/db/pool";
import type { StadiumGate } from "@/lib/types/db";
import type { GateStatus } from "@/lib/types/ui";

export async function getAllGates(): Promise<StadiumGate[]> {
  const [rows] = await getPool().query("SELECT * FROM stadium_gates ORDER BY name");
  return rows as StadiumGate[];
}

export async function getGateById(id: number): Promise<StadiumGate | null> {
  const [rows] = await getPool().query("SELECT * FROM stadium_gates WHERE id = ?", [id]);
  const list = rows as StadiumGate[];
  return list[0] ?? null;
}

export async function updateGateStatus(id: number, status: GateStatus): Promise<void> {
  await getPool().query("UPDATE stadium_gates SET status = ? WHERE id = ?", [status, id]);
}

export async function updateGateQueue(id: number, queueEstimate: number, throughputPerMin: number): Promise<void> {
  await getPool().query(
    "UPDATE stadium_gates SET current_queue_estimate = ?, throughput_per_min = ? WHERE id = ?",
    [queueEstimate, throughputPerMin, id]
  );
}
