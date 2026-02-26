/**
 * Scanner - Camera capture for food
 * Uses react-native-vision-camera when permission granted; fallback to upload
 */
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@store/hooks';
import { setImageUri, setAnalyzing, setScanResult, setError } from '@store/slices/scannerSlice';
import { analyzeFoodImage, getMockAnalyzedFood } from '@services/nutritionService';
import { Button } from '@components';
import { colors, spacing, fontSizes } from '@theme';

export default function ScannerCameraScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');

  const openUpload = useCallback(() => {
    (navigation as { navigate: (a: string) => void }).navigate('ScannerUpload');
  }, [navigation]);

  const simulateCapture = useCallback(async () => {
    dispatch(setAnalyzing(true));
    dispatch(setError(null));
    try {
      const item = getMockAnalyzedFood('Captured meal');
      dispatch(setScanResult(item));
      (navigation as { navigate: (a: string, b: { itemId?: string }) => void }).navigate('ScannerResult', {
        itemId: item.id,
      });
    } catch (e) {
      dispatch(setError(e instanceof Error ? e.message : 'Scan failed'));
    } finally {
      dispatch(setAnalyzing(false));
    }
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Camera view (Vision Camera)
        </Text>
        <Text style={styles.hint}>
          On device: request camera permission and show live preview. Here we simulate.
        </Text>
      </View>
      <View style={styles.actions}>
        <Button
          title="Simulate capture & analyze"
          onPress={simulateCapture}
          style={styles.btn}
        />
        <Button
          title="Upload image instead"
          onPress={openUpload}
          variant="outline"
          style={styles.btn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  placeholder: {
    flex: 1,
    backgroundColor: colors.border,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  placeholderText: { fontSize: fontSizes.lg, color: colors.textSecondary },
  hint: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' },
  actions: { gap: spacing.sm },
  btn: { marginBottom: spacing.sm },
});
