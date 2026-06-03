"use client";

import { useState, useRef } from "react";
import { StoreResult, TODAY, Meal } from "@/lib/store";
import DialColumn from "./DialColumn";
// @ts-ignore
import { FoodTile, FOOD_CATEGORIES, FOOD_ICONS, foodLabel } from "./FoodIcons";
import { MealEmoji, getMealBg } from "./MealEmoji";

const INT_ITEMS = Array.from({ length: 171 }, (_, i) => String(i + 30)); // 30–200
const DEC_ITEMS = Array.from({ length: 10 }, (_, i) => String(i));

const FOODS = [
  { key: "ramen", emoji: "🍜", grad: "linear-gradient(135deg,#F6B26B,#E07B39)", name: "醤油ラーメン", kcal: 580, p: 24, f: 18, c: 78, conf: 0.92 },
  { key: "curry", emoji: "🍛", grad: "linear-gradient(135deg,#E9A04B,#C2671F)", name: "チキンカレー", kcal: 720, p: 28, f: 26, c: 92, conf: 0.88 },
  { key: "salad", emoji: "🥗", grad: "linear-gradient(135deg,#9BE36B,#4FAE52)", name: "シーザーサラダ", kcal: 280, p: 14, f: 18, c: 14, conf: 0.9 },
  { key: "onigiri", emoji: "🍙", grad: "linear-gradient(135deg,#C7D2DD,#8FA3B6)", name: "鮭おにぎり", kcal: 200, p: 5, f: 2, c: 40, conf: 0.95 },
  { key: "teishoku", emoji: "🐟", grad: "linear-gradient(135deg,#7EC9F0,#3D87C9)", name: "焼き魚定食", kcal: 620, p: 34, f: 16, c: 78, conf: 0.86 },
  { key: "cake", emoji: "🍰", grad: "linear-gradient(135deg,#F7A8C4,#E36A93)", name: "ショートケーキ", kcal: 340, p: 5, f: 18, c: 40, conf: 0.83 },
];

const MEAL_TYPES = ["朝食", "昼食", "間食", "夕食"];
const MEAL_EMOJIS: Record<string, string> = { 朝食: "🌅", 昼食: "🌤", 間食: "🍎", 夕食: "🌙" };
const MEAL_TONES: Record<string, string> = { 朝食: "#8FBF6E", 昼食: "#E0A23B", 間食: "#C97FB0", 夕食: "#5B8DD6" };


type SheetMode = "none" | "photo" | "manual";
type PhotoStep = "choose" | "analyzing" | "result";

// date helpers
function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fmtDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function WeightDialModal({ initial, onConfirm, onClose }: {
  initial: number; onConfirm: (kg: number) => void; onClose: () => void;
}) {
  const intPart = Math.floor(initial);
  const decPart = Math.round((initial - intPart) * 10);
  const [intIdx, setIntIdx] = useState(Math.max(0, intPart - 30));
  const [decIdx, setDecIdx] = useState(decPart);
  const kg = (intIdx + 30) + decIdx / 10;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,40,70,0.32)", zIndex: 200 }} />
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 201,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderRadius: "28px 28px 0 0",
        padding: "10px 16px 36px",
        boxShadow: "0 -8px 40px rgba(20,40,70,0.18)",
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 3, background: "#D0DEEE", margin: "0 auto 12px" }} />
        <div style={{ fontSize: 16, fontWeight: 800, color: "#243B53", textAlign: "center", marginBottom: 6 }}>体重を入力</div>

        <div style={{ display: "flex", gap: 6, marginBottom: 2, paddingRight: 56 }}>
          <div style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: 800, color: "#8AA0B8" }}>kg</div>
          <div style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: 800, color: "#8AA0B8" }}>小数</div>
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <DialColumn items={INT_ITEMS} selectedIndex={intIdx} onSelect={setIntIdx} visible={3} />
          <div style={{ fontSize: 24, fontWeight: 800, color: "#8AA0B8", flexShrink: 0 }}>.</div>
          <DialColumn items={DEC_ITEMS} selectedIndex={decIdx} onSelect={setDecIdx} visible={3} />
          <div style={{ fontSize: 16, fontWeight: 800, color: "#8AA0B8", flexShrink: 0, width: 40 }}>kg</div>
        </div>

        <div style={{ textAlign: "center", fontSize: 32, fontWeight: 800, color: "#243B53", fontVariantNumeric: "tabular-nums", margin: "8px 0 12px" }}>
          {kg.toFixed(1)}<span style={{ fontSize: 16 }}>kg</span>
        </div>

        <button
          onClick={() => { onConfirm(kg); onClose(); }}
          style={{
            width: "100%", height: 50, borderRadius: 16, border: "none",
            background: "linear-gradient(135deg,#4EA6FF,#3D7BFF)",
            color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer",
            boxShadow: "0 8px 20px rgba(61,123,255,0.30)",
          }}>
          この体重を記録する
        </button>
      </div>
    </>
  );
}

