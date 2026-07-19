import { generateText, MODELS } from "@/lib/ai/gemini";
import type { AiResult } from "@/lib/types/ai";

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  pt: "Portuguese",
  ar: "Arabic",
};

/**
 * Smart Stadium Assistant — grounded chat. Facts (seat/gate/match state,
 * recent chat_history) are fetched by the caller and passed in; this
 * module only turns facts + conversation into a reply. Kept as plain
 * text (not JSON) since the UI renders it directly and reveals it with
 * the streamText animation client-side.
 */
export interface AssistantFacts {
  context: "fan" | "ops";
  language: string;
  facts: Record<string, unknown>;
  history: { role: "user" | "assistant"; message: string }[];
  message: string;
}

export async function askAssistant(input: AssistantFacts): Promise<AiResult<{ reply: string }>> {
  const languageName = LANGUAGE_MAP[input.language] || "English";
  const systemPrompt = `You are the official AI Stadium Assistant for FIFA Smart Stadium AI, currently helping a ${
    input.context === "fan" ? "fan attending the match" : "stadium operations staff member"
  }.

Rules:
- Only use the facts provided below. If something isn't in the facts, say you don't have that information — never invent stadium details.
- Be concise: 1-3 sentences unless the question needs a list.
- When you make a recommendation (not just stating a fact), make it clear it's a suggestion, not certainty.
- IMPORTANT: You MUST respond ONLY in ${languageName}. Every word must be in ${languageName}.

Current facts (JSON):
${JSON.stringify(input.facts, null, 2)}`;

  const conversation = input.history
    .map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.message}`)
    .join("\n");
  const userPrompt = `${conversation ? conversation + "\n" : ""}User: ${input.message}`;

  const reply = await generateText(systemPrompt, userPrompt, { model: MODELS.fast, temperature: 0.6 });

  return {
    data: { reply },
    meta: { source: "gemini", cached: false, generatedAt: new Date().toISOString() },
  };
}
