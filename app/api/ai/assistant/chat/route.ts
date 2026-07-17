import { NextResponse } from "next/server";
import { askAssistant } from "@/lib/ai/assistant";
import { isGrokConfigured } from "@/lib/ai/grok";
import { getOrCreateSession, getSessionHistory, appendChatMessage } from "@/lib/db/chatHistory";
import { getAllGates } from "@/lib/db/gates";
import { getActiveIncidents } from "@/lib/db/incidents";
import { getLiveMatch } from "@/lib/db/matches";

export async function POST(req: Request) {
  if (!isGrokConfigured()) {
    return NextResponse.json(
      { error: "AI assistant is temporarily unavailable — GROK_API_KEY is not configured." },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { sessionToken, context, language = "en", message, extraFacts = {} } = body as {
    sessionToken: string;
    context: "fan" | "ops";
    language?: string;
    message: string;
    extraFacts?: Record<string, unknown>;
  };

  const session = await getOrCreateSession(sessionToken, context, language);
  const history = await getSessionHistory(session.id);

  const [gates, incidents, match] = await Promise.all([getAllGates(), getActiveIncidents(), getLiveMatch()]);

  const facts =
    context === "fan"
      ? {
          match: match ? `${match.home_team} ${match.home_score}-${match.away_score} ${match.away_team}, ${match.status} min ${match.minute}` : null,
          gates: gates.map((g) => ({ name: g.name, status: g.status, queue: g.current_queue_estimate })),
          activeIncidentCount: incidents.length,
          ...extraFacts,
        }
      : {
          gatesOpen: gates.filter((g) => g.status === "open").length,
          gatesCongested: gates.filter((g) => g.status === "congested").length,
          gatesClosed: gates.filter((g) => g.status === "closed").length,
          activeIncidents: incidents.map((i) => `#${i.id} ${i.type} (${i.severity})`),
          match: match ? `${match.home_team} ${match.home_score}-${match.away_score} ${match.away_team}` : null,
          ...extraFacts,
        };

  const result = await askAssistant({
    context,
    language,
    facts,
    history: history.map((h) => ({ role: h.role, message: h.message })),
    message,
  });

  await appendChatMessage(session.id, "user", message);
  await appendChatMessage(session.id, "assistant", result.data.reply);

  return NextResponse.json({ ...result, sessionId: session.id });
}
