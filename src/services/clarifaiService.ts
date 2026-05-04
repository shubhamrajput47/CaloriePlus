/**
 * Clarifai Service - specialized food recognition
 * Uses Clarifai's Food Model for high accuracy nutrition recognition
 */
import axios from 'axios';
import ImageResizer from 'react-native-image-resizer';
import { useState } from 'react';

const CLARIFAI_API_KEY = '4163f27ee0b24505a91e51fbb49e4285';
// const CLARIFAI_MODEL_URL = 'https://api.clarifai.com/v2/users/btp341wms6v7/apps/main/models/food-item-recognition/outputs';
const CLARIFAI_MODEL_URL =  "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBMyQSKbEp1eFvI8ttdEffOLjP0B3OSLzc"
export interface ClarifaiFoodItem {
  name: string;
  confidence: number;
}

export interface ClarifaiRecognitionResult {
  // foodItems: ClarifaiFoodItem[];
  name: string;
  nutrition: any;
}


/**
 * Recognize food items in an image using Clarifai Food Model.
 * 
 * @param imageBase64 - Base64 encoded image data (without prefix)
 * @returns {Promise<ClarifaiRecognitionResult>}
 */
export async function recognizeFoodClarifai(
  imageBase64: string,
): Promise<ClarifaiRecognitionResult> {
  //console.log('[ClarifaiService] Initiating food recognition...');

  if (!imageBase64) {
    throw new Error('No image data provided to Clarifai service');
  }
//console.log('-=-=--=--=-=-=-=dfgdsdsf imageBase64', imageBase64);

  try {
    const response = await axios.post(
      "https://api.clarifai.com/v2/users/clarifai/apps/main/models/food-item-v1-recognition/versions/dfebc169854e429086aceb8368662641/outputs",
      {
        inputs: [
          {
            data: {
              image: {
                base64: imageBase64, // 👈 ONLY base64 string (no prefix)
              },
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Key ${CLARIFAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

   
    //console.log('[ClarifaiService] API Response received',response);
    //console.log("first item fetch",response?.data?.outputs?.[0]?.data?.concepts?.[0]?.name);
    

    const status = response.data.status;
    //console.log('-=-=-=-response', response);
    if (status.code !== 10000) {
     // console.error('[ClarifaiService] API Error Status:', status);
      throw new Error(`Clarifai API Error: ${status.description} (${status.code})`);
    }
//console.log('-=-=-=-response', response);

    const outputs = response.data.outputs;
    if (!outputs || outputs.length === 0) {
      throw new Error('Clarifai returned empty outputs');
    }

    const concepts = outputs[0].data.concepts || [];
    
    if (concepts.length === 0) {
      throw new Error('No food items detected in the image.');
    }

    // Extract names and confidence scores
    const foodItems: ClarifaiFoodItem[] = concepts
      .filter((concept: any) => concept.value > 0.4) // Filter by confidence threshold
      .map((concept: any) => ({
        name: concept.name,
        confidence: concept.value,
      }));

    if (foodItems.length === 0) {
      throw new Error('No confident food matches found.');
    }
 const usdaRes = await axios.get(
      "https://api.nal.usda.gov/fdc/v1/foods/search",
      {
        params: {
          query: response?.data?.outputs?.[0]?.data?.concepts?.[0]?.name,
          api_key: 'as8AhpBE8yIX6Ie3vocr0eqq1Obfd9SUBjR98OyI',
          limit: 1,
        },
      }
    );
    console.log("shubham usdaRes=-==-=--",usdaRes?.data?.foods?.[0]?.foodNutrients
);
    
   // console.log(`[ClarifaiService] Successfully identified ${foodItems.length} items`, foodItems);
    return { 
      name:response?.data?.outputs?.[0]?.data?.concepts?.[0]?.name,
      nutrition:usdaRes?.data?.foods?.[0]?.foodNutrients
    };

  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      console.log("-=-=-=--shubham",error);
      
      const message = error.response?.data?.status?.description || error.message;
      console.error('[ClarifaiService] Axios Error:', message);
      throw new Error(`Recognition failed: ${message}`);
    }
    
    console.error('[ClarifaiService] Unexpected Error:', error.message);
    throw error;
  }
}

/**
 * Helper to convert local URI to Base64 (using fetch & FileReader)
 * Works in React Native environments for basic needs
 */
export async function uriToBase64(uri: string): Promise<string> {
  try {
    console.log('-==--==-=-uri', uri);
    
   const resized = await ImageResizer.createResizedImage(uri, 800, 800, 'JPEG', 80);
  const base64 = await fetch(resized.uri)
    .then(res => res.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader?.result?.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
  return base64
  } catch (error) {
    console.error('[ClarifaiService] Base64 conversion failed:', error);
    throw new Error('Could not process the image file.');
  }
}