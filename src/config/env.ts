/**
 * Environment configuration
 * Centralizes env access with fallbacks for missing .env
 */
import {
  API_BASE_URL,
  API_KEY,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  NUTRITION_AI_API_URL,
  NUTRITION_AI_API_KEY,
  APP_ENV,
} from '@env';

export const env = {
  api: {
    baseUrl: API_BASE_URL ?? 'https://api.example.com/v1',
    apiKey: API_KEY ?? '',
  },
  firebase: {
    apiKey: FIREBASE_API_KEY ?? '',
    authDomain: FIREBASE_AUTH_DOMAIN ?? '',
    projectId: FIREBASE_PROJECT_ID ?? '',
    storageBucket: FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: FIREBASE_APP_ID ?? '',
  },
  nutritionAi: {
    apiUrl: NUTRITION_AI_API_URL ?? '',
    apiKey: NUTRITION_AI_API_KEY ?? '',
  },
  appEnv: APP_ENV ?? 'development',
  isDev: (APP_ENV ?? 'development') === 'development',
};
