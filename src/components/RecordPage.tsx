"use client";

import { useState, useEffect, useCallback } from "react";
import { DailyRecord, MealEntry } from "@/types/diet";
import { saveRecord, getRecord, todayStr } from "@/lib/storage";

export default function RecordPage() {
  const [date, setDate] = useState(todayStr());
  const [weight, setWeight] = useState("");
  const [breakfast, setBreakfast] = useState<MealEntry>({ description: "" });
  const [lunch, setLunch] = useState<MealEntry>({ description: "" });
  const [dinner, setDinner] = useState<MealEntry>({ description: "" });
  const [snack, setSnack] = useState<MealEntry>({ description: "" });
  const [saved, setSaved] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiComment, setAiComment] = useState("");
  const [showSnack, setShowSnack] = useState(false);

  const loadDate = useCallback((d: string) => {
    const rec = getRecord(d);
    if (rec) {
      setWeight(rec.weight?.toString() ?? "");
      setBreakfast(rec.breakfast ?? { description: "" });
      setLunch(rec.lunch ?? { description: "" });
      setDinner(rec.dinner ?? { description: "" });
      setSnack(rec.snack ?? { description: "" });
      setAiComment(rec.aiComment ?? "");
      setShowSnack(!!rec.snack?.description);
    } else {
      setWeight("");
      setBreakfast({ description: "" });
      setLunch({ description: "" });
      setDinner({ description: "" });
      setSnack({ description: "" });
      setAiComment("");
      setShowSnack(false);
    }
    setSaved(false);
  }, []);

  useEffect(() => {
    loadDate(date);
  }, [date, loadDate]);

  const handleSave = () => {
    const rec: DailyRecord = {
      date,
      weight: weight ? parseFloat(weight) : undefined,
      breakfast: breakfast.description ? breakfast : undefined,
      lunch: lunch.description ? lunch : undefined,
      dinner: dinner.description ? dinner : undefined,
      snack: snack.description ? snack : undefined,
      aiComment,
    };
    saveRecord(rec);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAI = async () => {
    setAiLoading(true);
    try {
      const rec: DailyRecord = {
        date,
        weight: weight ? parseFloat(weight) : undefined,
        breakfast: breakfast.description ? breakfast : undefined,
        lunch: lunch.description ? lunch : undefined,
        dinner: dinner.description ? dinner : undefined,
        snack: snack.description ? snack : undefined,
      };
      const res = await fetch("/api/ai-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record: rec }),
      });
      const data = await res.json();
      const comment = data.comment ?? "コメントを取得できませんでした";
      setAiComment(comment);
      saveRecord({ ...rec, aiComment: comment, aiCommentedAt: new Date().toISOString() });
    } catch {
      setAiComment("エラーが発生しました。APIキーを確認してください。");
    }
    setAiLoading(false);
  };

  const formatDate = (d: string) => {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
  };

  const isToday = date === todayStr();

  return (
    <div style={{ padding: "0 16px" }}>
      {/* Header */}
      <div
        className="safe-top"
        style={{ paddingLeft: 4, paddingRight: 4, paddingBottom: 8 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>ダイエット記録</h1>
            <p style={{ fontSize: 15, color: "var(--ios-label2)", marginTop: 2 }}>{formatDate(date)}</p>
          </div>
          {!isToday && (
            <button
              onClick={() => setDate(todayStr())}
              style={{
                background: "rgba(0,122,255,0.18)",
                border: "none",
                borderRadius: 10,
                color: "var(--ios-blue)",
                padding: "6px 14px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              今日
            </button>
          )}
        </div>
        {/* Date picker */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            marginTop: 12,
            background: "rgba(118,118,128,0.12)",
            border: "none",
            borderRadius: 12,
            padding: "10px 14px",
            color: "var(--ios-label)",
            fontSize: 15,
            outline: "none",
            width: "100%",
            colorScheme: "dark",
          }}
        />
      </div>

      {/* Weight section */}
      <div style={{ marginBottom: 20 }}>
        <p className="section-label">体重</p>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>⚖️</span>
            <div style={{ flex: 1 }}>
              <input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="ios-input"
                style={{ fontSize: 28, fontWeight: 700, background: "transparent", padding: "0" }}
              />
            </div>
            <span style={{ fontSize: 18, color: "var(--ios-label2)", fontWeight: 500 }}>kg</span>
          </div>
        </div>
      </div>

      {/* Meals section */}
      <div style={{ marginBottom: 20 }}>
        <p className="section-label">食事</p>
        <div className="glass-card" style={{ overflow: "hidden" }}>
          <MealRow
            emoji="🌅"
            label="朝食"
            meal={breakfast}
            onChange={setBreakfast}
          />
          <div className="list-row" />
          <MealRow
            emoji="☀️"
            label="昼食"
            meal={lunch}
            onChange={setLunch}
          />
          <div className="list-row" />
          <MealRow
            emoji="🌙"
            label="夕食"
            meal={dinner}
            onChange={setDinner}
          />
          {showSnack && (
            <>
              <div className="list-row" />
              <MealRow
                emoji="🍎"
                label="間食"
                meal={snack}
                onChange={setSnack}
              />
            </>
          )}
        </div>
        {!showSnack && (
          <button
            onClick={() => setShowSnack(true)}
            style={{
              marginTop: 10,
              background: "none",
              border: "none",
              color: "var(--ios-blue)",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              padding: "4px 4px",
            }}
          >
            + 間食を追加
          </button>
        )}
      </div>

      {/* Save button */}
      <button className="ios-btn" onClick={handleSave} style={{ marginBottom: 12 }}>
        {saved ? "✅ 保存しました" : "保存する"}
      </button>

      {/* AI Analysis */}
      <div style={{ marginBottom: 20 }}>
        <p className="section-label">AI分析</p>
        <div className="glass-card" style={{ padding: 16 }}>
          {aiComment ? (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>🤖</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ios-blue)" }}>AIコメント</span>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ios-label)", whiteSpace: "pre-wrap" }}>
                {aiComment}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: 15, color: "var(--ios-label2)", marginBottom: 14 }}>
              今日の記録をAIが分析して、改善点をアドバイスします。
            </p>
          )}
          <button
            className="ios-btn"
            onClick={handleAI}
            disabled={aiLoading}
            style={{ background: aiComment ? "rgba(0,122,255,0.18)" : "var(--ios-blue)", color: aiComment ? "var(--ios-blue)" : "#fff" }}
          >
            {aiLoading ? "分析中..." : aiComment ? "再分析する" : "AIに分析してもらう"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MealRow({
  emoji,
  label,
  meal,
  onChange,
}: {
  emoji: string;
  label: string;
  meal: MealEntry;
  onChange: (m: MealEntry) => void;
}) {
  return (
    <div style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{emoji}</span>
        <span style={{ fontSize: 15, fontWeight: 600 }}>{label}</span>
      </div>
      <input
        type="text"
        placeholder="食べたものを入力"
        value={meal.description}
        onChange={(e) => onChange({ ...meal, description: e.target.value })}
        className="ios-input"
        style={{ marginBottom: 8 }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="number"
          placeholder="カロリー（任意）"
          value={meal.calories ?? ""}
          onChange={(e) => onChange({ ...meal, calories: e.target.value ? parseInt(e.target.value) : undefined })}
          className="ios-input"
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: 14, color: "var(--ios-label2)", whiteSpace: "nowrap" }}>kcal</span>
      </div>
    </div>
  );
}
