/**
 * App navigation entry - NavigationContainer + RootNavigator
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './RootNavigator';

export default function AppNavigation() {
  console.log('-=-=--shivam 2');
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
