"use client";

import { useState } from "react";
import { StoreResult, Meal } from "@/lib/store";

const MEAL_TYPES = ["朝食", "昼食", "間食", "夕食"];
const MEAL_EMOJIS: Record<string, string> = { 朝食: "🌅", 昼食: "🌤", 間食: "🍎", 夕食: "🌙" };
const MEAL_TONES: Record<string, string> = { 朝食: "#8FBF6E", 昼食: "#E0A23B", 間食: "#C97FB0", 夕食: "#5B8DD6" };

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  const diffMs = today.getTime() - target.getTime();
  const diffDays = Math.round(diffMs / 86400000);
  const label = diffDays === 0 ? "今日" : diffDays === 1 ? "昨日" : null;
  const dateLabel = `${d.getMonth() + 1}月${d.getDate()}日`;
  return label ? `${dateLabel}（${label}）` : dateLabel;
}

function EditMealSheet({ meal, onSave, onClose }: {
  meal: Meal;
  onSave: (updates: Partial<Omit<Meal, "id">>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(meal.name);
  const [kcal, setKcal] = useState(String(meal.kcal));
  const [type, setType] = useState(meal.type);
  const [emoji, setEmoji] = useState(meal.emoji);
  const [time, setTime] = useState(meal.time); // HH:MM

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      kcal: parseInt(kcal) || 0,
      type,
      emoji,
      tone: MEAL_TONES[type] ?? "#8AA0B8",
      time,
    });
    onClose();
  };

  const EMOJIS = [
    // 和食
    "🍚","🍙","🍘","🍱","🍛","🍜","🍝","🍲","🍣","🍤","🍥","🥮",
    "🍢","🍡","🥟","🥠","🥡","🍠","🧆","🥘","🫕",
    // 洋食・ファストフード
    "🍔","🍟","🌭","🍕","🌮","🌯","🥙","🫔","🥪","🥗","🧀",
    "🍗","🍖","🥩","🥓","🥚","🍳","🥞","🧇","🍞","🥐","🥖","🫓","🥨","🥯",
    // 魚介・肉
    "🐟","🦐","🦑","🦀","🦞","🦪","🥣",
    // スイーツ・デザート
    "🍰","🎂","🧁","🥧","🍩","🍪","🍫","🍬","🍭","🍮","🍯",
    "🍦","🍧","🍨","🍡","🍢",
    // フルーツ
    "🍎","🍊","🍋","🍇","🍓","🫐","🍑","🍒","🥝","🍌","🍉","🥭",
    "🍐","🍏","🍈","🥥","🍍","🫒",
    // 飲み物
    "🥛","☕","🍵","🫖","🧋","🥤","🧃","🍶","🍺","🍷","🍸","🍹",
    "🥂","🍾","🥃","🫗","🍼",
    // その他
    "🍿","🧈","🫙","🍽",
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,40,70,0.32)", zIndex: 200 }} />
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 201,
        background: "#fff", borderRadius: "28px 28px 0 0",
        padding: "10px 20px 36px",
        boxShadow: "0 -10px 40px rgba(20,40,70,0.2)",
        maxHeight: "85vh", overflowY: "auto",
      }}>
        <div style={{ width: 42, height: 5, borderRadius: 3, background: "#D7E2EF", margin: "0 auto 16px" }} />
        <div style={{ fontSize: 17, fontWeight: 800, color: "#243B53", marginBottom: 16 }}>✏️ 食事を編集</div>

        {/* Meal type */}
        <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8", marginBottom: 8 }}>食事の種類</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {MEAL_TYPES.map((t) => (
            <button key={t} onClick={() => setType(t)}
              style={{ flex: 1, height: 42, borderRadius: 14, border: type === t ? "2px solid #3D9BFF" : "2px solid #E3EDF8", background: type === t ? "#F0F7FF" : "#fff", color: type === t ? "#2E7BE0" : "#8AA0B8", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
              {MEAL_EMOJIS[t]} {t}
            </button>
          ))}
        </div>

        {/* Name */}
        <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8", marginBottom: 8 }}>食べたもの</div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1.5px solid #E3EDF8", outline: "none", fontSize: 15, fontWeight: 700, color: "#243B53", background: "#F8FBFF", marginBottom: 14 }}
        />

        {/* Kcal + Time row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8", marginBottom: 8 }}>カロリー</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="number"
                value={kcal}
                onChange={(e) => setKcal(e.target.value)}
                style={{ flex: 1, padding: "12px 12px", borderRadius: 14, border: "1.5px solid #E3EDF8", outline: "none", fontSize: 15, fontWeight: 700, color: "#243B53", background: "#F8FBFF" }}
              />
              <span style={{ fontSize: 13, fontWeight: 800, color: "#8AA0B8", whiteSpace: "nowrap" }}>kcal</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8", marginBottom: 8 }}>時刻</div>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ width: "100%", padding: "12px 12px", borderRadius: 14, border: "1.5px solid #E3EDF8", outline: "none", fontSize: 15, fontWeight: 700, color: "#243B53", background: "#F8FBFF" }}
            />
          </div>
        </div>

        {/* Emoji picker */}
        <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA0B8", marginBottom: 8 }}>アイコン</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
          {EMOJIS.map((e) => (
            <button key={e} onClick={() => setEmoji(e)}
              style={{ width: 42, height: 42, borderRadius: 12, border: emoji === e ? "2px solid #3D9BFF" : "2px solid #E3EDF8", background: emoji === e ? "#F0F7FF" : "#fff", fontSize: 20, cursor: "pointer" }}>
              {e}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose}
            style={{ flex: 1, height: 50, borderRadius: 16, border: "1.5px solid #E3EDF8", background: "#fff", color: "#8AA0B8", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
            キャンセル
          </button>
          <button onClick={handleSave} disabled={!name.trim()}
            style={{ flex: 2, height: 50, borderRadius: 16, border: "none", background: name.trim() ? "linear-gradient(135deg,#4EA6FF,#3D7BFF)" : "#E3EDF8", color: name.trim() ? "#fff" : "#B0C4D8", fontSize: 15, fontWeight: 800, cursor: name.trim() ? "pointer" : "not-allowed", boxShadow: name.trim() ? "0 6px 16px rgba(61,123,255,0.28)" : "none" }}>
            保存する
          </button>
        </div>
      </div>
    </>
  );
}

export default function MealHistoryPage({ store, showToast }: { store: StoreResult; showToast: (m: string) => void }) {
  const { state, removeMeal, editMeal } = store;
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Group meals by date, sorted newest first
  const byDate: { date: string; meals: Meal[]; totalKcal: number }[] = [];
  const dateMap = new Map<string, Meal[]>();
  for (const m of state.meals) {
    const arr = dateMap.get(m.date) ?? [];
    arr.push(m);
    dateMap.set(m.date, arr);
  }
  for (const [date, meals] of dateMap) {
    meals.sort((a, b) => a.time.localeCompare(b.time));
    byDate.push({ date, meals, totalKcal: meals.reduce((s, m) => s + m.kcal, 0) });
  }
  byDate.sort((a, b) => b.date.localeCompare(a.date));

  const toggleDate = (date: string) => {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  return (
    <div style={{ padding: "0 18px", paddingBottom: 24 }}>
      <div style={{ paddingTop: 22, paddingBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22 }}>📋</span>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#243B53" }}>食事のきろく</h1>
      </div>

      {byDate.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#8AA0B8", fontSize: 15, fontWeight: 700 }}>
          まだ食事の記録がありません
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {byDate.map(({ date, meals, totalKcal }) => {
            const expanded = expandedDates.has(date);
            return (
              <div key={date} style={{ background: "#fff", borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 16px rgba(61,155,255,0.09)" }}>
                {/* Date header row */}
                <button
                  onClick={() => toggleDate(date)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 16px", background: "none", border: "none", cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 14, background: "linear-gradient(135deg,#EEF6FF,#D9EEFF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      📅
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#243B53" }}>{fmtDate(date)}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#8AA0B8" }}>{meals.length}品 · {totalKcal.toLocaleString()} kcal</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 18, color: "#B7C6D8", transition: "transform 0.2s", transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}>›</div>
                </button>

                {/* Expanded meal list */}
                {expanded && (
                  <div style={{ borderTop: "1px solid #F0F7FF" }}>
                    {meals.map((meal, idx) => (
                      <div key={meal.id} style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                        borderBottom: idx < meals.length - 1 ? "1px solid #F0F7FF" : "none",
                      }}>
                        {/* Emoji */}
                        <div style={{ width: 44, height: 44, borderRadius: 14, background: meal.tone + "26", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                          {meal.emoji}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#8AA0B8" }}>{meal.type} · {meal.time}</div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: "#243B53", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{meal.name}</div>
                        </div>

                        {/* Kcal */}
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#3D9BFF", fontVariantNumeric: "tabular-nums", flexShrink: 0, marginRight: 4 }}>
                          {meal.kcal > 0 ? `${meal.kcal}` : "---"}
                          <span style={{ fontSize: 10, color: "#8AA0B8" }}> kcal</span>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <button
                            onClick={() => setEditingMeal(meal)}
                            style={{ width: 34, height: 34, borderRadius: 11, border: "none", background: "#EEF6FF", color: "#3D9BFF", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >✎</button>
                          <button
                            onClick={() => setConfirmDeleteId(confirmDeleteId === meal.id ? null : meal.id)}
                            style={{ width: 34, height: 34, borderRadius: 11, border: "none", background: confirmDeleteId === meal.id ? "#FF6B6B" : "#FFF0F0", color: confirmDeleteId === meal.id ? "#fff" : "#FF6B6B", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >{confirmDeleteId === meal.id ? "削除" : "🗑"}</button>
                        </div>
                      </div>
                    ))}

                    {/* Confirm delete row */}
                    {confirmDeleteId !== null && meals.some(m => m.id === confirmDeleteId) && (
                      <div style={{ padding: "10px 16px", background: "#FFF8F8", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#FF6B6B" }}>この食事を削除しますか？</span>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => setConfirmDeleteId(null)}
                            style={{ padding: "6px 14px", borderRadius: 10, border: "1px solid #E3EDF8", background: "#fff", fontSize: 13, fontWeight: 800, color: "#8AA0B8", cursor: "pointer" }}>
                            キャンセル
                          </button>
                          <button onClick={() => { removeMeal(confirmDeleteId); setConfirmDeleteId(null); showToast("🗑 削除しました"); }}
                            style={{ padding: "6px 14px", borderRadius: 10, border: "none", background: "#FF6B6B", fontSize: 13, fontWeight: 800, color: "#fff", cursor: "pointer" }}>
                            削除する
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit sheet */}
      {editingMeal && (
        <EditMealSheet
          meal={editingMeal}
          onSave={(updates) => { editMeal(editingMeal.id, updates); showToast("✅ 編集しました"); }}
          onClose={() => setEditingMeal(null)}
        />
      )}
    </div>
  );
}
