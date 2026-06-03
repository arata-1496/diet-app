"use client";

import { useRef, useEffect, useCallback } from "react";

const ITEM_H = 44;

interface Props {
  items: string[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  visible?: number; // default 5 (must be odd)
}

export default function DialColumn({ items, selectedIndex, onSelect, visible = 5 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoreScrollRef = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const target = selectedIndex * ITEM_H;
    if (Math.abs(ref.current.scrollTop - target) < 2) return;
    ignoreScrollRef.current = true;
    ref.current.scrollTop = target;
    setTimeout(() => { ignoreScrollRef.current = false; }, 60);
  }, [selectedIndex]);

  const handleScroll = useCallback(() => {
    if (ignoreScrollRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!ref.current) return;
      const idx = Math.round(ref.current.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      onSelect(clamped);
      ignoreScrollRef.current = true;
      ref.current.scrollTo({ top: clamped * ITEM_H, behavior: "smooth" });
      setTimeout(() => { ignoreScrollRef.current = false; }, 300);
    }, 80);
  }, [items.length, onSelect]);

  const containerH = ITEM_H * visible;
  const padH = ITEM_H * Math.floor(visible / 2);

  return (
    <div style={{ position: "relative", height: containerH, flex: 1 }}>
      {/* selection highlight */}
      <div style={{
        position: "absolute", top: padH, height: ITEM_H, left: 4, right: 4,
        background: "rgba(61,155,255,0.14)", borderRadius: 12,
        pointerEvents: "none", zIndex: 1,
      }} />
      {/* gradient fade */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
        background: `linear-gradient(to bottom,
          rgba(255,255,255,0.92) 0%,
          rgba(255,255,255,0.30) 28%,
          transparent 42%,
          transparent 58%,
          rgba(255,255,255,0.30) 72%,
          rgba(255,255,255,0.92) 100%)`,
      }} />
      <div
        ref={ref}
        onScroll={handleScroll}
        style={{
          height: "100%", overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        } as React.CSSProperties}
      >
        <div style={{ height: padH }} />
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => onSelect(i)}
            style={{
              height: ITEM_H,
              display: "flex", alignItems: "center", justifyContent: "center",
              scrollSnapAlign: "start",
              fontSize: 22, fontWeight: 800, color: "#243B53",
              fontVariantNumeric: "tabular-nums",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            {item}
          </div>
        ))}
        <div style={{ height: padH }} />
      </div>
    </div>
  );
}
