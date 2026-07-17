import { getPool } from "@/lib/db/pool";
import type { CrowdDataRow } from "@/lib/types/db";
import type { TrendDirection } from "@/lib/types/ui";

/** Latest reading per (location_type, location_id) — what the Digital Twin/KPI strip render. */
export async function getLatestCrowdReadings(): Promise<CrowdDataRow[]> {
  const [rows] = await getPool().query(`
    SELECT c.*
    FROM crowd_data c
    INNER JOIN (
      SELECT location_type, location_id, MAX(recorded_at) AS max_time
      FROM crowd_data
      GROUP BY location_type, location_id
    ) latest
      ON c.location_type = latest.location_type
      AND c.location_id = latest.location_id
      AND c.recorded_at = latest.max_time
  `);
  return rows as CrowdDataRow[];
}

/** Time-series window for one location — the multi-point input Crowd Analysis needs (not a single-point lookup). */
export async function getCrowdHistory(
  locationType: CrowdDataRow["location_type"],
  locationId: number,
  limit = 10
): Promise<CrowdDataRow[]> {
  const [rows] = await getPool().query(
    "SELECT * FROM crowd_data WHERE location_type = ? AND location_id = ? ORDER BY recorded_at DESC LIMIT ?",
    [locationType, locationId, limit]
  );
  return (rows as CrowdDataRow[]).reverse();
}

export async function insertCrowdReading(
  locationType: CrowdDataRow["location_type"],
  locationId: number,
  densityPct: number,
  trend: TrendDirection
): Promise<void> {
  await getPool().query(
    "INSERT INTO crowd_data (location_type, location_id, density_pct, people_count_estimate, trend) VALUES (?, ?, ?, ?, ?)",
    [locationType, locationId, densityPct, Math.round(densityPct * 30), trend]
  );
}
