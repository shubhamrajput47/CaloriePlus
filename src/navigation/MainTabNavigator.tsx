/**
 * Main bottom tab navigator - Home, Scanner, Tracker, Diet, Profile
 * Lazy-loaded screen components via getComponent pattern
 */
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParams } from './types';
import { colors, fontSizes } from '@theme';
import HomeScreen from '@screens/HomeScreen';
import ScannerNavigator from './ScannerNavigator';
import TrackerNavigator from './TrackerNavigator';
import DietNavigator from './DietNavigator';
import ProfileScreen from '@screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParams>();

const tabIcons: Record<string, string> = {
  Home: '🏠',
  ScannerTab: '📷',
  TrackerTab: '📊',
  DietTab: '🥗',
  ProfileTab: '👤',
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: fontSizes.xs },
        tabBarIcon: ({ focused }) => (
        <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>
          {tabIcons[route.name] ?? '•'}
        </Text>
      ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="ScannerTab" component={ScannerNavigator} options={{ title: 'Scan' }} />
      <Tab.Screen name="TrackerTab" component={TrackerNavigator} options={{ title: 'Tracker' }} />
      <Tab.Screen name="DietTab" component={DietNavigator} options={{ title: 'Diet' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
