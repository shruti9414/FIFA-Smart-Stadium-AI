import { generateJSON, MODELS } from "@/lib/ai/gemini";
import type { AiResult } from "@/lib/types/ai";

/**
 * Emergency Decision Support — decision *support*, not autonomy; output
 * always reads as a recommendation to a human operator/fan.
 */
export interface EmergencyFacts {
  incidentType: string;
  severity: string;
  locationDesc: string;
  description: string;
  nearbyDensityPct: number | null;
  nearbyGates: { name: string; status: string }[];
  availableStaff: { role: string }[];
}

export interface EmergencyDecisionResult {
  immediateActions: string[];
  recommendedUnit: string | null;
  recommendedExitClosures: string[];
  rationale: string;
  evacuationNeeded: boolean;
  confidence: number;
}

const SCHEMA = {
  type: "OBJECT",
  properties: {
    immediateActions: { type: "ARRAY", items: { type: "STRING" } },
    recommendedUnit: { type: "STRING", nullable: true },
    recommendedExitClosures: { type: "ARRAY", items: { type: "STRING" } },
    rationale: { type: "STRING" },
    evacuationNeeded: { type: "BOOLEAN" },
    confidence: { type: "NUMBER" },
  },
  required: ["immediateActions", "recommendedExitClosures", "rationale", "evacuationNeeded", "confidence"],
};

export async function getEmergencyDecisionSupport(input: EmergencyFacts): Promise<AiResult<EmergencyDecisionResult>> {
  const systemPrompt = `You are assisting human commanders with emergency decision support at a FIFA World Cup stadium. You are NOT replacing human judgment — every action you propose is a recommendation for a human to approve. Default to the safest option given the data. Never recommend routing people through a congested or closed gate. Only recommend evacuation if severity is high/critical AND the situation type warrants it (fire, security threat, structural) — not for routine medical incidents.`;

  const userPrompt = `Incident: ${input.incidentType} (severity: ${input.severity})
Location: ${input.locationDesc}
Description: ${input.description}
Nearby crowd density: ${input.nearbyDensityPct ?? "unknown"}%
Nearby gates: ${input.nearbyGates.map((g) => `${g.name} (${g.status})`).join(", ") || "none listed"}
Available staff: ${input.availableStaff.map((s) => s.role).join(", ") || "none available"}`;

  const data = await generateJSON<EmergencyDecisionResult>(systemPrompt, userPrompt, SCHEMA, {
    model: MODELS.reasoning,
    temperature: 0.25,
  });

  return {
    data,
    meta: { source: "gemini", cached: false, generatedAt: new Date().toISOString(), confidence: data.confidence },
  };
}
