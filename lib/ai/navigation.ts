import { generateJSON, MODELS } from "@/lib/ai/grok";
import type { AiResult } from "@/lib/types/ai";

/** AI Navigation Guidance — routes a fan around live congestion, not just a static lookup. */
export interface NavigationFacts {
  destination: { type: "seat" | "gate" | "stall"; label: string };
  seatSection: string | null;
  gateDensities: { gateName: string; densityPct: number; status: string }[];
}

export interface NavigationResult {
  steps: string[];
  recommendedGate: string;
  etaMin: number;
  warning: string | null;
  confidence: number;
}

const SCHEMA = {
  type: "OBJECT",
  properties: {
    steps: { type: "ARRAY", items: { type: "STRING" } },
    recommendedGate: { type: "STRING" },
    etaMin: { type: "NUMBER" },
    warning: { type: "STRING", nullable: true },
    confidence: { type: "NUMBER", description: "0-100 confidence in this route recommendation" },
  },
  required: ["steps", "recommendedGate", "etaMin", "confidence"],
};

export async function getNavigationGuidance(input: NavigationFacts): Promise<AiResult<NavigationResult>> {
  const systemPrompt = `You are the AI Navigation Guidance engine for a FIFA World Cup stadium. Given a fan's destination and live gate congestion data, produce a short set of walking directions that explicitly routes around the most congested gates. Prefer a less-busy alternate gate over the "obvious" one when the density difference is meaningful (>20 points). Output 3-5 short steps. Set confidence lower if the density data is ambiguous or gates are similarly busy.`;

  const userPrompt = `Destination: ${input.destination.type} — ${input.destination.label}
Fan's section: ${input.seatSection ?? "unknown"}
Live gate density:
${input.gateDensities.map((g) => `- ${g.gateName}: ${g.densityPct}% (${g.status})`).join("\n")}`;

  const data = await generateJSON<NavigationResult>(systemPrompt, userPrompt, SCHEMA, {
    model: MODELS.fast,
    temperature: 0.3,
  });

  return {
    data,
    meta: { source: "grok", cached: false, generatedAt: new Date().toISOString(), confidence: data.confidence },
  };
}
