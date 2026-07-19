import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("getEnv", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns default values when env vars are missing", async () => {
    process.env = { NODE_ENV: "test" };
    const { getEnv } = await import("@/lib/env");
    const env = getEnv();
    expect(env.DB_HOST).toBe("localhost");
    expect(env.DB_PORT).toBe(3306);
    expect(env.DB_USER).toBe("root");
    expect(env.DB_NAME).toBe("fifa_smart_stadium");
    expect(env.SOCKET_PORT).toBe(3000);
  });

  it("reads DB_PORT as a number even when provided as string", async () => {
    process.env = { NODE_ENV: "test", DB_PORT: "5432" };
    const { getEnv } = await import("@/lib/env");
    const env = getEnv();
    expect(env.DB_PORT).toBe(5432);
    expect(typeof env.DB_PORT).toBe("number");
  });

  it("reads SOCKET_PORT as a number", async () => {
    process.env = { NODE_ENV: "test", SOCKET_PORT: "8080" };
    const { getEnv } = await import("@/lib/env");
    const env = getEnv();
    expect(env.SOCKET_PORT).toBe(8080);
  });

  it("GEMINI_API_KEY is optional", async () => {
    process.env = { NODE_ENV: "test" };
    const { getEnv } = await import("@/lib/env");
    const env = getEnv();
    expect(env.GEMINI_API_KEY).toBeUndefined();
  });

  it("GEMINI_API_KEY is read when set", async () => {
    process.env = { NODE_ENV: "test", GEMINI_API_KEY: "my-key-123" };
    const { getEnv } = await import("@/lib/env");
    const env = getEnv();
    expect(env.GEMINI_API_KEY).toBe("my-key-123");
  });

  it("caches the result across calls", async () => {
    process.env = { NODE_ENV: "test" };
    const { getEnv } = await import("@/lib/env");
    const env1 = getEnv();
    const env2 = getEnv();
    expect(env1).toBe(env2);
  });

  it("accepts production NODE_ENV", async () => {
    process.env = { NODE_ENV: "production" };
    const { getEnv } = await import("@/lib/env");
    const env = getEnv();
    expect(env.NODE_ENV).toBe("production");
  });
});
