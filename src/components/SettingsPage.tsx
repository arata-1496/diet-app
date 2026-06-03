"use client";

import { StoreResult } from "@/lib/store";

const PERSONAS = [
  { id: "coach" as const, emoji: "🌱", label: "優しいコーチ", desc: "励ましながら導く" },
  { id: "spartan" as const, emoji: "🔥", label: "厳しいトレーナー", desc: "甘えを許さない" },
  { id: "friend" as const, emoji: "🙌", label: "友だち", desc: "気軽に話せる相棒" },
  { id: "expert" as const, emoji: "📊", label: "データ専門家", desc: "数値で淡々と分析" },
];

const FOCUS_OPTIONS = [
  { id: "fat", label: "脂質を減らす" },
  { id: "protein", label: "タンパク質を増やす" },
  { id: "snack", label: "間食を控える" },
  { id: "exercise", label: "運動の提案" },
  { id: "plateau", label: "停滞期の対策" },
];

function fmtDeadline(d: string) {
  if (!d) return "未設定";
  const dt = new Date(d + "T00:00:00");
  return `${dt.getMonth() + 1}月${dt.getDate()}日`;
}

export default function SettingsPage({ store, showToast }: { store: StoreResult; showToast: (m: string) => void }) {
  const { state, setTarget, setDeadline, setPersona, toggleFocus, reset } = store;

  const startKg = state.weightHistory[0]?.kg ?? state.weight;
  const progress = Math.round(Math.min(100, Math.max(0,
    startKg === state.target ? 0 : (startKg - state.weight) / (startKg - state.target) * 100
  )));
  const toGoal = Math.max(0, Math.round((state.weight - state.target) * 10) / 10);

  return (
    <div style={{ padding: "0 18px", paddingBottom: 32 }}>
      <div style={{ paddingTop: 22, paddingBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22 }}>⚙️</span>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#243B53" }}>せってい</h1>
      </div>

      {/* Goal card */}
      <div style={{
        background: "linear-gradient(135deg,#46D6B6,#2FB39A)",
        borderRadius: 26, padding: 20, color: "#fff", marginBottom: 16,
        boxShadow: "0 10px 30px rgba(70,214,182,0.25)",
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.9, marginBottom: 14 }}>🎯 わたしの目標</div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <button onClick={() => setTarget(Math.round((state.target - 0.5) * 10) / 10)}
            style={{ width: 40, height: 40, borderRadius: 13, border: "none", background: "rgba(255,255,255,0.25)", color: "#fff", fontSize: 22, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>−</button>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {state.target.toFixed(1)}<span style={{ fontSize: 16 }}>kg</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, marginTop: 2 }}>目標体重</div>
          </div>
          <button onClick={() => setTarget(Math.round((state.target + 0.5) * 10) / 10)}
            style={{ width: 40, height: 40, borderRadius: 13, border: "none", background: "rgba(255,255,255,0.25)", color: "#fff", fontSize: 22, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>＋</button>
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.35)", margin: "0 4px", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, marginBottom: 2 }}>いつまでに</div>
            <div style={{ fontSize: 20, fontWeight: 800, whiteSpace: "nowrap" }}>{fmtDeadline(state.deadline)}</div>
          </div>
        </div>

        {/* Deadline picker */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 800, opacity: 0.85, display: "block", marginBottom: 6 }}>期限を変更</label>
          <input
            type="date"
            value={state.deadline}
            onChange={(e) => { setDeadline(e.target.value); showToast("📅 期限を更新しました"); }}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 14, border: "none",
              background: "rgba(255,255,255,0.25)", color: "#fff",
              fontSize: 15, fontWeight: 700, outline: "none", colorScheme: "dark",
            }}
          />
        </div>

        <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 999, height: 8, marginBottom: 8, overflow: "hidden" }}>
          <div style={{ background: "#fff", borderRadius: 999, height: 8, width: `${progress}%`, transition: "width 0.4s" }} />
        </div>
        <div style={{ fontSize: 12, fontWeight: 800 }}>達成まで {progress}% ・ あと {toGoal}kg</div>
      </div>

      {/* Persona */}
      <div style={{ fontSize: 15, fontWeight: 800, color: "#243B53", marginBottom: 10 }}>AIコーチのせいかく</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {PERSONAS.map((p) => {
          const active = state.persona === p.id;
          return (
            <button key={p.id}
              onClick={() => { setPersona(p.id); showToast(`${p.emoji} ${p.label}に変更しました`); }}
              style={{
                borderRadius: 20, padding: "16px 12px", textAlign: "center",
                border: active ? "2.5px solid #3D9BFF" : "2.5px solid transparent",
                background: active ? "#fff" : "#F0F7FF",
                boxShadow: active ? "0 6px 20px rgba(61,155,255,0.18)" : "none",
                cursor: "pointer",
              }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{p.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: active ? "#2E7BE0" : "#243B53" }}>{p.label}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#8AA0B8", marginTop: 2 }}>{p.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Focus */}
      <div style={{ fontSize: 15, fontWeight: 800, color: "#243B53", marginBottom: 10 }}>AIに相談したいこと</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {FOCUS_OPTIONS.map((f) => {
          const active = state.focus.includes(f.id);
          return (
            <button key={f.id} onClick={() => toggleFocus(f.id)}
              style={{
                padding: "9px 16px", borderRadius: 999, border: "none", cursor: "pointer",
                background: active ? "#3D9BFF" : "#fff",
                color: active ? "#fff" : "#8AA0B8",
                fontSize: 13, fontWeight: 800,
                boxShadow: active ? "none" : "0 2px 8px rgba(61,155,255,0.10)",
              }}>
              {active ? "✓ " : "+ "}{f.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => { reset(); showToast("🔄 データをリセットしました"); }}
        style={{
          width: "100%", height: 50, borderRadius: 16,
          border: "1.5px solid #E3EDF8", background: "#fff",
          color: "#8AA0B8", fontSize: 15, fontWeight: 800, cursor: "pointer",
        }}>
        データをリセット
      </button>
    </div>
  );
}
