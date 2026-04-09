/**
 * React Navigation type definitions - type-safe params
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParams = {
  Home: undefined;
  ScannerTab: undefined;
  TrackerTab: undefined;
  DietTab: undefined;
  ProfileTab: undefined;
};

export type ScannerStackParamList = {
  ScannerCamera: undefined;
  ScannerUpload: undefined;
  ScannerResult: { itemId?: string };
  FoodRecognitionAndroid: undefined;
};

export type TrackerStackParamList = {
  TrackerDaily: undefined;
  TrackerHistory: undefined;
};

export type DietStackParamList = {
  DietRecommendations: undefined;
  DietPlan: undefined;
  DietPlanGenerate: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParams> =
  BottomTabScreenProps<MainTabParams, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
    interface AuthParamList extends AuthStackParamList {}
    interface MainTabParamList extends MainTabParams {}
  }
}
