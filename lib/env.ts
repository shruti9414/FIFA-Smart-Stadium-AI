import { z } from "zod";

/**
 * Central env access. DB_* and GROK_API_KEY are optional at the schema
 * level on purpose — the foundation must boot even before a database or
 * an API key exists. Each integration layer (db/pool, ai/grok) is
 * responsible for throwing a clear, scoped error the first time it's
 * actually used without its required config, not at import time.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default("root"),
  DB_PASSWORD: z.string().default(""),
  DB_NAME: z.string().default("fifa_smart_stadium"),

  GROK_API_KEY: z.string().optional(),

  SOCKET_PORT: z.coerce.number().default(3000),
  NEXT_PUBLIC_SOCKET_URL: z.string().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
  }
  cached = parsed.data;
  return cached;
}
