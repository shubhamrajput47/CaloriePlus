/**
 * Nutrition domain models
 */

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize?: string;
  servingUnit?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  nutrition: NutritionInfo;
  imageUri?: string;
  scannedAt: number;
  source: 'camera' | 'upload' | 'manual';
}

export interface DailyIntake {
  date: string; // YYYY-MM-DD
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  items: FoodItem[];
  goalCalories: number;
}
