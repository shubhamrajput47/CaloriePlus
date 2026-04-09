import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

import { useAppDispatch } from '@store/hooks';
import { setImageUri, setAnalyzing, setScanResult, setError, setVisionResult } from '@store/slices/scannerSlice';
import { analyzeFoodImage } from '@services/nutritionService';
import { recognizeFoodClarifai, uriToBase64 } from '@services/clarifaiService';
import { colors } from '@theme';
import ImageResizer from 'react-native-image-resizer';


export default function ScannerCameraScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const device = useCameraDevices().find((d) => d.position === 'back');
  const camera = useRef<Camera>(null);

  const [hasPermission, setHasPermission] = useState(false);
  const [isViewImage, setViewImage] = useState('')

  // Request Camera Permission
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const capturePhoto = useCallback(async () => {
    if (!camera.current) return;

    try {
      dispatch(setAnalyzing(true));
      dispatch(setError(null));

      const photo = await camera.current.takePhoto();
      const imagePath = `file://${photo.path}`;

      dispatch(setImageUri(imagePath));
      setViewImage(imagePath)

      // 1. Convert to Base64
      const photoBase64 = await uriToBase64(imagePath);
console.log('-=--==---shivam', photoBase64);

      // 2. Perform Clarifai Food Recognition
      const clarifaiResult = await recognizeFoodClarifai(photoBase64);
      const labels = clarifaiResult.foodItems.map(item => item.name);
      
      dispatch(setVisionResult({ 
        labels: labels, 
        confidence: clarifaiResult.foodItems[0]?.confidence || 0 
      }));

      // 3. Call nutrition API using the recognized food name
      const result = await analyzeFoodImage({ 
        imageUri: imagePath, 
        imageBase64: photoBase64 
      });

      dispatch(setScanResult(result));

      (navigation as any).navigate('ScannerResult', {
        itemId: result.id,
      });
    } catch (e) {
      console.error('[CameraScreen] Analysis failed:', e);
      dispatch(setError(e instanceof Error ? e.message : 'Scan failed'));
    } finally {
      dispatch(setAnalyzing(false));
    }
  }, [dispatch, navigation]);
 
  if (!device) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading camera...</Text>;
  }

  if (!hasPermission) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Camera permission denied</Text>;
  }
console.log("------isviewimage",isViewImage);

  return (
    <View style={{ flex: 1 }}>
      {/* Camera Preview */}

      {/* { isViewImage ? <Image height={100} width={100} source={{uri: isViewImage}} /> : */}
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
{/* } */}
      {/* Capture Button */}
      <TouchableOpacity style={styles.captureBtn} onPress={capturePhoto} />
    </View>
  );
}

const styles = StyleSheet.create({
  captureBtn: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: '#ccc',
  },
});