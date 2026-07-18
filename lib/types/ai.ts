/**
 * Shared structural types for the intelligence layer (lib/ai/*). Every
 * Gemini-backed feature returns a payload matching this envelope so the
 * UI's `meta.source/cached` badge pattern (§5 of the design blueprint) is
 * consistent everywhere an AI output is rendered.
 */
export interface AiMeta {
  source: "gemini" | "grok";
  cached: boolean;
  generatedAt: string;
  /** 0-100. Omitted for pure Q&A/translation output that isn't a recommendation. */
  confidence?: number;
}

export interface AiResult<T> {
  data: T;
  meta: AiMeta;
}

/** Shared shape for the AIReasoningCard pattern (§9.7) — confidence + explainable facts + a recommendation. */
export interface AiRecommendation {
  title: string;
  rationale: string;
  confidence: number;
  affectedFacts: string[];
  priority?: 1 | 2 | 3;
}
