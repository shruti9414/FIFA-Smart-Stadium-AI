import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted ensures these are available inside the vi.mock() factory (which is hoisted above imports)
const mockGenerateContent = vi.hoisted(() => vi.fn());

vi.mock("@/lib/env", () => ({
  getEnv: vi.fn(() => ({
    NODE_ENV: "test",
    GEMINI_API_KEY: "placeholder-for-testing",
    GROK_API_KEY: undefined,
    DB_HOST: "localhost",
    DB_PORT: 3306,
    DB_USER: "root",
    DB_PASSWORD: "",
    DB_NAME: "test_db",
    SOCKET_PORT: 3000,
    NEXT_PUBLIC_SOCKET_URL: "http://localhost:3000",
  })),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: function MockGoogleGenAI() {
    return { models: { generateContent: mockGenerateContent } };
  },
}));

describe("gemini module", () => {
  beforeEach(() => {
    vi.resetModules();
    mockGenerateContent.mockReset();
  });

  describe("isGeminiConfigured", () => {
    it("returns true when GEMINI_API_KEY is set", async () => {
      const { isGeminiConfigured } = await import("@/lib/ai/gemini");
      expect(isGeminiConfigured()).toBe(true);
    });

    it("returns false when GEMINI_API_KEY is not set", async () => {
      const { getEnv } = await import("@/lib/env");
      vi.mocked(getEnv).mockReturnValueOnce({
        NODE_ENV: "test",
        GEMINI_API_KEY: undefined,
        GROK_API_KEY: undefined,
        DB_HOST: "localhost",
        DB_PORT: 3306,
        DB_USER: "root",
        DB_PASSWORD: "",
        DB_NAME: "test_db",
        SOCKET_PORT: 3000,
        NEXT_PUBLIC_SOCKET_URL: "http://localhost:3000",
      });
      const { isGeminiConfigured } = await import("@/lib/ai/gemini");
      expect(isGeminiConfigured()).toBe(false);
    });
  });

  describe("generateText", () => {
    it("returns trimmed text from the model", async () => {
      mockGenerateContent.mockResolvedValue({ text: "  Generated response text  " });
      const { generateText } = await import("@/lib/ai/gemini");
      const result = await generateText("You are a helpful assistant.", "Hello");
      expect(result).toBe("Generated response text");
    });

    it("throws when model returns empty response", async () => {
      mockGenerateContent.mockResolvedValue({ text: "" });
      const { generateText } = await import("@/lib/ai/gemini");
      await expect(generateText("System", "User")).rejects.toThrow("Gemini API unreachable");
    });

    it("calls generateContent with correct model and config", async () => {
      mockGenerateContent.mockResolvedValue({ text: "ok" });
      const { generateText } = await import("@/lib/ai/gemini");
      await generateText("System prompt", "User message");
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          contents: "User message",
          config: expect.objectContaining({ systemInstruction: "System prompt" }),
        })
      );
    });

    it("throws after all retries exhausted", async () => {
      mockGenerateContent.mockRejectedValue(new Error("503 service unavailable"));
      const { generateText } = await import("@/lib/ai/gemini");
      await expect(generateText("System", "User")).rejects.toThrow("Gemini API unreachable");
    });
  });

  describe("generateJSON", () => {
    it("parses and returns valid JSON from model", async () => {
      const payload = { score: 95, label: "excellent" };
      mockGenerateContent.mockResolvedValue({ text: JSON.stringify(payload) });
      const { generateJSON } = await import("@/lib/ai/gemini");
      const result = await generateJSON<typeof payload>("System", "User", {});
      expect(result).toEqual(payload);
    });

    it("throws on invalid JSON from model", async () => {
      mockGenerateContent.mockResolvedValue({ text: "not json at all" });
      const { generateJSON } = await import("@/lib/ai/gemini");
      await expect(generateJSON("System", "User", {})).rejects.toThrow("Gemini API unreachable");
    });

    it("throws on empty response", async () => {
      mockGenerateContent.mockResolvedValue({ text: "" });
      const { generateJSON } = await import("@/lib/ai/gemini");
      await expect(generateJSON("System", "User", {})).rejects.toThrow("Gemini API unreachable");
    });
  });
});
