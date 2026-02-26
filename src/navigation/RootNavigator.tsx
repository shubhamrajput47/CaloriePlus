/**
 * Root navigator - Auth vs Main (tabs)
 * Switches based on Redux auth state
 */
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '@store/hooks';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { restoreSession } from '@services/authService';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@theme';
import LoginScreen from '@/screens/auth/LoginScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const [isRestoring, setIsRestoring] = useState(true);
console.log('-=-=--shivam 4');
  useEffect(() => {
    restoreSession().finally(() => setIsRestoring(false));
  }, []);

  if (isRestoring) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