export default function RecordPage({ store, showToast }: { store: StoreResult; showToast: (m: string) => void }) {
  const { state, removeMeal, commitWeightOnDate, addMealOnDate } = store;

  // Date navigation
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [slideClass, setSlideClass] = useState("");
  const isToday = selectedDate === TODAY;
  const canGoForward = selectedDate < TODAY;

  const changeDate = (newDate: string, dir: "left" | "right") => {
    setSlideClass(dir === "left" ? "slide-from-right" : "slide-from-left");
    setSelectedDate(newDate);
    setTimeout(() => setSlideClass(""), 240);
  };

  // Weight for selected date
  const weightEntry = state.weightHistory.find((e) => e.d === selectedDate);
  const displayWeight = weightEntry?.kg ?? state.weight;

  // Meals for selected date
  const dateMeals = state.meals.filter((m) => m.date === selectedDate);
  const dateConsumed = dateMeals.reduce((s, m) => s + m.kcal, 0);

  // Weight dial
  const [showWeightDial, setShowWeightDial] = useState(false);
  const handleDialConfirm = (kg: number) => {
    commitWeightOnDate(selectedDate, kg);
    showToast("✅ 体重を記録しました！");
  };

  // Meal delete
  const [delId, setDelId] = useState<number | null>(null);

  // Sheet
  const [sheetMode, setSheetMode] = useState<SheetMode>("none");

  // Photo flow
  const [photoStep, setPhotoStep] = useState<PhotoStep>("choose");
  const [selectedFood, setSelectedFood] = useState(FOODS[0]);
  const [adjustKcal, setAdjustKcal] = useState(0);
  const [photoMealType, setPhotoMealType] = useState("昼食");

  const pickFood = (food: typeof FOODS[0]) => {
    setSelectedFood(food);
    setAdjustKcal(0);
    setPhotoStep("analyzing");
    setTimeout(() => setPhotoStep("result"), 1700);
  };

  const handleAddFromPhoto = () => {
    const finalKcal = selectedFood.kcal + adjustKcal;
    const ratio = finalKcal / selectedFood.kcal;
    addMealOnDate(selectedDate, {
      type: photoMealType,
      name: selectedFood.name,
      kcal: finalKcal,
      time: new Date().toTimeString().slice(0, 5),
      emoji: selectedFood.emoji,
      tone: MEAL_TONES[photoMealType] ?? "#8FBF6E",
      p: Math.round(selectedFood.p * ratio),
      f: Math.round(selectedFood.f * ratio),
      c: Math.round(selectedFood.c * ratio),
    });
    setSheetMode("none");
    setPhotoStep("choose");
    showToast("✅ 食事を追加しました！");
  };

  // Manual input
  const [manualType, setManualType] = useState("昼食");
  const [manualName, setManualName] = useState("");
  const [manualKcal, setManualKcal] = useState("");
  const [manualEmoji, setManualEmoji] = useState("rice");
  const [manualTime, setManualTime] = useState(() => new Date().toTimeString().slice(0, 5));

  const handleAddManual = () => {
    if (!manualName.trim()) return;
    addMealOnDate(selectedDate, {
      type: manualType,
      name: manualName.trim(),
      kcal: parseInt(manualKcal) || 0,
      time: manualTime,
      emoji: manualEmoji,
      tone: FOOD_ICONS?.[manualEmoji]?.tint ?? MEAL_TONES[manualType] ?? "#8AA0B8",
      p: 0, f: 0, c: 0,
    });
    setManualName("");
    setManualKcal("");
    setManualTime(new Date().toTimeString().slice(0, 5));
    setSheetMode("none");
    showToast("✅ 食事を追加しました！");
  };

  // Full-screen swipe for date navigation
  const swipeStartX = useRef<number | null>(null);
  const onSwipeStart = (e: React.TouchEvent) => {
    if (sheetMode !== "none" || showWeightDial) return;
    swipeStartX.current = e.touches[0].clientX;
  };
  const onSwipeEnd = (e: React.TouchEvent) => {
    if (swipeStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0 && canGoForward) changeDate(addDays(selectedDate, 1), "left");
    else if (dx > 0) changeDate(addDays(selectedDate, -1), "right");
  };

  const closeSheet = () => {
    setSheetMode("none");
    setPhotoStep("choose");
  };

  return (
    <div
      onTouchStart={onSwipeStart}
      onTouchEnd={onSwipeEnd}
      style={{ padding: "0 18px", paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ paddingTop: 22, paddingBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22 }}>📝</span>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#243B53" }}>きょうの記録</h1>
      </div>

      {/* Date navigation */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#fff", borderRadius: 20, padding: "10px 16px", marginBottom: 16,
        boxShadow: "0 4px 14px rgba(61,155,255,0.08)",
      }}>
        <button
          onClick={() => changeDate(addDays(selectedDate, -1), "right")}
          style={{ width: 36, height: 36, borderRadius: 12, border: "none", background: "#F0F7FF", color: "#3D9BFF", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >‹</button>
        <div className={slideClass} style={{ textAlign: "center", minWidth: 120 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#243B53" }}>{fmtDate(selectedDate)}</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#3D9BFF", background: "#EEF6FF", borderRadius: 999, padding: "2px 7px", visibility: isToday ? "visible" : "hidden" }}>今日</div>
              <button
                onClick={() => changeDate(TODAY, "left")}
                style={{
                  fontSize: 11, fontWeight: 800, color: "#3D9BFF",
                  background: "none", border: "none", cursor: "pointer", padding: "1px 0",
                  visibility: isToday ? "hidden" : "visible",
                }}
              >今日に戻る ›</button>
            </div>
          </div>
        </div>
        <button
          onClick={() => { if (canGoForward) changeDate(addDays(selectedDate, 1), "left"); }}
          style={{
            width: 36, height: 36, borderRadius: 12, border: "none",
            background: canGoForward ? "#F0F7FF" : "#F5F5F5",
            color: canGoForward ? "#3D9BFF" : "#D0D0D0",
            fontSize: 18, cursor: canGoForward ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >›</button>
      </div>

      {/* Animated content area */}
      <div className={slideClass}>

      {/* Weight card */}
      <div style={{
        background: "linear-gradient(135deg,#4EA6FF,#3D7BFF)",
        borderRadius: 26, padding: 20, color: "#fff", textAlign: "center", marginBottom: 20,
        boxShadow: "0 10px 30px rgba(61,123,255,0.30)",
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, opacity: 0.9, marginBottom: 8 }}>
          {isToday ? "いまの体重" : `${fmtDate(selectedDate)}の体重`}
        </div>

        <button
          onClick={() => setShowWeightDial(true)}
          style={{
            display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 4, marginBottom: 8,
            background: "none", border: "none", cursor: "pointer", width: "100%",
          }}
        >
          <span style={{ fontSize: 60, fontWeight: 800, fontVariantNumeric: "tabular-nums", lineHeight: 1, color: "#fff" }}>
            {displayWeight.toFixed(1)}
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: "#fff" }}>kg</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.70)", marginBottom: 12, marginLeft: 2 }}>✎</span>
        </button>

        {weightEntry ? (
          <div style={{
            display: "inline-block", background: "rgba(255,255,255,0.22)",
            borderRadius: 999, padding: "4px 14px", fontSize: 13, fontWeight: 800, marginBottom: 16,
          }}>
            ✅ 記録済み
          </div>
        ) : (
          <div style={{
            display: "inline-block", background: "rgba(255,255,255,0.22)",
            borderRadius: 999, padding: "4px 14px", fontSize: 13, fontWeight: 800, marginBottom: 16,
          }}>
            タップして記録
          </div>
        )}

        {/* ±0.1 buttons + commit */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              const n = Math.round((displayWeight - 0.1) * 10) / 10;
              commitWeightOnDate(selectedDate, n);
            }}
            style={{ flex: 1, height: 50, borderRadius: 16, border: "none", background: "rgba(255,255,255,0.22)", color: "#fff", fontSize: 22, fontWeight: 800, cursor: "pointer" }}>−</button>
          <button
            onClick={() => { commitWeightOnDate(selectedDate, displayWeight); showToast("✅ 体重を記録しました！"); }}
            style={{ flex: 2, height: 50, borderRadius: 16, border: "none", background: "#fff", color: "#2E7BE0", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>記録する</button>
          <button
            onClick={() => {
              const n = Math.round((displayWeight + 0.1) * 10) / 10;
              commitWeightOnDate(selectedDate, n);
            }}
            style={{ flex: 1, height: 50, borderRadius: 16, border: "none", background: "rgba(255,255,255,0.22)", color: "#fff", fontSize: 22, fontWeight: 800, cursor: "pointer" }}>＋</button>
        </div>
      </div>

      {/* Meal section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#243B53" }}>🍽 {isToday ? "きょう" : fmtDate(selectedDate)}食べたもの</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#3D9BFF", fontVariantNumeric: "tabular-nums" }}>
          {dateConsumed.toLocaleString()} / {state.calTarget.toLocaleString()} kcal
        </span>
      </div>

      {/* Meal list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {dateMeals.length === 0 && (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#8AA0B8", fontSize: 14, fontWeight: 700 }}>
            まだ記録がありません
          </div>
        )}
        {dateMeals.map((meal) => (
          <div key={meal.id} onClick={() => setDelId(delId === meal.id ? null : meal.id)}
            style={{ background: "#fff", borderRadius: 26, padding: 12, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 10px 30px rgba(61,155,255,0.10)", cursor: "pointer" }}>
            <div style={{ width: 50, height: 50, borderRadius: 16, background: getMealBg(meal.emoji, meal.tone), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
              <MealEmoji emoji={meal.emoji} size={34} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8" }}>{meal.type} · {meal.time}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#243B53", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{meal.name}</div>
            </div>
            {delId === meal.id ? (
              <button onClick={(e) => { e.stopPropagation(); removeMeal(meal.id); setDelId(null); showToast("🗑 削除しました"); }}
                style={{ background: "#FF8C8C", color: "#fff", border: "none", borderRadius: 12, height: 40, padding: "0 16px", fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>
                削除
              </button>
            ) : (
              <span style={{ fontSize: 15, fontWeight: 800, color: "#2E7BE0", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                {meal.kcal > 0 ? `${meal.kcal} kcal` : "---"}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Add buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
        <button onClick={() => setSheetMode("manual")}
          style={{ flex: 1, height: 60, borderRadius: 20, border: "2.5px solid #46D6B6", background: "#F0FDF9", color: "#2FB39A", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          ✏️ 手入力で記録
        </button>
        <button onClick={() => { setSheetMode("photo"); setPhotoStep("choose"); }}
          style={{ flex: 1, height: 60, borderRadius: 20, border: "2.5px dashed #3D9BFF", background: "#F0F7FF", color: "#2E7BE0", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          📷 写真で記録
        </button>
      </div>

      </div> {/* end animated content */}

      {/* Weight dial modal */}
      {showWeightDial && (
        <WeightDialModal
          initial={displayWeight}
          onConfirm={handleDialConfirm}
          onClose={() => setShowWeightDial(false)}
        />
      )}

      {/* Sheet backdrop */}
      {sheetMode !== "none" && (
        <div onClick={closeSheet} style={{ position: "fixed", inset: 0, background: "rgba(20,40,70,0.32)", zIndex: 40 }} />
      )}

      {/* Manual input sheet */}
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50,
        background: "#fff", borderRadius: "28px 28px 0 0",
        padding: "10px 20px 36px",
        boxShadow: "0 -10px 40px rgba(20,40,70,0.2)",
        transform: sheetMode === "manual" ? "translateY(0)" : "translateY(110%)",
        transition: "transform .34s cubic-bezier(.2,.8,.2,1)",
        maxHeight: "80vh", overflowY: "auto",
      }}>
        <div style={{ width: 42, height: 5, borderRadius: 3, background: "#D7E2EF", margin: "0 auto 16px" }} />
        <div style={{ fontSize: 18, fontWeight: 800, color: "#243B53", marginBottom: 16 }}>✏️ 手入力で記録</div>

        <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8", marginBottom: 8 }}>食事の種類</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {MEAL_TYPES.map((t) => (
            <button key={t} onClick={() => setManualType(t)}
              style={{ flex: 1, height: 42, borderRadius: 14, border: manualType === t ? "2px solid #3D9BFF" : "2px solid #E3EDF8", background: manualType === t ? "#F0F7FF" : "#fff", color: manualType === t ? "#2E7BE0" : "#8AA0B8", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
              {MEAL_EMOJIS[t]} {t}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8", marginBottom: 8 }}>食べたもの</div>
        <input
          type="text"
          placeholder="例：ご飯・味噌汁・焼き魚"
          value={manualName}
          onChange={(e) => setManualName(e.target.value)}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1.5px solid #E3EDF8", outline: "none", fontSize: 15, fontWeight: 700, color: "#243B53", background: "#F8FBFF", marginBottom: 14 }}
        />

        {/* Kcal + Time row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8", marginBottom: 8 }}>カロリー</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="number"
                placeholder="500"
                value={manualKcal}
                onChange={(e) => setManualKcal(e.target.value)}
                style={{ flex: 1, padding: "12px 12px", borderRadius: 14, border: "1.5px solid #E3EDF8", outline: "none", fontSize: 15, fontWeight: 700, color: "#243B53", background: "#F8FBFF" }}
              />
              <span style={{ fontSize: 13, fontWeight: 800, color: "#8AA0B8", whiteSpace: "nowrap" }}>kcal</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8", marginBottom: 8 }}>時刻</div>
            <input
              type="time"
              value={manualTime}
              onChange={(e) => setManualTime(e.target.value)}
              style={{ width: "100%", padding: "12px 12px", borderRadius: 14, border: "1.5px solid #E3EDF8", outline: "none", fontSize: 15, fontWeight: 700, color: "#243B53", background: "#F8FBFF" }}
            />
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8", marginBottom: 10 }}>アイコン</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          {FOOD_CATEGORIES.map((cat: { name: string; keys: string[] }) => (
            <div key={cat.name}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#B7C6D8", marginBottom: 8 }}>{cat.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {cat.keys.map((key: string) => (
                  <FoodTile key={key} name={key} size={36} tile={56} radius={16}
                    selected={manualEmoji === key} onClick={setManualEmoji} showLabel />
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleAddManual} disabled={!manualName.trim()}
          style={{ width: "100%", height: 56, borderRadius: 18, border: "none", background: manualName.trim() ? "linear-gradient(135deg,#4EA6FF,#3D7BFF)" : "#E3EDF8", color: manualName.trim() ? "#fff" : "#B0C4D8", fontSize: 16, fontWeight: 800, cursor: manualName.trim() ? "pointer" : "not-allowed", boxShadow: manualName.trim() ? "0 8px 20px rgba(61,123,255,0.30)" : "none" }}>
          追加する
        </button>
      </div>

      {/* Photo flow sheet */}
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50,
        background: "#fff", borderRadius: "28px 28px 0 0",
        padding: "10px 20px 36px",
        boxShadow: "0 -10px 40px rgba(20,40,70,0.2)",
        transform: sheetMode === "photo" ? "translateY(0)" : "translateY(110%)",
        transition: "transform .34s cubic-bezier(.2,.8,.2,1)",
        maxHeight: "85vh", overflowY: "auto",
      }}>
        <div style={{ width: 42, height: 5, borderRadius: 3, background: "#D7E2EF", margin: "0 auto 12px" }} />

        {photoStep === "choose" && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#243B53", marginBottom: 4 }}>📷 写真で記録</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#8AA0B8", marginBottom: 16 }}>写真を選ぶとAIがカロリーを推定します</div>
            <button onClick={() => pickFood(FOODS[Math.floor(Math.random() * FOODS.length)])}
              style={{ width: "100%", height: 70, borderRadius: 18, border: "2.5px dashed #3D9BFF", background: "#F0F7FF", color: "#2E7BE0", fontSize: 15, fontWeight: 800, marginBottom: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>📸</span> カメラで撮影する
            </button>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8", marginBottom: 10 }}>ライブラリから選ぶ</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {FOODS.map((f) => (
                <button key={f.key} onClick={() => pickFood(f)}
                  style={{ aspectRatio: "1", borderRadius: 18, border: "none", background: f.grad, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, boxShadow: "0 6px 16px rgba(20,40,70,0.14)" }}>
                  {f.emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {photoStep === "analyzing" && (
          <div style={{ padding: "20px 0 30px", textAlign: "center" }}>
            <div style={{ width: 150, height: 150, borderRadius: 26, margin: "0 auto", background: selectedFood.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 78, position: "relative", overflow: "hidden" }}>
              {selectedFood.emoji}
              <div className="scanline" />
            </div>
            <div style={{ marginTop: 22, fontSize: 18, fontWeight: 800, color: "#243B53" }}>AIが解析しています…</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 14 }}>
              {[0, 1, 2].map((i) => <span key={i} className="dot" style={{ animationDelay: `${i * 0.18}s` }} />)}
            </div>
          </div>
        )}

        {photoStep === "result" && (
          <div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
              <div style={{ width: 76, height: 76, borderRadius: 20, background: selectedFood.grad, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{selectedFood.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#E2FBF4", color: "#2FB39A", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 999, marginBottom: 6, whiteSpace: "nowrap" }}>
                  ✨ AI推定 · 確度 {Math.round(selectedFood.conf * 100)}%
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#243B53" }}>{selectedFood.name}</div>
              </div>
            </div>

            <div style={{ background: "#F0F7FF", borderRadius: 20, padding: "16px 18px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8", marginBottom: 8 }}>推定カロリー（調整できます）</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <button onClick={() => setAdjustKcal((k) => k - 10)}
                  style={{ width: 50, height: 50, borderRadius: 16, border: "none", background: "#fff", color: "#2E7BE0", fontSize: 24, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(61,155,255,0.16)" }}>−</button>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: "#2E7BE0", fontVariantNumeric: "tabular-nums" }}>{selectedFood.kcal + adjustKcal}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#8AA0B8" }}>kcal</span>
                </div>
                <button onClick={() => setAdjustKcal((k) => k + 10)}
                  style={{ width: 50, height: 50, borderRadius: 16, border: "none", background: "#fff", color: "#2E7BE0", fontSize: 24, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(61,155,255,0.16)" }}>＋</button>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[["P", selectedFood.p, "#46D6B6"], ["F", selectedFood.f, "#FFB03A"], ["C", selectedFood.c, "#3D9BFF"]].map(([k, v, col]) => (
                  <div key={k as string} style={{ flex: 1, background: "#fff", borderRadius: 12, padding: "8px 0", textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: col as string }}>{k}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#243B53" }}>{Math.round((v as number) * ((selectedFood.kcal + adjustKcal) / selectedFood.kcal))}<span style={{ fontSize: 10, color: "#8AA0B8" }}>g</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8", marginBottom: 8 }}>どの食事？</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              {MEAL_TYPES.map((t) => (
                <button key={t} onClick={() => setPhotoMealType(t)}
                  style={{ flex: 1, height: 42, borderRadius: 14, border: photoMealType === t ? "2px solid #3D9BFF" : "2px solid #E3EDF8", background: photoMealType === t ? "#F0F7FF" : "#fff", color: photoMealType === t ? "#2E7BE0" : "#8AA0B8", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>

            <button onClick={handleAddFromPhoto}
              style={{ width: "100%", height: 56, borderRadius: 18, border: "none", background: "linear-gradient(135deg,#4EA6FF,#3D7BFF)", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 24px rgba(61,123,255,0.35)" }}>
              この内容で追加する
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
