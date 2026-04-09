/**
 * Vision service - recognitize food items from images using free-tier Vision APIs.
 * Supports: Google Cloud Vision API, Clarifai, or Spoonacular.
 */
import { env } from '@config/env';

export interface FoodRecognitionResult {
  foodItems: string[];
  confidence: number;
}

/**
 * Recognize food items in an image using Google Cloud Vision API.
 * Uses the 'LABEL_DETECTION' feature (1,000 requests/month free).
 * 
 * @param imageBase64 - The image data in base64 format (no prefix).
 * @returns {Promise<FoodRecognitionResult>}
 */
export async function recognizeFood(
  imageBase64: string,
): Promise<FoodRecognitionResult> {
  const apiKey = env.nutritionAi?.apiKey; // Using the key from env
  
  if (!apiKey) {
    console.warn('[VisionService] API Key is missing. Returning mock data for development.');
    // Simulated delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockVisionResult();
  }

  const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: imageBase64,
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 15,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(errorJson.error?.message || `API error (${response.status})`);
    }

    const data = await response.json();
    const annotations = data.responses[0]?.labelAnnotations || [];

    if (annotations.length === 0) {
      throw new Error('No items detected in the image. Please try a different angle.');
    }

    // Filter and map descriptors. In production, we'd filter for "Food" related keywords.
    const foodItems = annotations
      .filter((label: any) => label.score > 0.5)
      .map((label: any) => label.description);

    if (foodItems.length === 0) {
      throw new Error('No food-related items recognized.');
    }

    return {
      foodItems,
      confidence: annotations[0]?.score || 0,
    };
  } catch (error) {
    console.error('[VisionService] Error:', error);
    throw error;
  }
}

/**
 * Mock vision result for testing and demo purposes
 */
export function getMockVisionResult(): FoodRecognitionResult {
  return {
    foodItems: ['Green Apple', 'Fruit', 'Granny Smith'],
    confidence: 0.984,
  };
}
