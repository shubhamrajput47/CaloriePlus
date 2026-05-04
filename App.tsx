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
import auth from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { getApps } from '@react-native-firebase/app';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';



import {
  getAuth,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { getFirebaseApp } from '@/services';






function App(): React.JSX.Element {
  const isDark = useColorScheme() === 'dark';
   const app = getApp(); // 🔥 New way
  const auth = getAuth(app);
  const firebaseApp = app;
  console.log('-=-=-=-=-firebaseApp',firebaseApp);
  
  // if (!firebaseApp) return null;
  const db = firestore();
  // return db;

console.log('-=-=--shivam 1',auth)
console.log("Firebase Apps db:", db);
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
