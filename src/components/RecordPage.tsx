"use client";

import { useState } from "react";
import { StoreResult } from "@/lib/store";

const FOODS = [
  { key: "ramen", emoji: "🍜", grad: "linear-gradient(135deg,#F6B26B,#E07B39)", name: "醤油ラーメン", kcal: 580, p: 24, f: 18, c: 78, conf: 0.92 },
  { key: "curry", emoji: "🍛", grad: "linear-gradient(135deg,#E9A04B,#C2671F)", name: "チキンカレー", kcal: 720, p: 28, f: 26, c: 92, conf: 0.88 },
  { key: "salad", emoji: "🥗", grad: "linear-gradient(135deg,#9BE36B,#4FAE52)", name: "シーザーサラダ", kcal: 280, p: 14, f: 18, c: 14, conf: 0.9 },
  { key: "onigiri", emoji: "🍙", grad: "linear-gradient(135deg,#C7D2DD,#8FA3B6)", name: "鮭おにぎり", kcal: 200, p: 5, f: 2, c: 40, conf: 0.95 },
  { key: "teishoku", emoji: "🐟", grad: "linear-gradient(135deg,#7EC9F0,#3D87C9)", name: "焼き魚定食", kcal: 620, p: 34, f: 16, c: 78, conf: 0.86 },
  { key: "cake", emoji: "🍰", grad: "linear-gradient(135deg,#F7A8C4,#E36A93)", name: "ショートケーキ", kcal: 340, p: 5, f: 18, c: 40, conf: 0.83 },
];

type PhotoStep = "choose" | "analyzing" | "result";

