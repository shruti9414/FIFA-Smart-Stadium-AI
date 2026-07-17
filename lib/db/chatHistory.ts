import { getPool } from "@/lib/db/pool";
import type { ChatSessionRow, ChatHistoryRow } from "@/lib/types/db";

export async function getOrCreateSession(
  sessionToken: string,
  context: "fan" | "ops",
  language: string
): Promise<ChatSessionRow> {
  const [existing] = await getPool().query("SELECT * FROM chat_sessions WHERE session_token = ?", [sessionToken]);
  const found = (existing as ChatSessionRow[])[0];
  if (found) return found;

  const [result] = await getPool().query(
    "INSERT INTO chat_sessions (session_token, language, context) VALUES (?, ?, ?)",
    [sessionToken, language, context]
  );
  const id = (result as { insertId: number }).insertId;
  return { id, session_token: sessionToken, language, context, created_at: new Date().toISOString() };
}

export async function getSessionHistory(sessionId: number, limit = 12): Promise<ChatHistoryRow[]> {
  const [rows] = await getPool().query(
    "SELECT * FROM chat_history WHERE session_id = ? ORDER BY created_at DESC LIMIT ?",
    [sessionId, limit]
  );
  return (rows as ChatHistoryRow[]).reverse();
}

export async function appendChatMessage(
  sessionId: number,
  role: "user" | "assistant",
  message: string,
  intent?: string
): Promise<void> {
  await getPool().query("INSERT INTO chat_history (session_id, role, message, intent) VALUES (?, ?, ?, ?)", [
    sessionId,
    role,
    message,
    intent ?? null,
  ]);
}
