"use client";

import { useState } from "react";
import { StoreResult } from "@/lib/store";

const PERSONA_META: Record<string, { emoji: string; label: string }> = {
  coach:   { emoji: "🌱", label: "優しいコーチ" },
  spartan: { emoji: "🔥", label: "厳しいトレーナー" },
  friend:  { emoji: "🙌", label: "友だち" },
  expert:  { emoji: "📊", label: "データ専門家" },
};

const FOCUS_LABELS: Record<string, string> = {
  fat: "脂質を減らす", protein: "タンパク質を増やす",
  snack: "間食を控える", exercise: "運動の提案", plateau: "停滞期の対策",
};

interface AIResult {
  greet: string;
  summary: string;
  score: number;
  pts: { good: boolean; text: string }[];
}

export default function AIPage({ store, showToast }: { store: StoreResult; showToast: (m: string) => void }) {
  const { state, consumed, macros } = store;
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState("");

  const persona = PERSONA_META[state.persona] ?? PERSONA_META.coach;
  const focusStr = state.focus.map((f) => FOCUS_LABELS[f] ?? f).join(" / ") || "未設定";

  const handleAnalyze = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/ai-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          record: {
            date: new Date().toISOString().slice(0, 10),
            weight: state.weight,
            target: state.target,
            meals: state.meals,
            totalKcal: consumed,
            calTarget: state.calTarget,
            macros,
            persona: state.persona,
            focus: state.focus,
          },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Try to parse structured JSON from AI response
      const raw: string = data.comment ?? "";
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as AIResult;
          setResult(parsed);
        } else {
          // Plain text fallback
          setResult({
            greet: "分析が完了しました",
            summary: raw,
            score: 75,
            pts: [],
          });
        }
      } catch {
        setResult({
          greet: "分析が完了しました",
          summary: raw,
          score: 75,
          pts: [],
        });
      }
      showToast("✨ AI分析が完了しました");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "エラーが発生しました";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: "0 18px", paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ paddingTop: 22, paddingBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>{persona.emoji}</span>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#243B53" }}>AIコーチ</h1>
        </div>
        {result && (
          <button onClick={handleAnalyze} disabled={busy}
            style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "#fff", cursor: busy ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(61,155,255,0.18)", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {busy ? "⏳" : "🔄"}
          </button>
        )}
      </div>

      {/* Main card */}
      <div style={{ background: "#fff", borderRadius: 26, padding: 20, boxShadow: "0 10px 30px rgba(61,155,255,0.10)", minHeight: 200, marginBottom: 16 }}>
        {busy ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
              <span className="dot" style={{ animationDelay: "0s" }} />
              <span className="dot" style={{ animationDelay: "0.18s" }} />
              <span className="dot" style={{ animationDelay: "0.36s" }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#8AA0B8" }}>記録を分析しています…</div>
          </div>
        ) : result ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 84, height: 84, borderRadius: "50%", margin: "0 auto 12px", background: "linear-gradient(135deg,#4EA6FF,#3D7BFF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, boxShadow: "0 8px 20px rgba(61,123,255,0.30)" }}>
              {persona.emoji}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#243B53", marginBottom: 8 }}>{result.greet}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#FFF6E0", color: "#E0962B", borderRadius: 999, padding: "4px 14px", fontSize: 13, fontWeight: 800, marginBottom: 14 }}>
              ⭐ 総合スコア {result.score}点 · {persona.label}
            </div>
            <div style={{ position: "relative", background: "#F0F7FF", borderRadius: 20, padding: "14px 16px", textAlign: "left" }}>
              <div style={{ position: "absolute", top: -8, left: 30, width: 16, height: 16, background: "#F0F7FF", transform: "rotate(45deg)" }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: "#243B53", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{result.summary}</p>
            </div>
          </div>
        ) : (
          /* Initial state - CTA */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 0", gap: 12 }}>
            <div style={{ width: 84, height: 84, borderRadius: "50%", background: "linear-gradient(135deg,#4EA6FF,#3D7BFF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, boxShadow: "0 8px 20px rgba(61,123,255,0.30)", marginBottom: 4 }}>
              {persona.emoji}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#243B53" }}>今日の記録をAIが分析します</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#8AA0B8", textAlign: "center", lineHeight: 1.6 }}>
              体重・食事を記録してから<br />下のボタンで分析してもらいましょう
            </div>
            {error && (
              <div style={{ background: "#FFF0F0", borderRadius: 12, padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#FF6B6B", width: "100%", marginTop: 4 }}>
                ❌ {error}
              </div>
            )}
          </div>
        )}

        {error && result && (
          <div style={{ background: "#FFF0F0", borderRadius: 12, padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#FF6B6B", marginTop: 12 }}>
            ❌ {error}
          </div>
        )}
      </div>

      {/* Improvement points */}
      {result && result.pts.length > 0 && (
        <>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#243B53", marginBottom: 10 }}>こうするともっと◎</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {result.pts.map((pt, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 14px rgba(61,155,255,0.08)" }}>
                <div style={{ width: 34, height: 34, borderRadius: 12, background: pt.good ? "#E2FBF4" : "#FFF0E2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
                  {pt.good ? "💪" : "💡"}
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "#243B53", lineHeight: 1.5 }}>{pt.text}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Analyze button (shown when no result yet) */}
      {!result && !busy && (
        <button onClick={handleAnalyze}
          style={{ width: "100%", height: 56, borderRadius: 18, border: "none", background: "linear-gradient(135deg,#4EA6FF,#3D7BFF)", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 24px rgba(61,123,255,0.35)", marginBottom: 16 }}>
          ✨ AIに分析してもらう
        </button>
      )}

      {/* Focus & current summary */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "14px 16px", boxShadow: "0 4px 14px rgba(61,155,255,0.08)", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#243B53", marginBottom: 6 }}>🎯 重点テーマ</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#8AA0B8" }}>{focusStr}</div>
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: "14px 16px", boxShadow: "0 4px 14px rgba(61,155,255,0.08)" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#243B53", marginBottom: 8 }}>📊 今日のサマリー</div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8AA0B8" }}>体重</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#243B53", fontVariantNumeric: "tabular-nums" }}>{state.weight.toFixed(1)}<span style={{ fontSize: 12 }}>kg</span></div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8AA0B8" }}>摂取kcal</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#3D9BFF", fontVariantNumeric: "tabular-nums" }}>{consumed.toLocaleString()}</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8AA0B8" }}>目標kcal</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#243B53", fontVariantNumeric: "tabular-nums" }}>{state.calTarget.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