export default function RecordPage({ store, showToast }: { store: StoreResult; showToast: (m: string) => void }) {
  const { state, consumed, removeMeal, commitWeight, addMeal } = store;
  const [draft, setDraft] = useState(state.weight);
  const [delId, setDelId] = useState<number | null>(null);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoStep, setPhotoStep] = useState<PhotoStep>("choose");
  const [selectedFood, setSelectedFood] = useState(FOODS[0]);
  const [adjustKcal, setAdjustKcal] = useState(0);
  const [mealType, setMealType] = useState("昼食");

  const diff = Math.round((draft - state.weight) * 10) / 10;
  const toGoal = Math.max(0, Math.round((draft - state.target) * 10) / 10);

  const handleMinus = () => setDraft((d) => Math.round((d - 0.1) * 10) / 10);
  const handlePlus = () => setDraft((d) => Math.round((d + 0.1) * 10) / 10);
  const handleCommit = () => {
    commitWeight(draft);
    showToast("✅ 体重を記録しました！");
  };

  const pickFood = (food: typeof FOODS[0]) => {
    setSelectedFood(food);
    setAdjustKcal(0);
    setPhotoStep("analyzing");
    setTimeout(() => setPhotoStep("result"), 1700);
  };

  const handleAddFromPhoto = () => {
    addMeal({
      type: mealType,
      name: selectedFood.name,
      kcal: selectedFood.kcal + adjustKcal,
      time: new Date().toTimeString().slice(0, 5),
      emoji: selectedFood.emoji,
      tone: "#8FBF6E",
      p: selectedFood.p,
      f: selectedFood.f,
      c: selectedFood.c,
    });
    setPhotoOpen(false);
    setPhotoStep("choose");
    showToast("✅ 食事を追加しました！");
  };

  return (
    <div style={{ padding: "0 18px", paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ paddingTop: 22, paddingBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22 }}>📝</span>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#243B53" }}>きょうの記録</h1>
      </div>

      {/* Weight card */}
      <div style={{
        background: "linear-gradient(135deg,#4EA6FF,#3D7BFF)",
        borderRadius: 26,
        padding: 20,
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, opacity: 0.9, marginBottom: 4 }}>いまの体重</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 4, marginBottom: 10 }}>
          <span style={{ fontSize: 60, fontWeight: 800, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{draft.toFixed(1)}</span>
          <span style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>kg</span>
        </div>
        <div style={{
          display: "inline-block",
          background: "rgba(255,255,255,0.22)",
          borderRadius: 999,
          padding: "4px 14px",
          fontSize: 13,
          fontWeight: 800,
          marginBottom: 16,
        }}>
          {diff === 0
            ? `🎯 目標まであと ${toGoal}kg！`
            : diff < 0
            ? `⬇ ${diff}kg 入力中`
            : `⬆ +${diff}kg 入力中`}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleMinus} style={{ flex: 1, height: 50, borderRadius: 16, border: "none", background: "rgba(255,255,255,0.22)", color: "#fff", fontSize: 22, fontWeight: 800, cursor: "pointer" }}>−</button>
          <button onClick={handleCommit} style={{ flex: 2, height: 50, borderRadius: 16, border: "none", background: "#fff", color: "#2E7BE0", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>記録する</button>
          <button onClick={handlePlus} style={{ flex: 1, height: 50, borderRadius: 16, border: "none", background: "rgba(255,255,255,0.22)", color: "#fff", fontSize: 22, fontWeight: 800, cursor: "pointer" }}>＋</button>
        </div>
      </div>

      {/* Meal section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#243B53" }}>🍽 きょう食べたもの</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#3D9BFF", fontVariantNumeric: "tabular-nums" }}>{consumed} / {state.calTarget} kcal</span>
      </div>

      {/* Meal list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {state.meals.map((meal) => (
          <div
            key={meal.id}
            onClick={() => setDelId(delId === meal.id ? null : meal.id)}
            style={{
              background: "#fff",
              borderRadius: 26,
              padding: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 10px 30px rgba(61,155,255,0.10)",
              cursor: "pointer",
            }}
          >
            <div style={{
              width: 50, height: 50, borderRadius: 16,
              background: meal.tone + "26",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, flexShrink: 0,
            }}>
              {meal.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8" }}>{meal.type} · {meal.time}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#243B53", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{meal.name}</div>
            </div>
            {delId === meal.id ? (
              <button
                onClick={(e) => { e.stopPropagation(); removeMeal(meal.id); setDelId(null); showToast("🗑 削除しました"); }}
                style={{ background: "#FF8C8C", color: "#fff", border: "none", borderRadius: 12, height: 40, padding: "0 16px", fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}
              >
                削除
              </button>
            ) : (
              <span style={{ fontSize: 15, fontWeight: 800, color: "#2E7BE0", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{meal.kcal} kcal</span>
            )}
          </div>
        ))}
      </div>

      {/* Photo button */}
      <button
        onClick={() => { setPhotoOpen(true); setPhotoStep("choose"); }}
        style={{
          width: "100%", height: 60, borderRadius: 20,
          border: "2.5px dashed #3D9BFF",
          background: "#F0F7FF",
          color: "#2E7BE0",
          fontSize: 15, fontWeight: 800,
          cursor: "pointer",
          marginBottom: 8,
        }}
      >
        📷 写真でかんたん記録！
      </button>

      {/* PhotoFlow */}
      {photoOpen && (
        <>
          <div
            onClick={() => { setPhotoOpen(false); setPhotoStep("choose"); }}
            style={{ position: "fixed", inset: 0, background: "rgba(20,40,70,0.32)", zIndex: 100 }}
          />
          <div style={{
            position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 101,
            background: "#fff",
            borderRadius: "26px 26px 0 0",
            padding: "24px 18px 40px",
            transform: "translateY(0)",
            animation: "slideUp .34s cubic-bezier(.2,.8,.2,1) both",
          }}>
            <style>{`@keyframes slideUp { from { transform:translateY(110%) } to { transform:translateY(0) } }`}</style>

            {photoStep === "choose" && (
              <>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#243B53", marginBottom: 4 }}>📷 写真で記録</div>
                <div style={{ fontSize: 13, color: "#8AA0B8", marginBottom: 20 }}>写真を選ぶとAIがカロリーを推定します</div>
                <button
                  onClick={() => { const f = FOODS[Math.floor(Math.random() * FOODS.length)]; pickFood(f); }}
                  style={{
                    width: "100%", height: 60, borderRadius: 20,
                    border: "2.5px dashed #3D9BFF", background: "#F0F7FF",
                    color: "#2E7BE0", fontSize: 15, fontWeight: 800,
                    cursor: "pointer", marginBottom: 16,
                  }}
                >
                  📸 カメラで撮影する
                </button>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#8AA0B8", marginBottom: 10 }}>ライブラリから選ぶ</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                  {FOODS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => pickFood(f)}
                      style={{
                        aspectRatio: "1", borderRadius: 18,
                        background: f.grad, border: "none",
                        fontSize: 38, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {f.emoji}
                    </button>
                  ))}
                </div>
              </>
            )}

            {photoStep === "analyzing" && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{
                  width: 150, height: 150, borderRadius: 26,
                  background: selectedFood.grad,
                  margin: "0 auto 20px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", overflow: "hidden",
                  fontSize: 78,
                }}>
                  {selectedFood.emoji}
                  <div className="scanline" />
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#243B53", marginBottom: 12 }}>AIが解析しています…</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 10 }}>
                  <span className="dot" style={{ animationDelay: "0s" }} />
                  <span className="dot" style={{ animationDelay: "0.18s" }} />
                  <span className="dot" style={{ animationDelay: "0.36s" }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#8AA0B8" }}>食材とボリュームを認識中</div>
              </div>
            )}

            {photoStep === "result" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 76, height: 76, borderRadius: 18, background: selectedFood.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, flexShrink: 0 }}>
                    {selectedFood.emoji}
                  </div>
                  <div>
                    <div style={{ background: "#E2FBF4", color: "#2FB39A", borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 800, display: "inline-block", marginBottom: 4 }}>
                      ✨ AI推定 · 確度 {Math.round(selectedFood.conf * 100)}%
                    </div>
                    <div style={{ fontSize: 19, fontWeight: 800, color: "#243B53" }}>{selectedFood.name}</div>
                  </div>
                </div>

                {/* Calorie adjust */}
                <div style={{ background: "#F0F7FF", borderRadius: 20, padding: "12px 16px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <button onClick={() => setAdjustKcal((k) => k - 10)} style={{ border: "none", background: "none", fontSize: 22, fontWeight: 800, color: "#3D9BFF", cursor: "pointer" }}>−10</button>
                    <span style={{ fontSize: 40, fontWeight: 800, color: "#2E7BE0", fontVariantNumeric: "tabular-nums" }}>{selectedFood.kcal + adjustKcal}</span>
                    <button onClick={() => setAdjustKcal((k) => k + 10)} style={{ border: "none", background: "none", fontSize: 22, fontWeight: 800, color: "#3D9BFF", cursor: "pointer" }}>+10</button>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { label: `P ${selectedFood.p}g`, color: "#3D9BFF" },
                      { label: `F ${selectedFood.f}g`, color: "#FFC24B" },
                      { label: `C ${selectedFood.c}g`, color: "#46D6B6" },
                    ].map((chip) => (
                      <div key={chip.label} style={{ background: "#fff", borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 800, color: chip.color }}>{chip.label}</div>
                    ))}
                  </div>
                </div>

                {/* Meal type */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {["朝食", "昼食", "間食", "夕食"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setMealType(t)}
                      style={{
                        flex: 1, height: 42, borderRadius: 14, border: mealType === t ? "2px solid #3D9BFF" : "2px solid transparent",
                        background: mealType === t ? "#F0F7FF" : "#fff",
                        color: mealType === t ? "#3D9BFF" : "#8AA0B8",
                        fontSize: 13, fontWeight: 800, cursor: "pointer",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAddFromPhoto}
                  style={{
                    width: "100%", height: 52, borderRadius: 16, border: "none",
                    background: "linear-gradient(135deg,#4EA6FF,#3D7BFF)",
                    boxShadow: "0 10px 24px rgba(61,123,255,0.35)",
                    color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer",
                  }}
                >
                  この内容で追加する
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
