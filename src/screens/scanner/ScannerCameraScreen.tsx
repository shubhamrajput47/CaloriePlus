import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

import { useAppDispatch } from '@store/hooks';
import { setImageUri, setAnalyzing, setScanResult, setError, setVisionResult } from '@store/slices/scannerSlice';
import { analyzeFoodImage } from '@services/nutritionService';
import { recognizeFoodClarifai, uriToBase64, } from '@services/clarifaiService';
import { colors } from '@theme';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-blob-util';
import { NutritionList } from '../NutritionsList';




export default function ScannerCameraScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const device = useCameraDevices().find((d) => d.position === 'back');
  const camera = useRef<Camera>(null);

  const [hasPermission, setHasPermission] = useState(false);
  const [isViewImage, setViewImage] = useState('')
  const [isNutritionsData, setNutritionsData] = useState('')





  // Request Camera Permission
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const MAX_SIZE_MB = 2;

const getSizeInMB = async (uri: string) => {
  const path = uri.replace('file://', '');
  const stats = await RNFetchBlob.fs.stat(path);
  return stats.size / (1024 * 1024);
};

const convertUriToBase64 = async (uri: string): Promise<string> => {
  try {
    let quality = 80;
    let width = 800;
    let height = 800;

    // Step 1: Initial resize
    let resized = await ImageResizer.createResizedImage(
      uri,
      width,
      height,
      'JPEG',
      quality
    );

    let currentUri = resized.uri;
    let size = await getSizeInMB(currentUri);

    console.log(`Initial Size: ${size.toFixed(2)} MB`);

    // Step 2: Reduce quality until < 2MB
    while (size > MAX_SIZE_MB && quality > 20) {
      quality -= 10;

      const newImage = await ImageResizer.createResizedImage(
        currentUri,
        width,
        height,
        'JPEG',
        quality
      );

      currentUri = newImage.uri;
      size = await getSizeInMB(currentUri);

      console.log(`Quality: ${quality}, Size: ${size.toFixed(2)} MB`);
    }

    // Step 3: If still large → reduce dimensions
    while (size > MAX_SIZE_MB && width > 300) {
      width -= 100;
      height -= 100;

      const newImage = await ImageResizer.createResizedImage(
        currentUri,
        width,
        height,
        'JPEG',
        quality
      );

      currentUri = newImage.uri;
      size = await getSizeInMB(currentUri);

      console.log(`Resize: ${width}x${height}, Size: ${size.toFixed(2)} MB`);
    }

    console.log(`Final Size: ${size.toFixed(2)} MB`);

    // Step 4: Convert to Base64
    const path = currentUri.replace('file://', '');
    const base64 = await RNFetchBlob.fs.readFile(path, 'base64');

    return base64;

  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};


  const capturePhoto = useCallback(async () => {
    if (!camera.current) return;

    try {
      dispatch(setAnalyzing(true));
      dispatch(setError(null));
  
    
      const photo = await camera.current.takePhoto();
      const imagePath = `file://${photo.path}`;
        console.log("shubham=-=-=-",imagePath);
      dispatch(setImageUri(imagePath));
      setViewImage(imagePath)

      // 1. Convert to Base64
      const photoBase64 =  await convertUriToBase64(imagePath);
console.log('-=--==---shivam', photoBase64);

      // 2. Perform Clarifai Food Recognition
      const clarifaiResult = await recognizeFoodClarifai(photoBase64);
      console.log("shubham=--=-=-=",clarifaiResult);
      // @ts-ignore
     setNutritionsData(clarifaiResult)
     
      
      const labels = clarifaiResult//clarifaiResult.foodItems.map(item => item.name);
      
      // dispatch(setVisionResult({ 
      //   labels: labels, 
      //   confidence: clarifaiResult.foodItems[0]?.confidence || 0 
      // }));

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
 if (isNutritionsData !==''){
  return (
    <NutritionList data={isNutritionsData}  />
  )
 }

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

// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Camera, useCameraDevice } from 'react-native-vision-camera';

// import { useAppDispatch } from '@store/hooks';
// import {
//   setImageUri,
//   setAnalyzing,
//   setScanResult,
//   setError,
//   setVisionResult,
// } from '@store/slices/scannerSlice';

// import { analyzeFoodImage } from '@services/nutritionService';
// import { recognizeFoodClarifai } from '@services/clarifaiService';

// import ImageResizer from 'react-native-image-resizer';
// import RNFetchBlob from 'react-native-blob-util';

// export default function ScannerCameraScreen() {
//   const navigation = useNavigation();
//   const route = useRoute<any>();
//   const dispatch = useAppDispatch();

//   const mode = route.params?.mode ?? 'camera';
//   const imageUriFromGallery = route.params?.imageUri;

//   const device = useCameraDevice('back');
//   const camera = useRef<Camera>(null);

//   const [hasPermission, setHasPermission] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // ✅ ALWAYS RUN (top level)
//   useEffect(() => {
//     (async () => {
//       const status = await Camera.requestCameraPermission();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   // ✅ PROCESS IMAGE
//   const processImage = async (imagePath: string) => {
//     try {
//       setLoading(true);
//       dispatch(setAnalyzing(true));
//       dispatch(setError(null));

//       dispatch(setImageUri(imagePath));

//       const resized = await ImageResizer.createResizedImage(
//         imagePath,
//         800,
//         800,
//         'JPEG',
//         80
//       );

//       const path = resized.uri.replace('file://', '');
//       const base64 = await RNFetchBlob.fs.readFile(path, 'base64');

//       const clarifaiResult = await recognizeFoodClarifai(base64);

//       const labels = clarifaiResult.foodItems.map((item) => item.name);

//       dispatch(
//         setVisionResult({
//           labels,
//           confidence: clarifaiResult.foodItems[0]?.confidence || 0,
//         })
//       );

//       const result = await analyzeFoodImage({
//         imageUri: imagePath,
//         imageBase64: base64,
//       });

//       dispatch(setScanResult(result));

//       (navigation as any).navigate('ScannerResult', {
//         itemId: result.id,
//       });
//     } catch (e) {
//       dispatch(setError('Scan failed'));
//     } finally {
//       setLoading(false);
//       dispatch(setAnalyzing(false));
//     }
//   };

//   // ✅ GALLERY MODE (SAFE)
//   useEffect(() => {
//     if (mode === 'gallery' && imageUriFromGallery) {
//       processImage(imageUriFromGallery);
//     }
//   }, [mode, imageUriFromGallery]);

//   // 📸 CAPTURE
//   const capturePhoto = useCallback(async () => {
//     if (!camera.current) return;

//     const photo = await camera.current.takePhoto();
//     const imagePath = `file://${photo.path}`;

//     processImage(imagePath);
//   }, []);

//   // 🔴 UI CONTROL (NO EARLY HOOK BREAK)

//   let content = null;

//   if (loading) {
//     content = (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />
//         <Text>Analyzing food...</Text>
//       </View>
//     );
//   } else if (!hasPermission) {
//     content = (
//       <View style={styles.center}>
//         <Text>Camera permission denied</Text>
//       </View>
//     );
//   } else if (mode === 'gallery') {
//     content = (
//       <View style={styles.center}>
//         <Text>Processing image...</Text>
//       </View>
//     );
//   } else if (!device) {
//     content = (
//       <View style={styles.center}>
//         <ActivityIndicator />
//         <Text>Opening camera...</Text>
//       </View>
//     );
//   } else {
//     content = (
//       <View style={{ flex: 1 }}>
//         <Camera
//           ref={camera}
//           style={StyleSheet.absoluteFill}
//           device={device}
//           isActive={true}
//           photo={true}
//         />

//         <TouchableOpacity style={styles.captureBtn} onPress={capturePhoto} />
//       </View>
//     );
//   }

//   return <View style={{ flex: 1 }}>{content}</View>;
// }

// const styles = StyleSheet.create({
//   captureBtn: {
//     position: 'absolute',
//     bottom: 40,
//     alignSelf: 'center',
//     width: 75,
//     height: 75,
//     borderRadius: 40,
//     backgroundColor: 'white',
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
