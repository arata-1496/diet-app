import { NextRequest, NextResponse } from "next/server";

interface MealItem {
  type?: string;
  name?: string;
  kcal?: number;
  p?: number;
  f?: number;
  c?: number;
}

interface RecordInput {
  date?: string;
  weight?: number;
  target?: number;
  meals?: MealItem[];
  totalKcal?: number;
  calTarget?: number;
  macros?: { p: number; f: number; c: number };
  persona?: string;
  focus?: string[];
}

const PERSONA_PROMPTS: Record<string, string> = {
  coach:   "あなたは優しく励ます応援型のダイエットコーチです。温かい言葉で背中を押してください。",
  spartan: "あなたは厳しく結果を追求するスパルタトレーナーです。甘えを許さず、辛口に直言してください。",
  friend:  "あなたはフレンドリーな友達です。タメ口で気軽に、明るくアドバイスしてください。",
  expert:  "あなたはデータ重視の栄養・運動の専門家です。数値を使って科学的・客観的に分析してください。",
};

const FOCUS_LABELS: Record<string, string> = {
  fat: "脂質を減らす", protein: "タンパク質を増やす",
  snack: "間食を控える", exercise: "運動の提案", plateau: "停滞期の対策",
};

function buildPrompt(record: RecordInput): string {
  const persona = record.persona ?? "coach";
  const personaInstruction = PERSONA_PROMPTS[persona] ?? PERSONA_PROMPTS.coach;
  const focusStr = record.focus?.length
    ? record.focus.map((f) => FOCUS_LABELS[f] ?? f).join("、")
    : "なし";

  const lines = [
    personaInstruction,
    "",
    "以下の今日のダイエット記録を分析し、JSON形式で回答してください。",
    "",
    "【今日の記録】",
  ];

  if (record.date) lines.push(`日付: ${record.date}`);
  if (record.weight) lines.push(`現在の体重: ${record.weight} kg`);
  if (record.target) lines.push(`目標体重: ${record.target} kg`);
  if (record.totalKcal != null) lines.push(`摂取カロリー合計: ${record.totalKcal} kcal`);
  if (record.calTarget) lines.push(`目標カロリー: ${record.calTarget} kcal`);
  if (record.macros) lines.push(`PFC: タンパク質${record.macros.p}g / 脂質${record.macros.f}g / 炭水化物${record.macros.c}g`);
  lines.push(`重点テーマ: ${focusStr}`);

  if (record.meals?.length) {
    lines.push("", "【食事】");
    for (const m of record.meals) {
      lines.push(`${m.type}: ${m.name} (${m.kcal ?? 0}kcal)`);
    }
  } else {
    lines.push("", "食事: 未記録");
  }

  lines.push(
    "",
    "【回答形式】以下のJSONのみを返してください（他の文字は不要）:",
    `{
  "greet": "一言挨拶（20文字以内）",
  "summary": "総評（150文字以内、ペルソナの口調で）",
  "score": 総合スコア（0〜100の整数）,
  "pts": [
    {"good": true, "text": "良かった点1（50文字以内）"},
    {"good": true, "text": "良かった点2（50文字以内）"},
    {"good": false, "text": "改善点1（50文字以内）"},
    {"good": false, "text": "改善点2（50文字以内）"}
  ]
}`
  );

  return lines.join("\n");
}

async function callGemini(prompt: string): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callClaude(prompt: string): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });
  return msg.content[0].type === "text" ? msg.content[0].text : "";
}

export async function POST(req: NextRequest) {
  const { record } = (await req.json()) as { record: RecordInput };
  const prompt = buildPrompt(record);

  // Try Gemini first, fall back to Claude on any error (e.g. 429 credits depleted)
  if (process.env.GEMINI_API_KEY) {
    try {
      const comment = await callGemini(prompt);
      return NextResponse.json({ comment });
    } catch (e) {
      const geminiErr = e instanceof Error ? e.message : String(e);
      // If no Claude fallback, return Gemini error for debugging
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json({ error: `Gemini error: ${geminiErr}` }, { status: 500 });
      }
    }
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const comment = await callClaude(prompt);
      return NextResponse.json({ comment });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "APIキーが設定されていません。Vercelの環境変数にANTHROPIC_API_KEYを設定してください。" });
}
