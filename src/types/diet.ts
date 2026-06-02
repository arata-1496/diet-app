export interface MealEntry {
  description: string;
  calories?: number;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  weight?: number;
  breakfast?: MealEntry;
  lunch?: MealEntry;
  dinner?: MealEntry;
  snack?: MealEntry;
  aiComment?: string;
  aiCommentedAt?: string;
}
