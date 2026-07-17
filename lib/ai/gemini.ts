import { GoogleGenAI } from "@google/genai";
import { getEnv } from "@/lib/env";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (client) return client;
  const { GEMINI_API_KEY } = getEnv();
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set. Add it to .env.local");
  }
  client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  return client;
}

// Model configuration: using models/gemini-2.0-flash with smart rate-limit handling
const MODEL_CHAIN = {
  fast: [
    "models/gemini-2.0-flash",      // Primary: Latest fast model
  ],
  reasoning: [
    "models/gemini-2.0-flash",      // Use same model for consistency
  ],
} as const;

export const MODELS = {
  fast: "models/gemini-2.0-flash",
  reasoning: "models/gemini-2.0-flash",
} as const;

export interface GenerateOptions {
  model?: string;
  temperature?: number;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryWithFallback<T>(
  models: readonly string[],
  fn: (model: string) => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error | null = null;
  const errors: Record<string, string> = {};

  for (const model of models) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(model);
      } catch (err) {
        lastError = err as Error;
        const errorMsg = lastError.message || String(lastError);
        errors[model] = errorMsg;

        // Handle different error types
        if (errorMsg.includes("404") || errorMsg.includes("not found")) {
          break; // Model not available - try next
        }

        if (errorMsg.includes("429")) {
          // Rate limit - retry with aggressive backoff
          if (attempt < maxRetries) {
            const delayMs = Math.pow(2, attempt + 1) * 2000; // 4s, 8s, 16s...
            await sleep(delayMs);
          }
        } else if (errorMsg.includes("PERMISSION_DENIED")) {
          break; // Key doesn't have access - try next model
        } else {
          // Other errors - retry with moderate backoff
          if (attempt < maxRetries) {
            const delayMs = Math.pow(2, attempt) * 500;
            await sleep(delayMs);
          }
        }
      }
    }
  }

  // Report failure
  const failureReport = Object.entries(errors)
    .map(([model, err]) => `${model}: ${err.slice(0, 80)}`)
    .join(" | ");

  throw new Error(`Gemini API unreachable: ${failureReport}`);
}

export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  opts: GenerateOptions = {}
): Promise<string> {
  const ai = getClient();
  const modelChain = opts.model ? [opts.model] : MODEL_CHAIN.fast;

  const result = await tryWithFallback(modelChain, async (model) => {
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: opts.temperature ?? 0.6,
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error("Empty response from model");
    return text;
  });

  return result;
}

export async function generateJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: Record<string, unknown>,
  opts: GenerateOptions = {}
): Promise<T> {
  const ai = getClient();
  const modelChain = opts.model ? [opts.model] : MODEL_CHAIN.reasoning;

  const jsonString = await tryWithFallback(modelChain, async (model) => {
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: opts.temperature ?? 0.4,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error("Empty JSON response from model");

    // Validate JSON
    try {
      JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON from model: ${text.slice(0, 100)}`);
    }

    return text;
  });

  return JSON.parse(jsonString) as T;
}

/** True once a key is configured — lets routes fail soft with a clear UI state instead of a 500. */
export function isGeminiConfigured(): boolean {
  return Boolean(getEnv().GEMINI_API_KEY);
}
