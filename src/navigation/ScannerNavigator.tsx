import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ScannerStackParamList } from './types';
import { Platform } from 'react-native';
import ScannerCameraScreen from '@screens/scanner/ScannerCameraScreen';
import ScannerUploadScreen from '@screens/scanner/ScannerUploadScreen';
import ScannerResultScreen from '@screens/scanner/ScannerResultScreen';
import FoodRecognitionAndroid from '@screens/scanner/FoodRecognitionAndroid';

const Stack = createNativeStackNavigator<ScannerStackParamList>();

export default function ScannerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, title: 'Scan Food' }}>
      <Stack.Screen name="ScannerCamera" component={ScannerCameraScreen} />
      {Platform.OS === 'android' && (
        <Stack.Screen name="FoodRecognitionAndroid" component={FoodRecognitionAndroid} />
      )}
      <Stack.Screen name="ScannerUpload" component={ScannerUploadScreen} />
      <Stack.Screen name="ScannerResult" component={ScannerResultScreen} />
    </Stack.Navigator>
  );
}
