"use client";

import { useState } from "react";
import RecordPage from "@/components/RecordPage";
import GraphPage from "@/components/GraphPage";

export default function Home() {
  const [tab, setTab] = useState<"record" | "graph">("record");

  return (
    <div style={{ background: "var(--ios-bg)", minHeight: "100vh", position: "relative" }}>
      {/* Background gradient orbs */}
      <div className="bg-orb" style={{ width: 300, height: 300, background: "#007AFF", top: -80, right: -60 }} />
      <div className="bg-orb" style={{ width: 250, height: 250, background: "#AF52DE", bottom: 120, left: -80 }} />

      {/* Page content */}
      <div style={{ position: "relative", zIndex: 1, paddingBottom: 84 }}>
        {tab === "record" ? <RecordPage /> : <GraphPage />}
      </div>

      {/* Bottom tab bar */}
      <nav className="tab-bar">
        <TabItem
          icon={tab === "record" ? "✏️" : "✏️"}
          label="記録"
          active={tab === "record"}
          onClick={() => setTab("record")}
        />
        <TabItem
          icon="📊"
          label="グラフ"
          active={tab === "graph"}
          onClick={() => setTab("graph")}
        />
      </nav>
    </div>
  );
}

function TabItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: "10px 24px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: active ? "var(--ios-blue)" : "var(--ios-label3)",
        transition: "color 0.2s",
        minWidth: 80,
      }}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.02em" }}>{label}</span>
    </button>
  );
}
