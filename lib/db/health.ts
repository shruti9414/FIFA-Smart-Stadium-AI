import { getPool } from "@/lib/db/pool";

export type DbHealth =
  | { ok: true; latencyMs: number }
  | { ok: false; error: string };

/**
 * Non-throwing connectivity check. The foundation must not hard-crash
 * if MySQL isn't running yet — callers decide how to surface `ok: false`.
 */
export async function checkDbHealth(): Promise<DbHealth> {
  const start = performance.now();
  try {
    const pool = getPool();
    await pool.query("SELECT 1");
    return { ok: true, latencyMs: Math.round(performance.now() - start) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
