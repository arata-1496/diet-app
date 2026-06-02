"use client";

import { StoreResult } from "@/lib/store";

const PERSONAS = [
  { id: "coach" as const, emoji: "🏋️", label: "コーチ", desc: "バランス重視の応援型" },
  { id: "spartan" as const, emoji: "⚔️", label: "スパルタ", desc: "厳しく結果を求める" },
  { id: "friend" as const, emoji: "😊", label: "友だち", desc: "やさしく寄り添う" },
  { id: "expert" as const, emoji: "🔬", label: "専門家", desc: "データで科学的分析" },
];

const FOCUS_OPTIONS = [
  { id: "fat", label: "脂質" },
  { id: "protein", label: "タンパク質" },
  { id: "snack", label: "間食" },
  { id: "carb", label: "糖質" },
  { id: "veggie", label: "野菜" },
  { id: "sleep", label: "睡眠" },
];

export default function SettingsPage({ store, showToast }: { store: StoreResult; showToast: (m: string) => void }) {
  const { state, setTarget, setPersona, toggleFocus, reset } = store;

  const startKg = state.weightHistory[0]?.kg ?? state.weight;
  const progress = Math.round(Math.min(100, Math.max(0, (startKg - state.weight) / (startKg - state.target) * 100)));
  const toGoal = Math.max(0, Math.round((state.weight - state.target) * 10) / 10);

  return (
    <div style={{ padding: "0 18px", paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ paddingTop: 22, paddingBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22 }}>⚙️</span>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#243B53" }}>せってい</h1>
      </div>

      {/* Goal card */}
      <div style={{
        background: "linear-gradient(135deg,#46D6B6,#2FB39A)",
        borderRadius: 26, padding: 20, color: "#fff", marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
            <button
              onClick={() => setTarget(Math.round((state.target - 0.1) * 10) / 10)}
              style={{ width: 36, height: 36, borderRadius: 12, border: "none", background: "rgba(255,255,255,0.22)", color: "#fff", fontSize: 20, fontWeight: 800, cursor: "pointer" }}
            >−</button>
            <span style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{state.target.toFixed(1)}kg</span>
            <button
              onClick={() => setTarget(Math.round((state.target + 0.1) * 10) / 10)}
              style={{ width: 36, height: 36, borderRadius: 12, border: "none", background: "rgba(255,255,255,0.22)", color: "#fff", fontSize: 20, fontWeight: 800, cursor: "pointer" }}
            >＋</button>
          </div>
          <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.3)" }} />
          <div style={{ fontSize: 14, fontWeight: 800 }}>いつまでに {state.deadline}</div>
        </div>

        {/* Progress bar */}
        <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 999, height: 8, marginBottom: 8 }}>
          <div style={{ background: "#fff", borderRadius: 999, height: 8, width: `${progress}%`, transition: "width 0.4s" }} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 800 }}>達成まで {progress}% ・ あと {toGoal}kg</div>
      </div>

      {/* Persona */}
      <div style={{ fontSize: 15, fontWeight: 800, color: "#243B53", marginBottom: 10 }}>AIコーチのせいかく</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {PERSONAS.map((p) => {
          const active = state.persona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => { setPersona(p.id); showToast(`${p.emoji} ${p.label}に変更しました`); }}
              style={{
                borderRadius: 20, padding: "14px 12px",
                border: active ? "2.5px solid #3D9BFF" : "2.5px solid transparent",
                background: active ? "#fff" : "#F0F7FF",
                boxShadow: active ? "0 6px 20px rgba(61,155,255,0.18)" : "none",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 4 }}>{p.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#243B53" }}>{p.label}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#8AA0B8" }}>{p.desc}</div>
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
            <button
              key={f.id}
              onClick={() => toggleFocus(f.id)}
              style={{
                padding: "8px 16px", borderRadius: 999, border: "none", cursor: "pointer",
                background: active ? "#3D9BFF" : "#fff",
                color: active ? "#fff" : "#8AA0B8",
                fontSize: 14, fontWeight: 800,
                boxShadow: "0 2px 8px rgba(61,155,255,0.10)",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Reset */}
      <button
        onClick={() => { reset(); showToast("🔄 リセットしました"); }}
        style={{
          width: "100%", height: 50, borderRadius: 16,
          border: "1.5px solid #E3EDF8", background: "#fff",
          color: "#8AA0B8", fontSize: 15, fontWeight: 800,
          cursor: "pointer",
        }}
      >
        データをリセット
      </button>
    </div>
  );
}
