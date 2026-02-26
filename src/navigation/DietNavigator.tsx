import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DietStackParamList } from './types';
import DietRecommendationsScreen from '@screens/diet/DietRecommendationsScreen';
import DietPlanScreen from '@screens/diet/DietPlanScreen';
import DietPlanGenerateScreen from '@screens/diet/DietPlanGenerateScreen';

const Stack = createNativeStackNavigator<DietStackParamList>();

export default function DietNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, title: 'Diet' }}>
      <Stack.Screen name="DietRecommendations" component={DietRecommendationsScreen} />
      <Stack.Screen name="DietPlan" component={DietPlanScreen} />
      <Stack.Screen name="DietPlanGenerate" component={DietPlanGenerateScreen} />
    </Stack.Navigator>
  );
}
