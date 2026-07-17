import { getPool } from "@/lib/db/pool";
import type { IncidentRow, IncidentAiNoteRow } from "@/lib/types/db";
import type { IncidentStatus } from "@/lib/types/ui";

export async function getAllIncidents(): Promise<IncidentRow[]> {
  const [rows] = await getPool().query(
    "SELECT * FROM incidents ORDER BY (status != 'resolved') DESC, FIELD(severity,'critical','high','medium','low'), created_at DESC"
  );
  return rows as IncidentRow[];
}

export async function getIncidentById(id: number): Promise<IncidentRow | null> {
  const [rows] = await getPool().query("SELECT * FROM incidents WHERE id = ?", [id]);
  return (rows as IncidentRow[])[0] ?? null;
}

export async function getActiveIncidents(): Promise<IncidentRow[]> {
  const [rows] = await getPool().query("SELECT * FROM incidents WHERE status != 'resolved' ORDER BY created_at DESC");
  return rows as IncidentRow[];
}

export async function createIncident(input: {
  type: IncidentRow["type"];
  severity: IncidentRow["severity"];
  location_desc: string;
  gate_id: number | null;
  section_id: number | null;
  description: string;
  reported_by?: string;
}): Promise<number> {
  const [result] = await getPool().query(
    "INSERT INTO incidents (type, severity, location_desc, gate_id, section_id, description, reported_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      input.type,
      input.severity,
      input.location_desc,
      input.gate_id,
      input.section_id,
      input.description,
      input.reported_by ?? "fan-app",
    ]
  );
  return (result as { insertId: number }).insertId;
}

export async function updateIncidentStatus(id: number, status: IncidentStatus): Promise<void> {
  await getPool().query("UPDATE incidents SET status = ? WHERE id = ?", [status, id]);
}

/** AI cache — the only place Gemini-generated incident text is persisted. */
export async function getLatestAiNote(
  incidentId: number,
  noteType: IncidentAiNoteRow["note_type"]
): Promise<IncidentAiNoteRow | null> {
  const [rows] = await getPool().query(
    "SELECT * FROM incident_ai_notes WHERE incident_id = ? AND note_type = ? ORDER BY generated_at DESC LIMIT 1",
    [incidentId, noteType]
  );
  return (rows as IncidentAiNoteRow[])[0] ?? null;
}

export async function saveAiNote(
  incidentId: number,
  noteType: IncidentAiNoteRow["note_type"],
  content: string,
  confidence: number | null
): Promise<void> {
  await getPool().query(
    "INSERT INTO incident_ai_notes (incident_id, note_type, content, confidence) VALUES (?, ?, ?, ?)",
    [incidentId, noteType, content, confidence]
  );
}
