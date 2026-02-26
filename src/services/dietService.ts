/**
 * Diet recommendations and plan generation service
 */
import { api } from './api';
import { API_ENDPOINTS } from '@constants';
import {
  DietRecommendation,
  DietPlan,
  MealSlot,
} from '@models/diet';
import { NutritionInfo } from '@models/nutrition';

export interface GetRecommendationsParams {
  dailyCalories: number;
  consumedCalories: number;
  goalCalories: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
}

/**
 * Fetch diet recommendations based on current intake vs goal
 */
export async function getRecommendations(
  params: GetRecommendationsParams,
): Promise<DietRecommendation[]> {
  try {
    const { data } = await api.post<DietRecommendation[]>(
      API_ENDPOINTS.DIET_RECOMMEND,
      params,
    );
    return Array.isArray(data) ? data : [];
  } catch {
    return getMockRecommendations(params);
  }
}

/**
 * Generate personalized diet plan
 */
export async function generateDietPlan(params: {
  goalCalories: number;
  durationDays: number;
  preference?: string;
}): Promise<DietPlan> {
  try {
    const { data } = await api.post<DietPlan>(
      API_ENDPOINTS.DIET_PLAN,
      params,
    );
    return data;
  } catch {
    return getMockDietPlan(params.goalCalories, params.durationDays);
  }
}

/** Mock recommendations for demo/offline */
function getMockRecommendations(
  params: GetRecommendationsParams,
): DietRecommendation[] {
  const recs: DietRecommendation[] = [];
  const remaining = params.goalCalories - params.consumedCalories;
  if (remaining > 400) {
    recs.push({
      id: '1',
      title: 'Add a healthy snack',
      description: 'You have room for a small snack. Consider fruit or nuts.',
      reason: 'Calorie deficit',
      priority: 'medium',
      category: 'calorie',
    });
  }
  if ((params.totalProtein ?? 0) < 50) {
    recs.push({
      id: '2',
      title: 'Increase protein intake',
      description: 'Aim for 50–80g protein per day for satiety and muscle.',
      reason: 'Low protein',
      priority: 'high',
      category: 'protein',
    });
  }
  recs.push({
    id: '3',
    title: 'Stay hydrated',
    description: 'Drink 6–8 glasses of water throughout the day.',
    reason: 'General wellness',
    priority: 'low',
    category: 'hydration',
  });
  return recs;
}

/** Mock diet plan for demo */
function getMockDietPlan(
  goalCalories: number,
  durationDays: number,
): DietPlan {
  const perMeal = Math.round(goalCalories / 3);
  const meals: MealSlot[] = [
    {
      name: 'Breakfast',
      time: '08:00',
      foods: ['Oatmeal with banana', 'Greek yogurt', 'Green tea'],
      nutrition: {
        calories: perMeal,
        protein: 15,
        carbs: 60,
        fat: 10,
      },
    },
    {
      name: 'Lunch',
      time: '13:00',
      foods: ['Grilled chicken salad', 'Quinoa', 'Mixed vegetables'],
      nutrition: {
        calories: perMeal,
        protein: 35,
        carbs: 45,
        fat: 12,
      },
    },
    {
      name: 'Dinner',
      time: '19:00',
      foods: ['Salmon', 'Brown rice', 'Steamed broccoli'],
      nutrition: {
        calories: perMeal,
        protein: 30,
        carbs: 40,
        fat: 15,
      },
    },
  ];
  return {
    id: `plan_${Date.now()}`,
    name: 'Balanced Weekly Plan',
    description: 'A balanced plan with three meals per day.',
    dailyCalorieTarget: goalCalories,
    durationDays,
    meals,
    createdAt: Date.now(),
  };
}
