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
  d: string; // YYYY-MM-DD
  kg: number;
}

export interface State {
  weight: number;
  weightHistory: WeightEntry[];
  meals: Meal[];
  calWeek: number[]; // [Mon..Sun], 7 items
  calTarget: number;
  target: number;
  deadline: string; // YYYY-MM-DD
  persona: "coach" | "spartan" | "friend" | "expert";
  focus: string[];
}

const TODAY = new Date().toISOString().slice(0, 10);

const INITIAL: State = {
  weight: 60.0,
  weightHistory: [],
  meals: [],
  calWeek: [0, 0, 0, 0, 0, 0, 0],
  calTarget: 1800,
  target: 58.0,
  deadline: "", // 未設定
  persona: "coach",
  focus: [],
};

const KEY = "dietB.v1";

function isValidDate(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function load(): State {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw);
    // migrate old deadline format (e.g. "9月30日")
    if (parsed.deadline && !isValidDate(parsed.deadline)) {
      parsed.deadline = "";
    }
    return { ...INITIAL, ...parsed };
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
  setDeadline: (d: string) => void;
  removeWeightEntry: (date: string) => void;
  editWeightEntry: (date: string, kg: number) => void;
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
      const hist = [...state.weightHistory];
      const idx = hist.findIndex((e) => e.d === TODAY);
      if (idx >= 0) hist[idx] = { d: TODAY, kg };
      else hist.push({ d: TODAY, kg });
      // keep last 60 days
      hist.sort((a, b) => a.d.localeCompare(b.d));
      update({ ...state, weight: kg, weightHistory: hist.slice(-60) });
    },
    addMeal: (m) => {
      update({ ...state, meals: [...state.meals, { ...m, id: Date.now() }] });
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
    setDeadline: (d) => update({ ...state, deadline: d }),
    removeWeightEntry: (date) => {
      const hist = state.weightHistory.filter((e) => e.d !== date);
      const latest = hist.length > 0 ? hist[hist.length - 1].kg : state.weight;
      update({ ...state, weightHistory: hist, weight: latest });
    },
    editWeightEntry: (date, kg) => {
      const hist = state.weightHistory.map((e) => e.d === date ? { d: date, kg } : e);
      const todayEntry = hist.find((e) => e.d === TODAY);
      update({ ...state, weightHistory: hist, weight: todayEntry ? todayEntry.kg : kg });
    },
    reset: () => {
      localStorage.removeItem(KEY);
      update(INITIAL);
    },
  };
}
