/**
 * Diet plan and recommendation models
 */
import { NutritionInfo } from './nutrition';

export interface DietRecommendation {
  id: string;
  title: string;
  description: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  category: 'calorie' | 'protein' | 'hydration' | 'variety' | 'timing';
}

export interface MealSlot {
  name: string;
  time: string;
  foods: string[];
  nutrition: NutritionInfo;
}

export interface DietPlan {
  id: string;
  name: string;
  description: string;
  dailyCalorieTarget: number;
  durationDays: number;
  meals: MealSlot[];
  createdAt: number;
}
