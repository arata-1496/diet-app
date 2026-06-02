"use client";

import { useState } from "react";
import { StoreResult } from "@/lib/store";

function lineP(values: number[], w: number, h: number, padX = 0, padTop = 0, padBot = 0) {
  const min = Math.min(...values), max = Math.max(...values);
  const range = (max - min) || 1;
  const iw = w - padX * 2, ih = h - padTop - padBot;
  const pts: [number, number][] = values.map((v, i) => [padX + (iw * i) / (values.length - 1), padTop + ih - ((v - min) / range) * ih]);
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  const area = d + ` L ${pts[pts.length - 1][0]},${h - padBot} L ${pts[0][0]},${h - padBot} Z`;
  return { d, area, pts };
}

export default function GraphPage({ store }: { store: StoreResult }) {
  const { state, consumed } = store;
  const [weightPeriod, setWeightPeriod] = useState<"週" | "月">("週");

  const fullHistory = state.weightHistory;
  const wData = weightPeriod === "週" ? fullHistory.slice(-7) : fullHistory;
  const wValues = wData.map((e) => e.kg);
  const totalDown = Math.round((fullHistory[0].kg - state.weight) * 10) / 10;

  // Calorie chart: calWeek with last element replaced by consumed
  const calData = [...state.calWeek.slice(0, 6), consumed];
  const DAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];
  const daysUnder = calData.filter((c, i) => i < 6 && c > 0 && c <= state.calTarget).length;

  // Weight chart dimensions
  const W = 320, H = 150, padX = 12, padTop = 10, padBot = 10;
  const { d: wPath, area: wArea, pts: wPts } = lineP(wValues, W, H, padX, padTop, padBot);

  // X-axis labels
  const firstDate = wData[0]?.d?.slice(5) ?? "";
  const midDate = wData[Math.floor(wData.length / 2)]?.d?.slice(5) ?? "";

  // Calorie bar chart
  const maxCal = Math.max(...calData, state.calTarget) * 1.1;
  const BAR_H = 120;
  const targetY = BAR_H * (1 - state.calTarget / maxCal);

  return (
    <div style={{ padding: "0 18px", paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ paddingTop: 22, paddingBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22 }}>📈</span>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#243B53" }}>グラフ</h1>
      </div>

      {/* Weight card */}
      <div style={{ background: "#fff", borderRadius: 26, padding: 20, boxShadow: "0 10px 30px rgba(61,155,255,0.10)", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#243B53" }}>体重の変化</span>
          <div style={{ background: "#F0F7FF", borderRadius: 12, display: "flex", padding: 3, gap: 2 }}>
            {(["週", "月"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setWeightPeriod(p)}
                style={{
                  padding: "4px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: weightPeriod === p ? "#fff" : "transparent",
                  boxShadow: weightPeriod === p ? "0 2px 6px rgba(61,155,255,0.15)" : "none",
                  color: weightPeriod === p ? "#243B53" : "#8AA0B8",
                  fontSize: 13, fontWeight: 800,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 30, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: "#243B53" }}>{state.weight.toFixed(1)} kg</span>
          <div style={{ background: "#E2FBF4", color: "#2FB39A", borderRadius: 999, padding: "3px 12px", fontSize: 13, fontWeight: 800 }}>
            ⬇ {totalDown}kg
          </div>
        </div>

        {/* SVG chart */}
        <div style={{ width: "100%", overflowX: "hidden" }}>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
            <defs>
              <linearGradient id="pgrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3D9BFF" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#3D9BFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={wArea} fill="url(#pgrad)" />
            <path d={wPath} fill="none" stroke="#3D9BFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {wPts.map((pt, i) => (
              <circle
                key={i}
                cx={pt[0]}
                cy={pt[1]}
                r={i === wPts.length - 1 ? 5.5 : 4}
                fill="#fff"
                stroke="#3D9BFF"
                strokeWidth="2.5"
              />
            ))}
          </svg>
        </div>

        {/* X axis */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#8AA0B8" }}>{firstDate}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#8AA0B8" }}>{midDate}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#8AA0B8" }}>きょう</span>
        </div>
      </div>

      {/* Calorie card */}
      <div style={{ background: "#fff", borderRadius: 26, padding: 20, boxShadow: "0 10px 30px rgba(61,155,255,0.10)", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#243B53", marginBottom: 14 }}>食べたカロリー</div>

        {/* Bar chart */}
        <div style={{ position: "relative", height: BAR_H + 24 }}>
          {/* Target line */}
          <div style={{
            position: "absolute", left: 0, right: 0, top: targetY,
            borderTop: "2px dashed #FFC24B",
            zIndex: 1,
          }} />
          <div style={{ display: "flex", alignItems: "flex-end", height: BAR_H, gap: 6 }}>
            {calData.map((c, i) => {
              const barH = c > 0 ? Math.max(4, (c / maxCal) * BAR_H) : 4;
              const isEmpty = c === 0;
              const isOver = c > state.calTarget;
              const bg = isEmpty
                ? "#E3EDF8"
                : isOver
                ? "linear-gradient(#FF8C8C,#FF6B6B)"
                : "linear-gradient(#3D9BFF,#2E7BE0)";
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: "100%", height: barH, borderRadius: "6px 6px 4px 4px",
                    background: bg,
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            {DAY_LABELS.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: 700, color: "#8AA0B8" }}>{d}</div>
            ))}
          </div>
        </div>

        {/* Summary pill */}
        <div style={{ background: "#F0F7FF", borderRadius: 14, padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#243B53", marginTop: 10 }}>
          👍 今週は {daysUnder}日 目標カロリー以内！いい調子です。
        </div>
      </div>
    </div>
  );
}
