"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface DataPoint {
  date: string;
  value: number;
}

export default function WeightChart({ data }: { data: DataPoint[] }) {
  const labels = data.map((d) => {
    const dt = new Date(d.date + "T00:00:00");
    return `${dt.getMonth() + 1}/${dt.getDate()}`;
  });

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max((max - min) * 0.3, 0.5);

  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            data: values,
            borderColor: "#007AFF",
            backgroundColor: "rgba(0,122,255,0.12)",
            borderWidth: 2.5,
            pointBackgroundColor: "#007AFF",
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: true,
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
              label: (ctx) => ` ${(ctx.parsed.y ?? 0).toFixed(1)} kg`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(84,84,88,0.3)" },
            ticks: { color: "rgba(235,235,245,0.5)", font: { size: 11 } },
          },
          y: {
            min: Math.floor((min - pad) * 10) / 10,
            max: Math.ceil((max + pad) * 10) / 10,
            grid: { color: "rgba(84,84,88,0.3)" },
            ticks: { color: "rgba(235,235,245,0.5)", font: { size: 11 }, callback: (v) => `${v}kg` },
          },
        },
      }}
    />
  );
}
