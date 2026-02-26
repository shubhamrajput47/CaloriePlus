/**
 * User and auth domain models
 */
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  dailyCalorieGoal: number;
  weight?: number;
  height?: number;
  age?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietaryPreference?: 'none' | 'vegetarian' | 'vegan' | 'keto';
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
