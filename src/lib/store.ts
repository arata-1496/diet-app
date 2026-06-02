"use client";

import { useState, useEffect, useCallback } from "react";

export interface Meal {
  id: number;
  type: string;
  name: string;
  kcal: number;
  time: string;
  emoji: string;
  tone: string;
  p: number;
  f: number;
  c: number;
}

export interface WeightEntry {
  d: string;
  kg: number;
}

export interface State {
  weight: number;
  weightHistory: WeightEntry[];
  meals: Meal[];
  calWeek: number[];
  calTarget: number;
  target: number;
  deadline: string;
  persona: "coach" | "spartan" | "friend" | "expert";
  focus: string[];
}

const INITIAL: State = {
  weight: 68.4,
  weightHistory: [
    { d: "2026-05-20", kg: 71.2 },
    { d: "2026-05-21", kg: 71.0 },
    { d: "2026-05-22", kg: 70.6 },
    { d: "2026-05-23", kg: 70.8 },
    { d: "2026-05-24", kg: 70.3 },
    { d: "2026-05-25", kg: 69.9 },
    { d: "2026-05-26", kg: 70.1 },
    { d: "2026-05-27", kg: 69.6 },
    { d: "2026-05-28", kg: 69.4 },
    { d: "2026-05-29", kg: 69.0 },
    { d: "2026-05-30", kg: 68.9 },
    { d: "2026-05-31", kg: 68.7 },
    { d: "2026-06-01", kg: 68.5 },
    { d: "2026-06-02", kg: 68.4 },
  ],
  meals: [
    { id: 1, type: "朝食", name: "アボカドトースト & コーヒー", kcal: 340, time: "7:40", emoji: "🥑", tone: "#8FBF6E", p: 12, f: 16, c: 38 },
    { id: 2, type: "昼食", name: "サラダチキンボウル", kcal: 480, time: "12:30", emoji: "🥗", tone: "#E0A23B", p: 38, f: 14, c: 42 },
    { id: 3, type: "間食", name: "プロテインヨーグルト", kcal: 130, time: "15:10", emoji: "🥛", tone: "#C97FB0", p: 18, f: 4, c: 9 },
  ],
  calWeek: [1920, 1750, 2100, 1680, 1840, 1600, 0],
  calTarget: 1800,
  target: 62.0,
  deadline: "9月30日",
  persona: "coach",
  focus: ["fat", "protein", "snack"],
};

const KEY = "dietB.v1";

function load(): State {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return INITIAL;
    return { ...INITIAL, ...JSON.parse(raw) };
  } catch {
    return INITIAL;
  }
}

function save(s: State) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export interface StoreResult {
  state: State;
  consumed: number;
  macros: { p: number; f: number; c: number };
  commitWeight: (kg: number) => void;
  addMeal: (m: Omit<Meal, "id">) => void;
  removeMeal: (id: number) => void;
  setPersona: (p: State["persona"]) => void;
  toggleFocus: (id: string) => void;
  setTarget: (v: number) => void;
  reset: () => void;
}

export function useStore(): StoreResult {
  const [state, setState] = useState<State>(INITIAL);

  useEffect(() => {
    setState(load());
  }, []);

  const update = useCallback((next: State) => {
    setState(next);
    save(next);
  }, []);

  const consumed = state.meals.reduce((s, m) => s + m.kcal, 0);
  const macros = state.meals.reduce(
    (acc, m) => ({ p: acc.p + m.p, f: acc.f + m.f, c: acc.c + m.c }),
    { p: 0, f: 0, c: 0 }
  );

  return {
    state,
    consumed,
    macros,
    commitWeight: (kg) => {
      const d = new Date().toISOString().slice(0, 10);
      const hist = [...state.weightHistory];
      const idx = hist.findIndex((e) => e.d === d);
      if (idx >= 0) hist[idx] = { d, kg };
      else hist.push({ d, kg });
      update({ ...state, weight: kg, weightHistory: hist.slice(-14) });
    },
    addMeal: (m) => {
      const id = Date.now();
      update({ ...state, meals: [...state.meals, { ...m, id }] });
    },
    removeMeal: (id) => {
      update({ ...state, meals: state.meals.filter((m) => m.id !== id) });
    },
    setPersona: (p) => update({ ...state, persona: p }),
    toggleFocus: (id) => {
      const focus = state.focus.includes(id)
        ? state.focus.filter((f) => f !== id)
        : [...state.focus, id];
      update({ ...state, focus });
    },
    setTarget: (v) => update({ ...state, target: v }),
    reset: () => update(INITIAL),
  };
}
