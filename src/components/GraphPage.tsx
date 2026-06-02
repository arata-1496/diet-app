"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { loadRecords } from "@/lib/storage";
import { DailyRecord } from "@/types/diet";

const LineChart = dynamic(() => import("./WeightChart"), { ssr: false });
const CalChart = dynamic(() => import("./CalorieChart"), { ssr: false });

export default function GraphPage() {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [period, setPeriod] = useState<7 | 14 | 30>(14);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const filtered = records.slice(-period);

  const weightData = filtered
    .filter((r) => r.weight != null)
    .map((r) => ({ date: r.date, value: r.weight! }));

  const calorieData = filtered.map((r) => ({
    date: r.date,
    value:
      (r.breakfast?.calories ?? 0) +
      (r.lunch?.calories ?? 0) +
      (r.dinner?.calories ?? 0) +
      (r.snack?.calories ?? 0),
  }));

  const latestWeight = weightData.at(-1)?.value;
  const prevWeight = weightData.at(-2)?.value;
  const weightDiff = latestWeight && prevWeight ? latestWeight - prevWeight : null;

  const avgCalories =
    calorieData.filter((d) => d.value > 0).reduce((s, d) => s + d.value, 0) /
    (calorieData.filter((d) => d.value > 0).length || 1);

  return (
    <div style={{ padding: "0 16px" }}>
      {/* Header */}
      <div className="safe-top" style={{ paddingBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", paddingTop: 16 }}>グラフ</h1>
      </div>

      {/* Period selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {([7, 14, 30] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              border: "none",
              background: period === p ? "var(--ios-blue)" : "rgba(118,118,128,0.18)",
              color: period === p ? "#fff" : "var(--ios-label2)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {p}日
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <StatCard
          emoji="⚖️"
          label="最新体重"
          value={latestWeight ? `${latestWeight.toFixed(1)} kg` : "---"}
          sub={
            weightDiff !== null
              ? `前日比 ${weightDiff > 0 ? "+" : ""}${weightDiff.toFixed(1)} kg`
              : undefined
          }
          subColor={weightDiff != null ? (weightDiff > 0 ? "var(--ios-red)" : "var(--ios-green)") : undefined}
        />
        <StatCard
          emoji="🔥"
          label="平均カロリー"
          value={avgCalories > 0 ? `${Math.round(avgCalories)} kcal` : "---"}
          sub="1日平均"
        />
      </div>

      {/* Weight chart */}
      <div style={{ marginBottom: 20 }}>
        <p className="section-label">体重推移</p>
        <div className="glass-card" style={{ padding: 16 }}>
          {weightData.length >= 2 ? (
            <LineChart data={weightData} />
          ) : (
            <EmptyChart message="体重を2日以上記録すると\nグラフが表示されます" />
          )}
        </div>
      </div>

      {/* Calorie chart */}
      <div style={{ marginBottom: 20 }}>
        <p className="section-label">カロリー推移</p>
        <div className="glass-card" style={{ padding: 16 }}>
          {calorieData.some((d) => d.value > 0) ? (
            <CalChart data={calorieData} />
          ) : (
            <EmptyChart message="食事のカロリーを入力すると\nグラフが表示されます" />
          )}
        </div>
      </div>

      {/* Recent records list */}
      <div style={{ marginBottom: 20 }}>
        <p className="section-label">記録一覧</p>
        <div className="glass-card" style={{ overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "var(--ios-label2)", fontSize: 15 }}>
              まだ記録がありません
            </div>
          ) : (
            [...filtered].reverse().map((rec) => (
              <RecordRow key={rec.date} record={rec} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  emoji,
  label,
  value,
  sub,
  subColor,
}: {
  emoji: string;
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
}) {
  return (
    <div className="glass-card" style={{ flex: 1, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{emoji}</span>
        <span style={{ fontSize: 12, color: "var(--ios-label2)", fontWeight: 500 }}>{label}</span>
      </div>
      <p style={{ fontSize: 22, fontWeight: 700 }}>{value}</p>
      {sub && (
        <p style={{ fontSize: 12, color: subColor ?? "var(--ios-label2)", marginTop: 4 }}>{sub}</p>
      )}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div
      style={{
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--ios-label3)",
        fontSize: 14,
        textAlign: "center",
        whiteSpace: "pre-line",
      }}
    >
      {message}
    </div>
  );
}

function RecordRow({ record }: { record: DailyRecord }) {
  const totalCal =
    (record.breakfast?.calories ?? 0) +
    (record.lunch?.calories ?? 0) +
    (record.dinner?.calories ?? 0) +
    (record.snack?.calories ?? 0);

  const dt = new Date(record.date + "T00:00:00");
  const dateStr = dt.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric", weekday: "short" });

  return (
    <div className="list-row" style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600 }}>{dateStr}</p>
        <p style={{ fontSize: 12, color: "var(--ios-label2)", marginTop: 2 }}>
          {[record.breakfast, record.lunch, record.dinner, record.snack]
            .filter(Boolean)
            .map((m) => m!.description)
            .filter(Boolean)
            .join(" / ") || "食事未記録"}
        </p>
      </div>
      <div style={{ textAlign: "right" }}>
        {record.weight && (
          <p style={{ fontSize: 16, fontWeight: 700 }}>{record.weight.toFixed(1)} kg</p>
        )}
        {totalCal > 0 && (
          <p style={{ fontSize: 12, color: "var(--ios-orange)" }}>{totalCal} kcal</p>
        )}
      </div>
    </div>
  );
}
