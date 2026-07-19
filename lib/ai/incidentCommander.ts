import { generateJSON, MODELS } from "@/lib/ai/gemini";
import type { AiResult } from "@/lib/types/ai";

/**
 * AI Incident Commander — the Incident Center's escalation-state feature.
 * Synthesizes ALL currently active incidents plus live ops facts into one
 * ranked, cross-incident action plan, rather than reasoning about a
 * single incident in isolation (that's emergencyDecision.ts).
 */
export interface IncidentCommanderFacts {
  incidents: { id: number; type: string; severity: string; locationDesc: string; description: string }[];
  gates: { name: string; densityPct: number; status: string }[];
  availableStaff: { role: string }[];
}

export interface IncidentCommanderResult {
  situationAssessment: string;
  rankedActions: { priority: number; action: string; rationale: string }[];
  confidence: number;
}

const SCHEMA = {
  type: "OBJECT",
  properties: {
    situationAssessment: { type: "STRING", description: "1-2 sentence synthesis of the overall situation across all active incidents" },
    rankedActions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          priority: { type: "NUMBER" },
          action: { type: "STRING" },
          rationale: { type: "STRING" },
        },
        required: ["priority", "action", "rationale"],
      },
    },
    confidence: { type: "NUMBER" },
  },
  required: ["situationAssessment", "rankedActions", "confidence"],
};

export async function getIncidentCommanderPlan(input: IncidentCommanderFacts): Promise<AiResult<IncidentCommanderResult>> {
  const systemPrompt = `You are the AI Incident Commander for a FIFA World Cup stadium war room. Multiple incidents are active simultaneously. Synthesize them together with live gate/staff data into ONE ranked action plan (up to 5 actions, priority 1 = do first). Consider how incidents might compound each other (e.g. an incident near an already-congested gate is higher priority). This is decision support for human commanders — they will approve or reject each action.`;

  const userPrompt = `ACTIVE INCIDENTS:
${input.incidents.map((i) => `- #${i.id} ${i.type} (${i.severity}) at ${i.locationDesc}: ${i.description}`).join("\n")}

GATES:
${input.gates.map((g) => `- ${g.name}: ${g.densityPct}% density, status=${g.status}`).join("\n")}

AVAILABLE STAFF:
${input.availableStaff.map((s) => s.role).join(", ") || "none available"}`;

  const data = await generateJSON<IncidentCommanderResult>(systemPrompt, userPrompt, SCHEMA, {
    model: MODELS.reasoning,
    temperature: 0.35,
  });

  return {
    data,
    meta: { source: "gemini", cached: false, generatedAt: new Date().toISOString(), confidence: data.confidence },
  };
}
