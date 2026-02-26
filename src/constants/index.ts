/**
 * Application constants
 */

export const APP_NAME = 'CaloriePlus';
export const APP_VERSION = '1.0.0';

/** Default daily calorie targets (kcal) */
export const DEFAULT_CALORIE_TARGET = 2000;
export const MIN_CALORIE_TARGET = 1200;
export const MAX_CALORIE_TARGET = 4000;

/** AsyncStorage keys */
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@CaloriePlus:authToken',
  USER_PROFILE: '@CaloriePlus:userProfile',
  ONBOARDING_DONE: '@CaloriePlus:onboardingDone',
  THEME: '@CaloriePlus:theme',
} as const;

/** API endpoints (relative to base URL) */
export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGOUT: '/auth/logout',
  NUTRITION_ANALYZE: '/nutrition/analyze',
  NUTRITION_SEARCH: '/nutrition/search',
  DIET_RECOMMEND: '/diet/recommend',
  DIET_PLAN: '/diet/plan',
} as const;

/** Image constraints for upload/scan */
export const IMAGE_CONFIG = {
  MAX_WIDTH: 1024,
  MAX_HEIGHT: 1024,
  QUALITY: 0.8,
  MAX_SIZE_MB: 5,
} as const;

/** Navigation screen names */
export const SCREENS = {
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',
  },
  MAIN: {
    HOME: 'Home',
    SCANNER: 'Scanner',
    TRACKER: 'Tracker',
    DIET: 'Diet',
    PROFILE: 'Profile',
  },
  SCANNER: {
    CAMERA: 'ScannerCamera',
    UPLOAD: 'ScannerUpload',
    RESULT: 'ScannerResult',
  },
  TRACKER: {
    DAILY: 'TrackerDaily',
    HISTORY: 'TrackerHistory',
  },
  DIET: {
    RECOMMENDATIONS: 'DietRecommendations',
    PLAN: 'DietPlan',
    GENERATE: 'DietPlanGenerate',
  },
} as const;
