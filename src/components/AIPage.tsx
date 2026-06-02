"use client";

import { useState } from "react";
import { StoreResult } from "@/lib/store";

const AI_CONTENT = {
  coach: {
    emoji: "🏋️",
    greet: "よくがんばってますね！",
    summary: "今日は朝・昼・間食と3食記録できています。カロリーは950kcalで目標の1800kcalに対してまだ余裕があります。夕食でしっかりタンパク質を摂りましょう！",
    pts: [
      { good: true, text: "朝食でアボカドからの良質な脂質が摂れています 💪" },
      { good: true, text: "昼食のサラダチキンでタンパク質38gを確保！" },
      { good: false, text: "間食の頻度が少し多めです。夕方の空腹対策を考えましょう 💡" },
      { good: false, text: "野菜・食物繊維がやや不足気味。夕食に野菜を意識して 💡" },
    ],
  },
  spartan: {
    emoji: "⚔️",
    greet: "まだまだ甘い！もっとやれる！",
    summary: "カロリーは950kcal。目標まで850kcal残っている。夕食を抜くな。間食は必要か？タンパク質優先で残りを埋めろ。",
    pts: [
      { good: true, text: "朝食・昼食は合格。継続しろ 💪" },
      { good: true, text: "チキンボウルのP38gは評価する" },
      { good: false, text: "ヨーグルト間食、本当に必要か？ 💡" },
      { good: false, text: "夕食抜きは絶対NG。筋肉が落ちるぞ 💡" },
    ],
  },
  friend: {
    emoji: "😊",
    greet: "えらい！今日もちゃんと記録してるね〜！",
    summary: "朝からアボカドトーストなんておしゃれ✨ サラダチキンボウルも栄養バッチリ！今日は夕ごはんでゆっくり体を作ろうね。",
    pts: [
      { good: true, text: "3食ちゃんと記録できてるの、すごく偉い！ 💪" },
      { good: true, text: "タンパク質けっこう摂れてるよ！この調子！" },
      { good: false, text: "間食ちょっと多めかも〜。お茶とかに変えてみてね 💡" },
      { good: false, text: "野菜もう少し足せると完璧！夕ごはんに意識してみて 💡" },
    ],
  },
  expert: {
    emoji: "🔬",
    greet: "本日の栄養摂取状況を分析します",
    summary: "摂取カロリー950kcal（目標比52.8%）。PFC比率はP28%/F31%/C41%で脂質がやや高め。BMI換算では現体重68.4kgに対し標準範囲内。夕食でC比率を下げた食事が推奨されます。",
    pts: [
      { good: true, text: "朝食の不飽和脂肪酸摂取は心血管リスク低減に寄与 💪" },
      { good: true, text: "昼食タンパク質38g：筋合成最適域を確保 💪" },
      { good: false, text: "脂質摂取31%：目標25%以下に抑制が望ましい 💡" },
      { good: false, text: "食物繊維推定8g：目標20g以上に増量が必要 💡" },
    ],
  },
};

const PERSONAS = [
  { id: "coach" as const, label: "コーチ" },
  { id: "spartan" as const, label: "スパルタ" },
  { id: "friend" as const, label: "友だち" },
  { id: "expert" as const, label: "専門家" },
];

export default function AIPage({ store, showToast }: { store: StoreResult; showToast: (m: string) => void }) {
  const { state } = store;
  const [busy, setBusy] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);

  const content = AI_CONTENT[state.persona];

  const handleReanalyze = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/ai-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          record: {
            date: new Date().toISOString().slice(0, 10),
            weight: state.weight,
            meals: state.meals,
            persona: state.persona,
            focus: state.focus,
          },
        }),
      });
      const data = await res.json();
      setAiText(data.comment ?? null);
    } catch {
      // fallback to static content after delay
    }
    setTimeout(() => setBusy(false), 1400);
  };

  const focusLabels: Record<string, string> = {
    fat: "脂質",
    protein: "タンパク質",
    snack: "間食",
    carb: "糖質",
    veggie: "野菜",
    sleep: "睡眠",
  };
  const focusStr = state.focus.map((f) => focusLabels[f] ?? f).join("/");

  return (
    <div style={{ padding: "0 18px", paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ paddingTop: 22, paddingBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>{content.emoji}</span>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#243B53" }}>AIコーチ</h1>
        </div>
        <button
          onClick={handleReanalyze}
          style={{
            width: 38, height: 38, borderRadius: "50%", border: "none",
            background: "#fff", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(61,155,255,0.18)",
            fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          🔄
        </button>
      </div>

      {/* Summary card */}
      <div style={{ background: "#fff", borderRadius: 26, padding: 20, boxShadow: "0 10px 30px rgba(61,155,255,0.10)", minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", marginBottom: 16 }}>
        {busy ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
              <span className="dot" style={{ animationDelay: "0s" }} />
              <span className="dot" style={{ animationDelay: "0.18s" }} />
              <span className="dot" style={{ animationDelay: "0.36s" }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#8AA0B8" }}>記録を分析しています…</div>
          </div>
        ) : (
          <>
            <div style={{
              width: 84, height: 84, borderRadius: "50%",
              background: "linear-gradient(135deg,#4EA6FF,#3D7BFF)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 42, marginBottom: 12,
              boxShadow: "0 8px 20px rgba(61,123,255,0.30)",
            }}>
              {content.emoji}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#243B53", marginBottom: 8 }}>{content.greet}</div>
            <div style={{ background: "#FFF6E0", color: "#E0962B", borderRadius: 999, padding: "4px 14px", fontSize: 13, fontWeight: 800, marginBottom: 12 }}>
              ⭐ 総合スコア 82点 · {PERSONAS.find((p) => p.id === state.persona)?.label}
            </div>
            <div style={{ position: "relative", background: "#F0F7FF", borderRadius: 20, padding: "14px 16px", width: "100%" }}>
              <div style={{
                position: "absolute", top: -8, left: 30,
                width: 16, height: 16, background: "#F0F7FF",
                transform: "rotate(45deg)",
              }} />
              <p style={{ fontSize: 14, fontWeight: 500, color: "#243B53", lineHeight: 1.6 }}>
                {aiText ?? content.summary}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Improvement points */}
      <div style={{ fontSize: 15, fontWeight: 800, color: "#243B53", marginBottom: 10 }}>こうするともっと◎</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {content.pts.map((pt, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 14px rgba(61,155,255,0.08)" }}>
            <div style={{
              width: 34, height: 34, borderRadius: 12,
              background: pt.good ? "#E2FBF4" : "#FFF0E2",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17, flexShrink: 0,
            }}>
              {pt.good ? "💪" : "💡"}
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "#243B53" }}>{pt.text}</span>
          </div>
        ))}
      </div>

      {/* Focus bar */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "12px 16px", boxShadow: "0 4px 14px rgba(61,155,255,0.08)", fontSize: 13, fontWeight: 800, color: "#243B53" }}>
        🎯 重点テーマ：{focusStr}
      </div>
    </div>
  );
}
