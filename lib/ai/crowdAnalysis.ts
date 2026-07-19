import { generateJSON, MODELS } from "@/lib/ai/gemini";
import type { AiResult } from "@/lib/types/ai";

/** Crowd Analysis — trend + risk projection over a density time window, not a single-point lookup. */
export interface CrowdAnalysisFacts {
  locationLabel: string;
  window: { densityPct: number; recordedAt: string }[];
}

export interface CrowdAnalysisResult {
  trend: "rising" | "falling" | "stable";
  riskLevel: "low" | "medium" | "high" | "critical";
  projection: string;
  recommendation: string;
  confidence: number;
}

const SCHEMA = {
  type: "OBJECT",
  properties: {
    trend: { type: "STRING", enum: ["rising", "falling", "stable"] },
    riskLevel: { type: "STRING", enum: ["low", "medium", "high", "critical"] },
    projection: { type: "STRING", description: "One sentence projecting where this is headed in the next 10-15 minutes" },
    recommendation: { type: "STRING", description: "One concrete, actionable recommendation" },
    confidence: { type: "NUMBER" },
  },
  required: ["trend", "riskLevel", "projection", "recommendation", "confidence"],
};

export async function analyzeCrowd(input: CrowdAnalysisFacts): Promise<AiResult<CrowdAnalysisResult>> {
  const systemPrompt = `You are the Crowd Analysis engine for stadium operations. You are given a time-series of density readings (not a single snapshot) for one location. Identify the trend, classify risk (low <40%, medium 40-70%, high 70-85%, critical >85%, adjusted for trend velocity), and give a short projection of where this is headed. Recommend one specific operational action appropriate to the risk level.`;

  const userPrompt = `Location: ${input.locationLabel}
Density readings over time (oldest to newest):
${input.window.map((w) => `${w.recordedAt}: ${w.densityPct}%`).join("\n")}`;

  const data = await generateJSON<CrowdAnalysisResult>(systemPrompt, userPrompt, SCHEMA, {
    model: MODELS.reasoning,
    temperature: 0.3,
  });

  return {
    data,
    meta: { source: "gemini", cached: false, generatedAt: new Date().toISOString(), confidence: data.confidence },
  };
}
