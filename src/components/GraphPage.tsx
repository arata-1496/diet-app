"use client";

import { useState, useRef } from "react";
import { StoreResult, WeightEntry } from "@/lib/store";

function lineP(values: number[], w: number, h: number, padX = 0, padTop = 0, padBot = 0) {
  const min = Math.min(...values), max = Math.max(...values);
  const range = (max - min) || 1;
  const iw = w - padX * 2, ih = h - padTop - padBot;
  const pts: [number, number][] = values.map((v, i) => [
    padX + (iw * i) / (values.length - 1),
    padTop + ih - ((v - min) / range) * ih,
  ]);
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  const area = d + ` L ${pts[pts.length - 1][0]},${h - padBot} L ${pts[0][0]},${h - padBot} Z`;
  return { d, area, pts };
}

function fmtDate(d: string) {
  const dt = new Date(d + "T00:00:00");
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
}

function fmtDateFull(d: string) {
  const dt = new Date(d + "T00:00:00");
  return `${dt.getFullYear()}年${dt.getMonth() + 1}月${dt.getDate()}日`;
}

const DAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];
const DELETE_THRESHOLD = 60; // px to swipe before delete button locks open

// ── Swipeable weight row ──────────────────────────────────────────────────
function WeightRow({
  entry,
  isLast,
  onDelete,
  onEdit,
}: {
  entry: WeightEntry;
  isLast: boolean;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const [translateX, setTranslateX] = useState(0);
  const [open, setOpen] = useState(false); // delete button visible
  const startX = useRef(0);
  const startY = useRef(0);
  const dragging = useRef(false);
  const locked = useRef(false); // axis locked to horizontal

  const DELETE_BTN_W = 72;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    dragging.current = true;
    locked.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    // Lock to horizontal once direction is clear
    if (!locked.current) {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      if (Math.abs(dy) > Math.abs(dx)) { dragging.current = false; return; }
      locked.current = true;
    }

    e.preventDefault(); // prevent scroll while swiping horizontally
    const base = open ? -DELETE_BTN_W : 0;
    const next = Math.min(0, Math.max(-DELETE_BTN_W - 12, base + dx));
    setTranslateX(next);
  };

  const handleTouchEnd = () => {
    dragging.current = false;
    const threshold = open ? -(DELETE_BTN_W / 2) : -DELETE_THRESHOLD;
    if (translateX < threshold) {
      setTranslateX(-DELETE_BTN_W);
      setOpen(true);
    } else {
      setTranslateX(0);
      setOpen(false);
    }
  };

  const close = () => { setTranslateX(0); setOpen(false); };

  const handleTap = () => {
    if (open) { close(); return; }
    onEdit();
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", borderBottom: isLast ? "none" : "1px solid #F0F5FB" }}>
      {/* Delete button (behind the row) */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0,
        width: DELETE_BTN_W, background: "#FF3B30",
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: isLast ? "0 0 12px 0" : 0,
      }}>
        <button onClick={onDelete}
          style={{ width: "100%", height: "100%", border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <span style={{ fontSize: 20 }}>×</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>削除</span>
        </button>
      </div>

      {/* Row content */}
      <div
        onClick={handleTap}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "13px 4px",
          background: "#fff",
          transform: `translateX(${translateX}px)`,
          transition: dragging.current ? "none" : "transform 0.28s cubic-bezier(.2,.8,.2,1)",
          cursor: "pointer",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: "#8AA0B8" }}>{fmtDate(entry.d)}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#243B53", fontVariantNumeric: "tabular-nums" }}>
            {entry.kg.toFixed(1)} kg
          </span>
          {/* Swipe hint icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D0DEEE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Edit modal ────────────────────────────────────────────────────────────
function EditModal({
  entry,
  onSave,
  onClose,
}: {
  entry: WeightEntry;
  onSave: (kg: number) => void;
  onClose: () => void;
}) {
  const [val, setVal] = useState(entry.kg.toFixed(1));

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,40,70,0.32)", zIndex: 300 }} />
      <div style={{
        position: "fixed", left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 301,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderRadius: 26,
        padding: "24px 22px 20px",
        width: "calc(100% - 48px)",
        maxWidth: 340,
        boxShadow: "0 20px 60px rgba(20,40,70,0.22)",
      }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#243B53", marginBottom: 4 }}>体重を編集</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#8AA0B8", marginBottom: 18 }}>{fmtDateFull(entry.d)}</div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <button onClick={() => setVal((v) => (Math.round((parseFloat(v) - 0.1) * 10) / 10).toFixed(1))}
            style={{ width: 46, height: 46, borderRadius: 14, border: "none", background: "rgba(61,155,255,0.10)", color: "#3D9BFF", fontSize: 22, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>−</button>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="number"
              step="0.1"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onBlur={() => {
                const n = parseFloat(val);
                if (!isNaN(n) && n > 0) setVal(n.toFixed(1));
              }}
              style={{
                width: "100%", textAlign: "center", fontSize: 36, fontWeight: 800,
                fontVariantNumeric: "tabular-nums", color: "#243B53",
                background: "#F0F7FF", border: "none", borderRadius: 14,
                padding: "10px 0", outline: "none",
                WebkitAppearance: "none",
              } as React.CSSProperties}
            />
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, fontWeight: 800, color: "#8AA0B8" }}>kg</span>
          </div>
          <button onClick={() => setVal((v) => (Math.round((parseFloat(v) + 0.1) * 10) / 10).toFixed(1))}
            style={{ width: 46, height: 46, borderRadius: 14, border: "none", background: "rgba(61,155,255,0.10)", color: "#3D9BFF", fontSize: 22, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>＋</button>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose}
            style={{ flex: 1, height: 48, borderRadius: 14, border: "1.5px solid #E3EDF8", background: "#fff", color: "#8AA0B8", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
            キャンセル
          </button>
          <button onClick={() => { const n = parseFloat(val); if (!isNaN(n) && n > 0) { onSave(n); onClose(); } }}
            style={{ flex: 2, height: 48, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#4EA6FF,#3D7BFF)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 6px 16px rgba(61,123,255,0.28)" }}>
            保存する
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main GraphPage ────────────────────────────────────────────────────────
export default function GraphPage({ store }: { store: StoreResult }) {
  const { state, consumed, removeWeightEntry, editWeightEntry } = store;
  const [weightPeriod, setWeightPeriod] = useState<"週" | "月">("週");
  const [editEntry, setEditEntry] = useState<WeightEntry | null>(null);

  const fullHistory = state.weightHistory;
  const wData = weightPeriod === "週" ? fullHistory.slice(-7) : fullHistory;
  const wValues = wData.map((e) => e.kg);

  const hasWeight = wValues.length >= 2;
  const totalDown = fullHistory.length >= 2
    ? Math.round((fullHistory[0].kg - state.weight) * 10) / 10 : 0;

  const calData = [...state.calWeek.slice(0, 6), consumed];
  const hasCalories = calData.some((c) => c > 0);
  const maxCal = Math.max(...calData, state.calTarget) * 1.1;
  const BAR_H = 120;
  const targetLineY = BAR_H * (1 - state.calTarget / maxCal);
  const daysUnder = calData.filter((c, i) => i < 6 && c > 0 && c <= state.calTarget).length;

  const W = 320, H = 150, padX = 12, padTop = 10, padBot = 10;
  const chart = hasWeight ? lineP(wValues, W, H, padX, padTop, padBot) : null;

  const historyList = [...fullHistory].reverse().slice(0, 20);

  return (
    <div style={{ padding: "0 18px", paddingBottom: 24 }}>
      <div style={{ paddingTop: 22, paddingBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22 }}>📈</span>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#243B53" }}>グラフ</h1>
      </div>

      {/* Weight chart card */}
      <div style={{ background: "#fff", borderRadius: 26, padding: 20, boxShadow: "0 10px 30px rgba(61,155,255,0.10)", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#243B53" }}>体重の変化</span>
          <div style={{ background: "#F0F7FF", borderRadius: 12, display: "flex", padding: 3, gap: 2 }}>
            {(["週", "月"] as const).map((p) => (
              <button key={p} onClick={() => setWeightPeriod(p)}
                style={{ padding: "4px 14px", borderRadius: 10, border: "none", cursor: "pointer", background: weightPeriod === p ? "#fff" : "transparent", boxShadow: weightPeriod === p ? "0 2px 6px rgba(61,155,255,0.15)" : "none", color: weightPeriod === p ? "#243B53" : "#8AA0B8", fontSize: 13, fontWeight: 800 }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {hasWeight && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 30, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: "#243B53" }}>{state.weight.toFixed(1)} kg</span>
            {totalDown !== 0 && (
              <div style={{ background: totalDown > 0 ? "#E2FBF4" : "#FFEEF0", color: totalDown > 0 ? "#2FB39A" : "#FF6B6B", borderRadius: 999, padding: "3px 12px", fontSize: 13, fontWeight: 800 }}>
                {totalDown > 0 ? "⬇" : "⬆"} {Math.abs(totalDown)}kg
              </div>
            )}
          </div>
        )}

        {hasWeight && chart ? (
          <>
            <div style={{ width: "100%", overflowX: "hidden" }}>
              <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
                <defs>
                  <linearGradient id="pgrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3D9BFF" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#3D9BFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={chart.area} fill="url(#pgrad)" />
                <path d={chart.d} fill="none" stroke="#3D9BFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                {chart.pts.map((pt, i) => (
                  <circle key={i} cx={pt[0]} cy={pt[1]} r={i === chart.pts.length - 1 ? 5.5 : 4} fill="#fff" stroke="#3D9BFF" strokeWidth="2.5" />
                ))}
              </svg>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#8AA0B8" }}>{fmtDate(wData[0].d)}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#8AA0B8" }}>{fmtDate(wData[Math.floor(wData.length / 2)].d)}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#8AA0B8" }}>きょう</span>
            </div>
          </>
        ) : (
          <div style={{ height: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#B0C8E0", gap: 8 }}>
            <span style={{ fontSize: 36 }}>📉</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>体重を2日以上記録すると</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>グラフが表示されます</span>
          </div>
        )}
      </div>

      {/* Calorie card */}
      <div style={{ background: "#fff", borderRadius: 26, padding: 20, boxShadow: "0 10px 30px rgba(61,155,255,0.10)", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#243B53", marginBottom: 14 }}>食べたカロリー</div>
        {hasCalories ? (
          <>
            <div style={{ position: "relative", height: BAR_H + 24 }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: targetLineY, borderTop: "2px dashed #FFC24B", zIndex: 1 }} />
              <div style={{ display: "flex", alignItems: "flex-end", height: BAR_H, gap: 6 }}>
                {calData.map((c, i) => {
                  const barH = c > 0 ? Math.max(4, (c / maxCal) * BAR_H) : 4;
                  const bg = c === 0 ? "#E3EDF8" : c > state.calTarget ? "linear-gradient(#FF8C8C,#FF6B6B)" : "linear-gradient(#3D9BFF,#2E7BE0)";
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: "100%", height: barH, borderRadius: "6px 6px 4px 4px", background: bg }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                {DAY_LABELS.map((d, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: 700, color: i === 6 ? "#3D9BFF" : "#8AA0B8" }}>{d}</div>
                ))}
              </div>
            </div>
            <div style={{ background: "#F0F7FF", borderRadius: 14, padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#243B53", marginTop: 10 }}>
              👍 今週は <b style={{ color: "#3D9BFF" }}>{daysUnder}日</b> 目標カロリー以内！いい調子です。
            </div>
          </>
        ) : (
          <div style={{ height: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#B0C8E0", gap: 8 }}>
            <span style={{ fontSize: 36 }}>🍽</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>食事を記録するとカロリーの</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>グラフが表示されます</span>
          </div>
        )}
      </div>

      {/* Weight history list with swipe-to-delete */}
      {historyList.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 26, boxShadow: "0 10px 30px rgba(61,155,255,0.10)", overflow: "hidden" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#243B53", padding: "16px 20px 12px" }}>
            体重の記録
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#B0C8E0", padding: "0 20px 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            左にスワイプで削除、タップで編集
          </div>
          <div style={{ padding: "0 16px 4px" }}>
            {historyList.map((e, i) => (
              <WeightRow
                key={e.d}
                entry={e}
                isLast={i === historyList.length - 1}
                onDelete={() => removeWeightEntry(e.d)}
                onEdit={() => setEditEntry(e)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editEntry && (
        <EditModal
          entry={editEntry}
          onSave={(kg) => editWeightEntry(editEntry.d, kg)}
          onClose={() => setEditEntry(null)}
        />
      )}
    </div>
  );
}
