// @ts-nocheck
"use client";

import { FoodIcon, FOOD_ICONS } from "./FoodIcons";

/**
 * meal.emoji がカスタムアイコンキー（"ramen" など）なら SVG を表示、
 * それ以外（旧Unicode絵文字 "🍜" など）はそのまま文字で表示。
 */
export function MealEmoji({ emoji, size = 24 }: { emoji: string; size?: number }) {
  if (FOOD_ICONS && FOOD_ICONS[emoji]) {
    return <FoodIcon name={emoji} mode="fill" size={size} />;
  }
  return <span style={{ fontSize: size, lineHeight: 1 }}>{emoji}</span>;
}

/** カスタムアイコンキーならその tint 色を、なければ fallback を返す */
export function getMealBg(emoji: string, fallback: string): string {
  if (FOOD_ICONS && FOOD_ICONS[emoji]) return FOOD_ICONS[emoji].tint;
  return fallback + "26";
}
