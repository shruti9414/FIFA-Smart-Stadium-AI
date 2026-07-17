import { NextResponse } from "next/server";
import { translate } from "@/lib/ai/multilingual";
import { isGrokConfigured } from "@/lib/ai/grok";

export async function POST(req: Request) {
  if (!isGrokConfigured()) {
    return NextResponse.json({ error: "Translation is temporarily unavailable." }, { status: 503 });
  }
  const { text, targetLanguage } = await req.json();
  const result = await translate({ text, targetLanguage });
  return NextResponse.json(result);
}
