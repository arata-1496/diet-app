"use client";

import { useState } from "react";
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
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return "";
  const dt = new Date(d + "T00:00:00");
  if (isNaN(dt.getTime())) return "";
  return `${dt.getFullYear()}年${dt.getMonth() + 1}月${dt.getDate()}日`;
}

function DatePickerSheet({
  value,
  onConfirm,
  onClose,
}: {
  value: string;
  onConfirm: (d: string) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const init = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value + "T00:00:00") : today;

  const [year, setYear] = useState(init.getFullYear());
  const [month, setMonth] = useState(init.getMonth() + 1);
  const [day, setDay] = useState(init.getDate());

  const daysInMonth = new Date(year, month, 0).getDate();
  const clampedDay = Math.min(day, daysInMonth);

  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${year}-${pad(month)}-${pad(clampedDay)}`;

  const spinStyle = (active: boolean): React.CSSProperties => ({
    width: 44, height: 44, borderRadius: 14, border: "none",
    background: active ? "#3D9BFF" : "rgba(61,155,255,0.10)",
    color: active ? "#fff" : "#3D9BFF",
    fontSize: 20, fontWeight: 800, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  });

  const colStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flex: 1,
  };

  const valStyle: React.CSSProperties = {
    fontSize: 28, fontWeight: 800, color: "#243B53",
    fontVariantNumeric: "tabular-nums", lineHeight: 1,
    minWidth: 56, textAlign: "center",
  };

  const unitStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: "#8AA0B8", marginTop: 2,
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,40,70,0.32)", zIndex: 200 }} />

      {/* Sheet */}
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 201,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderRadius: "28px 28px 0 0",
        padding: "12px 24px 40px",
        boxShadow: "0 -8px 40px rgba(20,40,70,0.18)",
      }}>
        {/* Handle */}
        <div style={{ width: 40, height: 5, borderRadius: 3, background: "#D0DEEE", margin: "0 auto 20px" }} />
        <div style={{ fontSize: 17, fontWeight: 800, color: "#243B53", textAlign: "center", marginBottom: 24 }}>期限を設定</div>

        {/* Pickers row */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
          {/* Year */}
          <div style={colStyle}>
            <button style={spinStyle(false)} onClick={() => setYear((y) => y + 1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 15l-6-6-6 6" /></svg>
            </button>
            <div>
              <div style={valStyle}>{year}</div>
              <div style={unitStyle}>年</div>
            </div>
            <button style={spinStyle(false)} onClick={() => setYear((y) => y - 1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </div>

          <div style={{ color: "#D0DEEE", fontSize: 24, fontWeight: 300 }}>·</div>

          {/* Month */}
          <div style={colStyle}>
            <button style={spinStyle(false)} onClick={() => setMonth((m) => m >= 12 ? 1 : m + 1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 15l-6-6-6 6" /></svg>
            </button>
            <div>
              <div style={valStyle}>{month}</div>
              <div style={unitStyle}>月</div>
            </div>
            <button style={spinStyle(false)} onClick={() => setMonth((m) => m <= 1 ? 12 : m - 1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </div>

          <div style={{ color: "#D0DEEE", fontSize: 24, fontWeight: 300 }}>·</div>

          {/* Day */}
          <div style={colStyle}>
            <button style={spinStyle(false)} onClick={() => setDay((d) => d >= daysInMonth ? 1 : d + 1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 15l-6-6-6 6" /></svg>
            </button>
            <div>
              <div style={valStyle}>{clampedDay}</div>
              <div style={unitStyle}>日</div>
            </div>
            <button style={spinStyle(false)} onClick={() => setDay((d) => d <= 1 ? daysInMonth : d - 1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </div>
        </div>

        {/* Preview */}
        <div style={{ textAlign: "center", fontSize: 15, fontWeight: 700, color: "#8AA0B8", marginBottom: 20 }}>
          {year}年{month}月{clampedDay}日
        </div>

        {/* Confirm */}
        <button
          onClick={() => { onConfirm(dateStr); onClose(); }}
          style={{
            width: "100%", height: 54, borderRadius: 16, border: "none",
            background: "linear-gradient(135deg,#4EA6FF,#3D7BFF)",
            color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer",
            boxShadow: "0 8px 20px rgba(61,123,255,0.30)",
          }}>
          この日付を設定する
        </button>
      </div>
    </>
  );
}

export default function SettingsPage({ store, showToast }: { store: StoreResult; showToast: (m: string) => void }) {
  const { state, setTarget, setDeadline, setPersona, toggleFocus, reset } = store;
  const [showDatePicker, setShowDatePicker] = useState(false);

  const startKg = state.weightHistory[0]?.kg ?? state.weight;
  const progress = Math.round(Math.min(100, Math.max(0,
    startKg === state.target ? 0 : (startKg - state.weight) / (startKg - state.target) * 100
  )));
  const toGoal = Math.max(0, Math.round((state.weight - state.target) * 10) / 10);
  const deadlineLabel = fmtDeadline(state.deadline);

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
        <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.9, marginBottom: 16 }}>🎯 わたしの目標</div>

        {/* Target weight */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
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

          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />

          {/* Deadline display + tap to edit */}
          <button
            onClick={() => setShowDatePicker(true)}
            style={{ flex: 1, background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 14, padding: "10px 12px", cursor: "pointer", textAlign: "left" }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 3 }}>いつまでに</div>
            <div style={{ fontSize: deadlineLabel ? 16 : 14, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }}>
              {deadlineLabel || "タップして設定"}
            </div>
          </button>
        </div>

        {/* Progress bar */}
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
                border: active ? "2px solid #3D9BFF" : "2px solid transparent",
                background: active ? "#fff" : "rgba(240,247,255,0.8)",
                backdropFilter: active ? "none" : "blur(8px)",
                boxShadow: active ? "0 6px 20px rgba(61,155,255,0.18)" : "0 2px 8px rgba(61,155,255,0.06)",
                cursor: "pointer",
              }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{p.emoji}</div>
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
                padding: "9px 18px", borderRadius: 999, border: "none", cursor: "pointer",
                background: active ? "linear-gradient(135deg,#4EA6FF,#3D7BFF)" : "#fff",
                color: active ? "#fff" : "#8AA0B8",
                fontSize: 13, fontWeight: 800,
                boxShadow: active ? "0 4px 14px rgba(61,123,255,0.25)" : "0 2px 8px rgba(61,155,255,0.08)",
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
          border: "1.5px solid #E3EDF8",
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(8px)",
          color: "#8AA0B8", fontSize: 15, fontWeight: 800, cursor: "pointer",
        }}>
        データをリセット
      </button>

      {showDatePicker && (
        <DatePickerSheet
          value={state.deadline}
          onConfirm={(d) => { setDeadline(d); showToast("📅 期限を設定しました"); }}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
}
