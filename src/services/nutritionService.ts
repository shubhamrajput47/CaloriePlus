/**
 * Nutrition AI service - analyze image and return food + nutrition
 * Supports: camera image URI or upload; returns FoodItem-ready data
 */
import { api } from './api';
import { env } from '@config/env';
import { FoodItem, NutritionInfo } from '@models/nutrition';
import { API_ENDPOINTS } from '@constants';

export interface AnalyzeImagePayload {
  imageBase64?: string;
  imageUri?: string;
}

/**
 * Analyze food image via backend AI endpoint.
 * Backend can use OpenAI Vision, Google Vision, or Nutritionix etc.
 */
export async function analyzeFoodImage(
  payload: AnalyzeImagePayload,
): Promise<FoodItem> {
  const url = env.nutritionAi.apiUrl
    ? `${env.nutritionAi.apiUrl}/analyze`
    : `${env.api.baseUrl}${API_ENDPOINTS.NUTRITION_ANALYZE}`;

  const body: Record<string, string> = {};
  if (payload.imageBase64) body.image = payload.imageBase64;
  if (payload.imageUri) body.uri = payload.imageUri;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(env.api.apiKey ? { 'X-API-Key': env.api.apiKey } : {}),
      ...(env.nutritionAi.apiKey
        ? { Authorization: `Bearer ${env.nutritionAi.apiKey}` }
        : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Analysis failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    name: string;
    nutrition: NutritionInfo;
    servingSize?: string;
    servingUnit?: string;
  };

  const nutrition = data.nutrition ?? {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
  if (data.servingSize) nutrition.servingSize = data.servingSize;
  if (data.servingUnit) nutrition.servingUnit = data.servingUnit;
  const item: FoodItem = {
    id: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name: data.name ?? 'Unknown Food',
    nutrition,
    imageUri: payload.imageUri ?? undefined,
    scannedAt: Date.now(),
    source: payload.imageUri ? 'upload' : 'camera',
  };
  return item;
}

/**
 * Mock analyzer for demo when no API is configured - returns sample data
 */
export function getMockAnalyzedFood(name?: string, imageUri?: string): FoodItem {
  return {
    id: `mock_${Date.now()}`,
    name: name ?? 'Sample Meal',
    nutrition: {
      calories: 350,
      protein: 18,
      carbs: 42,
      fat: 12,
      fiber: 4,
      sugar: 8,
    },
    imageUri,
    scannedAt: Date.now(),
    source: imageUri ? 'upload' : 'camera',
  };
}
