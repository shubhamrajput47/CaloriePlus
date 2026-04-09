/**
 * Android-Only Food Recognition Screen
 * Built for React Native New Architecture (Fabric + TurboModules)
 * Uses Vision Camera + Clarifai Food Model
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
import axios from 'axios';

const { width, height } = Dimensions.get('screen');

// Configuration
const CLARIFAI_API_KEY = 'YOUR_API_KEY';
const CLARIFAI_MODEL_URL = 'https://api.clarifai.com/v2/models/food-item-recognition/outputs';

interface FoodItem {
  name: string;
  confidence: number;
}

const FoodRecognitionAndroid = () => {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');

  // State
  const [hasPermission, setHasPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [results, setResults] = useState<FoodItem[]>([]);

  // 1. Request Camera Permissions on Mount
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  /**
   * 2. Helper: Convert Image URI to Base64 using FileReader
   * Does NOT use react-native-fs
   */
  const convertUriToBase64 = async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // Extract base64 from data:image/...;base64,XXXXX
          const base64 = base64data.split(',')[1];
          resolve(base64);
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('[Base64] Error:', error);
      throw new Error('Failed to convert image to base64');
    }
  };

  /**
   * 3. Main Action: Capture and Recognize
   */
  const captureAndRecognize = useCallback(async () => {
    if (!camera.current) return;

    try {
      setIsProcessing(true);
      setResults([]);

      // A. Capture Photo
      const photo = await camera.current.takePhoto();
      const originalUri = `file://${photo.path}`;
      setImageUri(originalUri);

      // B. Compress & Resize (Optimization to save bandwidth/API credits)
      // Max size 800x800, 80% quality
      const resizedImage = await ImageResizer.createResizedImage(
        originalUri,
        800,
        800,
        'JPEG',
        80,
        0,
        undefined,
        false,
        { mode: 'contain', onlyScaleDown: true }
      );

      // C. Convert Resized Image to Base64
      const base64 = await convertUriToBase64(resizedImage.uri);

      // D. Call Clarifai API
      const response = await axios.post(
        CLARIFAI_MODEL_URL,
        {
          inputs: [
            {
              data: {
                image: {
                  base64: base64,
                },
              },
            },
          ],
        },
        {
          headers: {
            'Authorization': `Key ${CLARIFAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // E. Parse Result (Top 3)
      const concepts = response.data?.outputs?.[0]?.data?.concepts || [];
      const topResults = concepts.slice(0, 3).map((c: any) => ({
        name: c.name,
        confidence: c.value,
      }));

      if (topResults.length === 0) {
        Alert.alert('No food detected', 'Please try taking a clearer picture.');
      } else {
        setResults(topResults);
      }
    } catch (error: any) {
      console.error('[Clarifai] Error:', error);
      const msg = error.response?.data?.status?.description || error.message;
      Alert.alert('Recognition Failed', msg);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // UI Handlers
  const reset = () => {
    setImageUri(null);
    setResults([]);
  };

  // Render Check
  if (!device) return <View style={styles.center}><ActivityIndicator /></View>;
  if (!hasPermission) return <View style={styles.center}><Text>No Camera Permission</Text></View>;

  return (
    <View style={styles.container}>
      {/* 1. Camera Preview OR Captured Image */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
      ) : (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
        />
      )}

      {/* 2. Results Overlay */}
      {results.length > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.title}>Detection Results</Text>
          {results.map((item, index) => (
            <View key={index} style={styles.resultItem}>
              <View style={styles.row}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.confidence}>{(item.confidence * 100).toFixed(1)}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBar, { width: `${item.confidence * 100}%` }]} />
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Text style={styles.resetText}>Retake</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 3. Loader Overlay */}
      {isProcessing && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loaderText}>Analyzing with Clarifai AI...</Text>
        </View>
      )}

      {/* 4. Controls */}
      {!imageUri && !isProcessing && (
        <View style={styles.controls}>
          <TouchableOpacity style={styles.captureBtn} onPress={captureAndRecognize}>
            <View style={styles.captureBtnInner} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: width,
    height: height,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    padding: 6,
  },
  captureBtnInner: {
    flex: 1,
    borderRadius: 40,
    backgroundColor: '#fff',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultItem: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  confidence: {
    fontSize: 14,
    color: '#666',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  resetBtn: {
    marginTop: 10,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FoodRecognitionAndroid;
