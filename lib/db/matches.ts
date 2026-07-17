import { getPool } from "@/lib/db/pool";
import type { MatchRow, MatchEventRow, MatchSummaryRow } from "@/lib/types/db";

export async function getLiveMatch(): Promise<MatchRow | null> {
  const [rows] = await getPool().query(
    "SELECT * FROM matches WHERE status IN ('live','halftime') ORDER BY kickoff_at DESC LIMIT 1"
  );
  const list = rows as MatchRow[];
  if (list[0]) return list[0];
  const [fallback] = await getPool().query("SELECT * FROM matches ORDER BY kickoff_at DESC LIMIT 1");
  return (fallback as MatchRow[])[0] ?? null;
}

export async function getMatchById(id: number): Promise<MatchRow | null> {
  const [rows] = await getPool().query("SELECT * FROM matches WHERE id = ?", [id]);
  return (rows as MatchRow[])[0] ?? null;
}

export async function getMatchEvents(matchId: number): Promise<MatchEventRow[]> {
  const [rows] = await getPool().query(
    "SELECT * FROM match_events WHERE match_id = ? ORDER BY minute ASC, id ASC",
    [matchId]
  );
  return rows as MatchEventRow[];
}

export async function insertMatchEvent(event: Omit<MatchEventRow, "id">): Promise<void> {
  await getPool().query(
    "INSERT INTO match_events (match_id, minute, event_type, team, player, detail) VALUES (?, ?, ?, ?, ?, ?)",
    [event.match_id, event.minute, event.event_type, event.team, event.player, event.detail]
  );
}

export async function updateMatchState(
  id: number,
  fields: Partial<Pick<MatchRow, "minute" | "home_score" | "away_score" | "status">>
): Promise<void> {
  const cols = Object.keys(fields);
  if (cols.length === 0) return;
  const setClause = cols.map((c) => `${c} = ?`).join(", ");
  await getPool().query(`UPDATE matches SET ${setClause} WHERE id = ?`, [
    ...cols.map((c) => (fields as Record<string, unknown>)[c]),
    id,
  ]);
}

/** AI cache — the only place Gemini-generated match text is persisted (§ facts vs intelligence). */
export async function getCachedMatchSummary(matchId: number, eventCount: number): Promise<MatchSummaryRow | null> {
  const [rows] = await getPool().query(
    "SELECT * FROM match_summaries WHERE match_id = ? AND based_on_event_count = ? ORDER BY generated_at DESC LIMIT 1",
    [matchId, eventCount]
  );
  return (rows as MatchSummaryRow[])[0] ?? null;
}

export async function saveMatchSummary(matchId: number, summaryText: string, eventCount: number): Promise<void> {
  await getPool().query(
    "INSERT INTO match_summaries (match_id, summary_text, based_on_event_count) VALUES (?, ?, ?)",
    [matchId, summaryText, eventCount]
  );
}
