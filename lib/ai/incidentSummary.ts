import { generateText, MODELS } from "@/lib/ai/grok";
import type { AiResult } from "@/lib/types/ai";

/** Incident Summarization — condenses an incident's raw trail into a shift-report paragraph. */
export interface IncidentSummaryFacts {
  type: string;
  severity: string;
  status: string;
  locationDesc: string;
  description: string;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
}

export async function summarizeIncident(input: IncidentSummaryFacts): Promise<AiResult<{ summary: string }>> {
  const systemPrompt = `Condense this incident record into a concise 2-3 sentence situational summary suitable for a shift-change report to the next commander. Include what happened, current status, and any notable timing. Professional, neutral tone.`;

  const userPrompt = `Type: ${input.type}
Severity: ${input.severity}
Status: ${input.status}
Location: ${input.locationDesc}
Reported by: ${input.reportedBy} at ${input.createdAt}
Last updated: ${input.updatedAt}
Description: ${input.description}`;

  const summary = await generateText(systemPrompt, userPrompt, { model: MODELS.fast, temperature: 0.4 });

  return {
    data: { summary: summary.trim() },
    meta: { source: "grok", cached: false, generatedAt: new Date().toISOString() },
  };
}
