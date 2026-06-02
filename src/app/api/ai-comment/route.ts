import { NextRequest, NextResponse } from "next/server";
import { DailyRecord } from "@/types/diet";

function buildContext(record: DailyRecord): string {
  const lines: string[] = [`日付: ${record.date}`];

  if (record.weight) lines.push(`体重: ${record.weight} kg`);

  const meals = [
    { label: "朝食", meal: record.breakfast },
    { label: "昼食", meal: record.lunch },
    { label: "夕食", meal: record.dinner },
    { label: "間食", meal: record.snack },
  ];

  const mealLines = meals
    .filter((m) => m.meal?.description)
    .map((m) => {
      const cal = m.meal!.calories ? ` (${m.meal!.calories} kcal)` : "";
      return `${m.label}: ${m.meal!.description}${cal}`;
    });

  if (mealLines.length > 0) {
    lines.push("\n食事内容:", ...mealLines);
  }

  const totalCal =
    (record.breakfast?.calories ?? 0) +
    (record.lunch?.calories ?? 0) +
    (record.dinner?.calories ?? 0) +
    (record.snack?.calories ?? 0);

  if (totalCal > 0) lines.push(`\n合計カロリー: ${totalCal} kcal`);

  return lines.join("\n");
}

const SYSTEM_PROMPT = `あなたはダイエットアドバイザーです。ユーザーの1日の記録を見て、以下の観点で日本語で簡潔にアドバイスしてください：
- 食事バランス（栄養の偏りや不足）
- カロリーの過不足
- 体重変化に関する一言（記録がある場合）
- 明日以降の改善提案を1〜2点

300文字以内で、親しみやすいトーンで答えてください。絵文字を適度に使ってください。`;

async function callClaude(record: DailyRecord): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildContext(record) }],
  });

  return msg.content[0].type === "text" ? msg.content[0].text : "";
}

async function callGemini(record: DailyRecord): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const result = await model.generateContent(
    `${SYSTEM_PROMPT}\n\n---\n${buildContext(record)}`
  );
  return result.response.text();
}

export async function POST(req: NextRequest) {
  const { record } = (await req.json()) as { record: DailyRecord };

  let comment = "";

  if (process.env.GEMINI_API_KEY) {
    try {
      comment = await callGemini(record);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return NextResponse.json({ comment: `❌ Gemini APIエラー: ${msg}` }, { status: 200 });
    }
  } else if (process.env.ANTHROPIC_API_KEY) {
    try {
      comment = await callClaude(record);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return NextResponse.json({ comment: `❌ Claude APIエラー: ${msg}` }, { status: 200 });
    }
  } else {
    return NextResponse.json({ comment: "APIキーが設定されていません。VercelのEnvironment VariablesにGEMINI_API_KEYを設定してください。" });
  }

  return NextResponse.json({ comment });
}
