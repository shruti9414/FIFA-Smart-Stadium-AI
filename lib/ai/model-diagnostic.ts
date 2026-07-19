import { GoogleGenAI } from "@google/genai";
import { getEnv } from "@/lib/env";

const MODELS_TO_TEST = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
  "gemini-pro",
  "gemini-pro-vision",
  "models/gemini-2.0-flash",
  "models/gemini-1.5-flash",
  "models/gemini-1.5-pro",
  "models/gemini-1.0-pro",
  "models/gemini-pro",
  "gemini-2-flash-exp-04-15",
  "gemini-exp-1202",
];

export async function diagnoseAvailableModels(): Promise<string[]> {
  const { GEMINI_API_KEY } = getEnv();
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not set");
  }

  const client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const workingModels: string[] = [];

  process.stdout.write("[diagnostic] Testing Gemini models...\n");

  for (const model of MODELS_TO_TEST) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: "Say 'working' in one word only.",
        config: { temperature: 0.1 },
      });

      if (response.text) {
        workingModels.push(model);
        process.stdout.write(`[diagnostic] OK   ${model}\n`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      process.stdout.write(`[diagnostic] FAIL ${model} - ${message.slice(0, 80)}\n`);
    }
  }

  return workingModels;
}
