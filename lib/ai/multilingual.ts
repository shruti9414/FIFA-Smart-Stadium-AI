import { generateText, MODELS } from "@/lib/ai/gemini";
import type { AiResult } from "@/lib/types/ai";

/** Multilingual Assistance — thin transformation wrapper, kept separate so assistant.ts stays single-responsibility. */
export interface TranslateFacts {
  text: string;
  targetLanguage: string;
}

export async function translate(input: TranslateFacts): Promise<AiResult<{ text: string }>> {
  const systemPrompt = `Translate the given text into ${input.targetLanguage}. Keep names, gate numbers, and section numbers exactly as they are. Output ONLY the translated text, nothing else.`;
  const text = await generateText(systemPrompt, input.text, { model: MODELS.fast, temperature: 0.2 });

  return {
    data: { text: text.trim() },
    meta: { source: "gemini", cached: false, generatedAt: new Date().toISOString() },
  };
}
