import { DailyRecord } from "@/types/diet";

const KEY = "diet_records";

export function loadRecords(): DailyRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveRecord(record: DailyRecord): void {
  const records = loadRecords();
  const idx = records.findIndex((r) => r.date === record.date);
  if (idx >= 0) {
    records[idx] = record;
  } else {
    records.push(record);
  }
  records.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(KEY, JSON.stringify(records));
}

export function getRecord(date: string): DailyRecord | undefined {
  return loadRecords().find((r) => r.date === date);
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}
