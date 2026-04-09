/**
 * Upload food image - Image Picker then analyze
 */
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setImageUri, setAnalyzing, setScanResult, setError, setVisionResult } from '@store/slices/scannerSlice';
import { analyzeFoodImage, getMockAnalyzedFood } from '@services/nutritionService';
import { recognizeFoodClarifai, uriToBase64 } from '@services/clarifaiService';
import { Button } from '@components';
import { colors, spacing, fontSizes } from '@theme';

export default function ScannerUploadScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { isAnalyzing, imageUri } = useAppSelector((s) => s.scanner);
  const [imageBase64, setImageBase64] = React.useState<string | null>(null);

  const pickImage = useCallback(() => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.7, includeBase64: true },
      (res) => {
        if (res.didCancel || !res.assets?.[0]) return;
        const uri = res.assets[0].uri;
        const base64 = res.assets[0].base64;
        if (!uri) return;
        dispatch(setImageUri(uri));
        if (base64) setImageBase64(base64);
      },
    );
  }, [dispatch]);

  const analyze = useCallback(async () => {
    if (!imageUri) {
      dispatch(setError('Select an image first'));
      return;
    }
    
    dispatch(setAnalyzing(true));
    dispatch(setError(null));

    try {
      // 1. Get base64 (use memory if available, otherwise read file)
      let photoBase64 = imageBase64;
      if (!photoBase64) {
        photoBase64 = await uriToBase64(imageUri);
      }

      // 2. Clarifai Food Recognition
      const clarifaiResult = await recognizeFoodClarifai(photoBase64);
      const labels = clarifaiResult.foodItems.map(item => item.name);
      const topConfidence = clarifaiResult.foodItems[0]?.confidence || 0;

      dispatch(setVisionResult({ 
        labels: labels, 
        confidence: topConfidence 
      }));

      // 3. Nutrition Analysis (using the top recognized label)
      const topFood = labels[0];
      let item;
      try {
        item = await analyzeFoodImage({ 
          imageUri, 
          imageBase64: photoBase64 
        });
      } catch {
        // Fallback to mock if specialized nutrition API fails
        item = getMockAnalyzedFood(topFood, imageUri);
      }

      dispatch(setScanResult(item));
      (navigation as any).navigate('ScannerResult');
    } catch (e) {
      console.error('[UploadScreen] Analysis failed:', e);
      dispatch(setError(e instanceof Error ? e.message : 'Analysis failed'));
    } finally {
      dispatch(setAnalyzing(false));
    }
  }, [imageUri, imageBase64, dispatch, navigation]);

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No image selected</Text>
        </View>
      )}
      <Button title="Choose photo" onPress={pickImage} variant="outline" style={styles.btn} />
      <Button
        title="Analyze"
        onPress={analyze}
        loading={isAnalyzing}
        disabled={!imageUri}
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.background },
  preview: { width: '100%', height: 240, borderRadius: 12, marginBottom: spacing.md },
  placeholder: {
    height: 240,
    backgroundColor: colors.border,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  placeholderText: { fontSize: fontSizes.md, color: colors.textSecondary },
  btn: { marginBottom: spacing.sm },
});
