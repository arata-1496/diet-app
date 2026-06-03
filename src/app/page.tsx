"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import RecordPage from "@/components/RecordPage";
import GraphPage from "@/components/GraphPage";
import AIPage from "@/components/AIPage";
import SettingsPage from "@/components/SettingsPage";

type Tab = "rec" | "gph" | "ai" | "set";

const TABS: { id: Tab; label: string; path: string }[] = [
  { id: "rec", label: "きろく", path: "M4 20h16M6 16l9-9 3 3-9 9H6v-3Z" },
  { id: "gph", label: "グラフ", path: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
  { id: "ai", label: "AI", path: "M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" },
  { id: "set", label: "せってい", path: "M12 9a3 3 0 100 6 3 3 0 000-6Zm9 3-2 .4-.5 1.3 1.1 1.8-1.5 1.5-1.8-1.1-1.3.5L15 21H9l-.4-2-1.3-.5-1.8 1.1L4 18.1 5.1 16.3 4.6 15 2.6 14.6V8.6L4.6 9 5.1 7.7 4 5.9 5.5 4.4 7.3 5.5 8.6 5 9 3h6l.4 2 1.3.5 1.8-1.1L20 5.9 18.9 7.7l.5 1.3L21 9.4Z" },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("rec");
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const store = useStore();

  const showToast = (msg: string) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1900);
  };

  return (
    <div className="app-root">
      {/* Toast */}
      <div style={{
        position: "absolute",
        top: toastVisible ? "calc(env(safe-area-inset-top) + 16px)" : "-60px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#243B53",
        color: "#fff",
        borderRadius: 999,
        padding: "10px 22px",
        fontSize: 14,
        fontWeight: 700,
        zIndex: 9999,
        whiteSpace: "nowrap",
        transition: "top 0.28s cubic-bezier(.2,.8,.2,1)",
        pointerEvents: "none",
      }}>
        {toast}
      </div>

      {/* Page content */}
      <div className="app-content">
        {tab === "rec" && <RecordPage store={store} showToast={showToast} />}
        {tab === "gph" && <GraphPage store={store} />}
        {tab === "ai" && <AIPage store={store} showToast={showToast} />}
        {tab === "set" && <SettingsPage store={store} showToast={showToast} />}
      </div>

      {/* TabBar — floats above home indicator via safe-area padding */}
      <div className="app-tabbar">
        <div className="app-tabbar-inner">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  flex: 1,
                  border: "none",
                  cursor: "pointer",
                  background: "none",
                  padding: 0,
                }}
              >
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  width: 44,
                  height: 34,
                  borderRadius: 14,
                  background: active ? "#3D9BFF" : "transparent",
                  transition: "background 0.18s",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#B7C6D8"} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                    <path d={t.path} />
                  </svg>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: active ? "#3D9BFF" : "#B7C6D8" }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
