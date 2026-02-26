/**
 * CaloriePlus – AI-Based Food Nutrition Scanner
 * MCA Major Project | Production-ready React Native app
 *
 * Entry: Redux Provider + SafeArea + Navigation
 */
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
// import  {SafeAreaView}  from 'react-native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from '@/store';
import AppNavigation from '@/navigation';
import { colors } from '@/theme';
import LoginScreen from '@/screens/auth/LoginScreen';

function App(): React.JSX.Element {
  const isDark = useColorScheme() === 'dark';
console.log('-=-=--shivam 1');
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        {/* <SafeAreaView> */}
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={colors.background}
          />
          <AppNavigation />
        {/* </SafeAreaView> */}
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
