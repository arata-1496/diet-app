"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, LineElement, PointElement);

interface DataPoint {
  date: string;
  value: number;
}

const TARGET = 2000;

export default function CalorieChart({ data }: { data: DataPoint[] }) {
  const labels = data.map((d) => {
    const dt = new Date(d.date + "T00:00:00");
    return `${dt.getMonth() + 1}/${dt.getDate()}`;
  });

  const values = data.map((d) => d.value);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: values.map((v) =>
              v === 0 ? "rgba(118,118,128,0.2)" : v > TARGET ? "rgba(255,59,48,0.7)" : "rgba(255,149,0,0.7)"
            ),
            borderColor: values.map((v) =>
              v === 0 ? "transparent" : v > TARGET ? "#FF3B30" : "#FF9500"
            ),
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(28,28,30,0.92)",
            titleColor: "rgba(235,235,245,0.6)",
            bodyColor: "#fff",
            bodyFont: { size: 15, weight: "bold" },
            callbacks: {
              label: (ctx) =>
                (ctx.parsed.y ?? 0) === 0 ? " 未記録" : ` ${(ctx.parsed.y ?? 0).toLocaleString()} kcal`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "rgba(235,235,245,0.5)", font: { size: 11 } },
          },
          y: {
            grid: { color: "rgba(84,84,88,0.3)" },
            ticks: {
              color: "rgba(235,235,245,0.5)",
              font: { size: 11 },
              callback: (v) => `${v}`,
            },
          },
        },
      }}
    />
  );
}
