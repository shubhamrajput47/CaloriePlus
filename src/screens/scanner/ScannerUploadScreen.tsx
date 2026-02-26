/**
 * Upload food image - Image Picker then analyze
 */
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setImageUri, setAnalyzing, setScanResult, setError } from '@store/slices/scannerSlice';
import { analyzeFoodImage, getMockAnalyzedFood } from '@services/nutritionService';
import { Button } from '@components';
import { colors, spacing, fontSizes } from '@theme';

export default function ScannerUploadScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { isAnalyzing, imageUri } = useAppSelector((s) => s.scanner);

  const pickImage = useCallback(() => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, includeBase64: false },
      (res) => {
        if (res.didCancel || !res.assets?.[0]) return;
        const uri = res.assets[0].uri;
        if (!uri) return;
        dispatch(setImageUri(uri));
      },
    );
  }, [dispatch]);

  const analyze = useCallback(async () => {
    const uri = imageUri;
    if (!uri) {
      dispatch(setError('Select an image first'));
      return;
    }
    dispatch(setAnalyzing(true));
    dispatch(setError(null));
    try {
      let item;
      try {
        item = await analyzeFoodImage({ imageUri: uri });
      } catch {
        item = getMockAnalyzedFood('Uploaded food', uri);
      }
      dispatch(setScanResult(item));
      (navigation as { navigate: (a: string, b: { itemId?: string }) => void }).navigate('ScannerResult', {
        itemId: item.id,
      });
    } catch (e) {
      dispatch(setError(e instanceof Error ? e.message : 'Analysis failed'));
    } finally {
      dispatch(setAnalyzing(false));
    }
  }, [imageUri, dispatch, navigation]);

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
