/**
 * Meal Service - Handle local storage operations for meals
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from './firebase';

export interface MealData {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp?: string | number;
}

/**
 * Save a meal to Local Storage scoped by UID
 * @param meal - Nutrition data of the food
 */
export async function saveMeal(meal: MealData): Promise<void> {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const uid = user.uid;
  const storageKey = `meals_${uid}`;

  try {
    const mealWithTimestamp = {
      ...meal,
      timestamp: new Date().toISOString(),
    };

    // Get existing meals
    const existingData = await AsyncStorage.getItem(storageKey);
    let meals = [];
    
    if (existingData) {
      meals = JSON.parse(existingData);
    }

    // Add new meal
    meals.push(mealWithTimestamp);

    // Save back to local storage
    await AsyncStorage.setItem(storageKey, JSON.stringify(meals));
    
    console.log(`[MealService] Meal saved locally for UID: ${uid}`);
  } catch (error) {
    console.error('[MealService] Error saving meal locally:', error);
    throw error;
  }
}

/**
 * Get all meals for the current user
 */
export async function getMeals(): Promise<MealData[]> {
  const user = getCurrentUser();
  if (!user) return [];

  try {
    const data = await AsyncStorage.getItem(`meals_${user.uid}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[MealService] Error fetching meals:', error);
    return [];
  }
}

/**
 * Get all meals grouped by date
 */
export async function getMealsGroupedByDate(): Promise<Record<string, MealData[]>> {
  const meals = await getMeals();
  const grouped: Record<string, MealData[]> = {};

  meals.forEach((meal) => {
    const date = new Date(meal.timestamp || Date.now()).toISOString().split('T')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(meal);
  });

  return grouped;
}
