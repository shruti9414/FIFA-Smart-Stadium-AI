import { NextResponse } from "next/server";
import { generateMatchSummary } from "@/lib/ai/matchSummary";
import { isGeminiConfigured } from "@/lib/ai/gemini";
import { getLiveMatch, getMatchEvents, getCachedMatchSummary, saveMatchSummary } from "@/lib/db/matches";

export async function GET() {
  const match = await getLiveMatch();
  if (!match) return NextResponse.json({ error: "No match found" }, { status: 404 });

  const events = await getMatchEvents(match.id);

  const cached = await getCachedMatchSummary(match.id, events.length);
  if (cached) {
    return NextResponse.json({
      data: { summary: cached.summary_text },
      meta: { source: "gemini", cached: true, generatedAt: cached.generated_at },
    });
  }

  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: "AI match summary is temporarily unavailable." }, { status: 503 });
  }

  const result = await generateMatchSummary({
    homeTeam: match.home_team,
    awayTeam: match.away_team,
    homeScore: match.home_score,
    awayScore: match.away_score,
    minute: match.minute,
    status: match.status,
    events: events.map((e) => ({ minute: e.minute, eventType: e.event_type, team: e.team, player: e.player, detail: e.detail })),
  });

  await saveMatchSummary(match.id, result.data.summary, events.length);

  return NextResponse.json(result);
}
