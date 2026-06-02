import { NextRequest, NextResponse } from "next/server";

interface MealItem {
  type?: string;
  name?: string;
  kcal?: number;
  p?: number;
  f?: number;
  c?: number;
}

interface RequestBody {
  record: {
    date?: string;
    weight?: number;
    meals?: MealItem[];
    persona?: string;
    focus?: string[];
  };
}

function buildContext(record: RequestBody["record"]): string {
  const lines: string[] = [];
  if (record.date) lines.push(`日付: ${record.date}`);
  if (record.weight) lines.push(`体重: ${record.weight} kg`);
  if (record.persona) lines.push(`AIペルソナ: ${record.persona}`);
  if (record.focus?.length) lines.push(`重点テーマ: ${record.focus.join(", ")}`);

  if (record.meals?.length) {
    lines.push("\n食事内容:");
    for (const m of record.meals) {
      const line = `${m.type ?? ""}: ${m.name ?? ""} (${m.kcal ?? 0}kcal, P:${m.p ?? 0}g F:${m.f ?? 0}g C:${m.c ?? 0}g)`;
      lines.push(line);
    }
    const total = record.meals.reduce((s, m) => s + (m.kcal ?? 0), 0);
    lines.push(`\n合計カロリー: ${total} kcal`);
  }

  return lines.join("\n");
}

const SYSTEM_PROMPT = `あなたはダイエットアドバイザーです。ユーザーの1日の記録を見て、以下の観点で日本語で簡潔にアドバイスしてください：
- 食事バランス（栄養の偏りや不足）
- カロリーの過不足
- 体重変化に関する一言（記録がある場合）
- 明日以降の改善提案を1〜2点

300文字以内で、親しみやすいトーンで答えてください。絵文字を適度に使ってください。`;

async function callClaude(record: RequestBody["record"]): Promise<string> {
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

async function callGemini(record: RequestBody["record"]): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const result = await model.generateContent(
    `${SYSTEM_PROMPT}\n\n---\n${buildContext(record)}`
  );
  return result.response.text();
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RequestBody;
  const { record } = body;

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
    return NextResponse.json({ comment: "APIキーが設定されていません。" });
  }

  return NextResponse.json({ comment });
}
