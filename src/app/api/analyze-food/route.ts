import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { imageBase64, mimeType } = await req.json() as { imageBase64: string; mimeType: string };

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY未設定" }, { status: 500 });
  }

  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `この食事の写真を分析してください。
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

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType, data: imageBase64 } },
    ]);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON parse failed");
    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
