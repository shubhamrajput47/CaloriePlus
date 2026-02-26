import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { TrackerStackParamList } from './types';
import TrackerDailyScreen from '@screens/tracker/TrackerDailyScreen';
import TrackerHistoryScreen from '@screens/tracker/TrackerHistoryScreen';

const Stack = createNativeStackNavigator<TrackerStackParamList>();

export default function TrackerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, title: 'Calorie Tracker' }}>
      <Stack.Screen name="TrackerDaily" component={TrackerDailyScreen} />
      <Stack.Screen name="TrackerHistory" component={TrackerHistoryScreen} />
    </Stack.Navigator>
  );
}
