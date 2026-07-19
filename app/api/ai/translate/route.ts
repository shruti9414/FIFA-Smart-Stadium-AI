import { NextResponse } from "next/server";
import { translate } from "@/lib/ai/multilingual";
import { isGeminiConfigured } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: "Translation is temporarily unavailable." }, { status: 503 });
  }
  const { text, targetLanguage } = await req.json();
  const result = await translate({ text, targetLanguage });
  return NextResponse.json(result);
}
