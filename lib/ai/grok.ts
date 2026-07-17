import { getEnv } from "@/lib/env";

const GROQ_API_BASE = "https://api.groq.com/openai/v1";

export const MODELS = {
  fast: "llama-3.1-8b-instant",
  reasoning: "llama-3.1-8b-instant",
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

        if (errorMsg.includes("404") || errorMsg.includes("not found")) {
          break;
        }

        if (errorMsg.includes("429")) {
          if (attempt < maxRetries) {
            const delayMs = Math.pow(2, attempt + 1) * 2000;
            await sleep(delayMs);
          }
        } else if (errorMsg.includes("PERMISSION_DENIED") || errorMsg.includes("401") || errorMsg.includes("403")) {
          break;
        } else {
          if (attempt < maxRetries) {
            const delayMs = Math.pow(2, attempt) * 500;
            await sleep(delayMs);
          }
        }
      }
    }
  }

  const failureReport = Object.entries(errors)
    .map(([model, err]) => `${model}: ${err.slice(0, 80)}`)
    .join(" | ");

  throw new Error(`Grok API unreachable: ${failureReport}`);
}

export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  opts: GenerateOptions = {}
): Promise<string> {
  const { GROK_API_KEY } = getEnv();
  if (!GROK_API_KEY) {
    throw new Error("GROK_API_KEY is not set. Add it to .env.local");
  }

  const model = opts.model || MODELS.fast;

  const result = await tryWithFallback([model], async (modelName) => {
    const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: opts.temperature ?? 0.6,
        max_tokens: 1024,
      }),
    });

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };

    if (!response.ok) {
      throw new Error(data.error?.message || JSON.stringify(data));
    }

    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error(`Empty response from Groq. Full response: ${JSON.stringify(data)}`);
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
  const { GROK_API_KEY } = getEnv();
  if (!GROK_API_KEY) {
    throw new Error("GROK_API_KEY is not set. Add it to .env.local");
  }

  const model = opts.model || MODELS.reasoning;
  const schemaStr = JSON.stringify(schema);

  const result = await tryWithFallback([model], async (modelName) => {
    const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: `${systemPrompt}\n\nRespond ONLY with valid JSON matching this schema:\n${schemaStr}` },
          { role: "user", content: userPrompt },
        ],
        temperature: opts.temperature ?? 0.4,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(JSON.stringify(errorData));
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Empty JSON response from Grok");

    try {
      JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON from Grok: ${text.slice(0, 100)}`);
    }

    return text;
  });

  return JSON.parse(result) as T;
}

export function isGrokConfigured(): boolean {
  return Boolean(getEnv().GROK_API_KEY);
}
