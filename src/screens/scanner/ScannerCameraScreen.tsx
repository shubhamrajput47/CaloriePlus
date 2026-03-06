// import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

import { useAppDispatch } from '@store/hooks';
import { setImageUri, setAnalyzing, setScanResult, setError } from '@store/slices/scannerSlice';
import { analyzeFoodImage } from '@services/nutritionService';
import { colors } from '@theme';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ScannerCameraScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const devices = useCameraDevices('back');
  const device = devices;
  const camera = useRef<Camera>(null);

  const [hasPermission, setHasPermission] = useState(false);
  const [isViewImage, setViewImage] = useState('')

  // Request Camera Permission
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      console.log("------status",status);
      
      setHasPermission(status === 'granted');
    })();
  }, []);

  const capturePhoto = useCallback(async () => {
    console.log("------camera,current",camera.current);
    
    if (!camera.current) return;

    try {
      dispatch(setAnalyzing(true));
      dispatch(setError(null));

      const photo = await camera.current.takePhoto();
      console.log("------photo",photo);
      
      const imagePath = `file://${photo.path}`;

      dispatch(setImageUri(imagePath));
      setViewImage(imagePath)

      // Call your nutrition API
      const result = await analyzeFoodImage(imagePath);

      dispatch(setScanResult(result));

      (navigation as any).navigate('ScannerResult', {
        itemId: result.id,
      });
    } catch (e) {
      dispatch(setError(e instanceof Error ? e.message : 'Scan failed'));
    } finally {
      dispatch(setAnalyzing(false));
    }
  }, [dispatch, navigation]);
 console.log("thisssssss",devices);
 
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

      { isViewImage ? <Image height={100} width={100} source={{uri: isViewImage}} /> :
      <Camera
      ref={camera}
        style={StyleSheet.absoluteFill}
        device={device[0]}
        isActive={true}
         photo={true}
     
      />
}
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