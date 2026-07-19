import { generateJSON, MODELS } from "@/lib/ai/gemini";
import type { AiResult, AiRecommendation } from "@/lib/types/ai";

/**
 * Operational Recommendations — the flagship multi-fact reasoning
 * showcase feeding Mission Control's recommendation feed. Fuses gates,
 * parking, food, incidents, and staff into a small set of prioritized,
 * explainable actions.
 */
export interface OpsSnapshotFacts {
  gates: { name: string; densityPct: number; status: string; queueEstimate: number }[];
  parking: { lotName: string; occupancyPct: number; status: string }[];
  foodStalls: { name: string; waitTimeMin: number }[];
  incidents: { id: number; type: string; severity: string; status: string; locationDesc: string }[];
  staff: { role: string; status: string }[];
}

export interface OpsRecommendationsResult {
  recommendations: AiRecommendation[];
}

const SCHEMA = {
  type: "OBJECT",
  properties: {
    recommendations: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING", description: "Short imperative action, e.g. 'Reopen Gate 4B'" },
          rationale: { type: "STRING", description: "1-2 sentences explaining why, referencing the specific facts" },
          confidence: { type: "NUMBER" },
          affectedFacts: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "Short fact labels that drove this recommendation, e.g. 'Gate 4: 91% density', 'Incident #22: active'",
          },
          priority: { type: "NUMBER", description: "1 = highest priority, 3 = lowest" },
        },
        required: ["title", "rationale", "confidence", "affectedFacts", "priority"],
      },
    },
  },
  required: ["recommendations"],
};

export async function getOpsRecommendations(input: OpsSnapshotFacts): Promise<AiResult<OpsRecommendationsResult>> {
  const systemPrompt = `You are the Operational Recommendations engine for a live FIFA World Cup stadium's Mission Control. You are given the FULL current operational snapshot — every gate, parking lot, food stall, active incident, and staff member. Correlate MULTIPLE facts together (not single-fact lookups) to produce up to 3 prioritized, specific, actionable recommendations a human operator would actually approve. Only recommend actions grounded in the provided data — never invent facts. Each recommendation's affectedFacts must cite the exact data points that justify it. If nothing needs attention, return an empty recommendations array rather than inventing busywork.`;

  const userPrompt = `GATES:
${input.gates.map((g) => `- ${g.name}: ${g.densityPct}% density, status=${g.status}, queue=${g.queueEstimate}`).join("\n")}

PARKING:
${input.parking.map((p) => `- ${p.lotName}: ${p.occupancyPct}% full, status=${p.status}`).join("\n")}

FOOD STALLS (only listing notable wait times):
${input.foodStalls.filter((f) => f.waitTimeMin >= 10).map((f) => `- ${f.name}: ${f.waitTimeMin} min wait`).join("\n") || "- none with significant waits"}

ACTIVE INCIDENTS:
${input.incidents.length ? input.incidents.map((i) => `- #${i.id} ${i.type} (${i.severity}, ${i.status}) at ${i.locationDesc}`).join("\n") : "- none active"}

STAFF:
${input.staff.map((s) => `- ${s.role}: ${s.status}`).join("\n")}`;

  const data = await generateJSON<OpsRecommendationsResult>(systemPrompt, userPrompt, SCHEMA, {
    model: MODELS.reasoning,
    temperature: 0.4,
  });

  return {
    data,
    meta: { source: "gemini", cached: false, generatedAt: new Date().toISOString() },
  };
}
