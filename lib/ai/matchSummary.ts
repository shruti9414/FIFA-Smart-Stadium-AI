import { generateText, MODELS } from "@/lib/ai/grok";
import type { AiResult } from "@/lib/types/ai";

/** Match Summary Generation — turns the raw event log into broadcast-style prose. Caller handles caching against based_on_event_count. */
export interface MatchSummaryFacts {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: string;
  events: { minute: number; eventType: string; team: string | null; player: string | null; detail: string | null }[];
}

export async function generateMatchSummary(input: MatchSummaryFacts): Promise<AiResult<{ summary: string }>> {
  const systemPrompt = `Write a short, professional sports-journalism recap paragraph (3-5 sentences) of this football match based on the event log. Tone: broadcast commentary, not a bullet list. Do not invent details not in the event log.`;

  const userPrompt = `${input.homeTeam} ${input.homeScore} - ${input.awayScore} ${input.awayTeam}
Status: ${input.status}, minute ${input.minute}
Events:
${input.events.map((e) => `${e.minute}' ${e.eventType}${e.team ? ` (${e.team}${e.player ? " - " + e.player : ""})` : ""}${e.detail ? ` — ${e.detail}` : ""}`).join("\n")}`;

  const summary = await generateText(systemPrompt, userPrompt, { model: MODELS.fast, temperature: 0.7 });

  return {
    data: { summary: summary.trim() },
    meta: { source: "grok", cached: false, generatedAt: new Date().toISOString() },
  };
}
