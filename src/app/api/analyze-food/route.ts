import { NextRequest, NextResponse } from "next/server";

const PROMPT = `この食事の写真を分析してください。
写真に写っている料理・食品を特定し、以下のJSONのみを返してください（他の文字は不要）:
{
  "name": "料理名（日本語、20文字以内）",
  "kcal": 推定カロリー（整数）,
  "p": 推定タンパク質g（整数）,
  "f": 推定脂質g（整数）,
  "c": 推定炭水化物g（整数）,
  "conf": 確度（0.0〜1.0）
}
食品が写っていない場合や判別困難な場合は conf を 0.3 以下にしてください。`;

function parseResult(text: string) {
  const jsonMatch = text.trim().match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("JSON parse failed");
  return JSON.parse(jsonMatch[0]);
}

async function analyzeWithGemini(imageBase64: string, mimeType: string) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY2 ?? process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    PROMPT,
    { inlineData: { mimeType, data: imageBase64 } },
  ]);
  return parseResult(result.response.text());
}

async function analyzeWithClaude(imageBase64: string, mimeType: string) {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: imageBase64 } },
        { type: "text", text: PROMPT },
      ],
    }],
  });
  const text = msg.content[0].type === "text" ? msg.content[0].text : "";
  return parseResult(text);
}

export async function POST(req: NextRequest) {
  const { imageBase64, mimeType } = await req.json() as { imageBase64: string; mimeType: string };

  // Try Gemini first, fall back to Claude on any error
  if (process.env.GEMINI_API_KEY2 ?? process.env.GEMINI_API_KEY) {
    try {
      const data = await analyzeWithGemini(imageBase64, mimeType);
      return NextResponse.json(data);
    } catch {
      // fall through to Claude
    }
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const data = await analyzeWithClaude(imageBase64, mimeType);
      return NextResponse.json(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "APIキーが設定されていません" }, { status: 500 });
}
