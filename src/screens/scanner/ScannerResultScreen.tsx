/**
 * Scan result - show nutrition and add to tracker
 */
import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { addFoodToDay } from '@store/slices/trackerSlice';
import { clearScan } from '@store/slices/scannerSlice';
import { getTodayKey } from '@utils/date';
import { Card, Button } from '@components';
import { colors, spacing, fontSizes } from '@theme';

type ParamList = { ScannerResult: { itemId?: string } };

export default function ScannerResultScreen() {
  const route = useRoute<RouteProp<ParamList, 'ScannerResult'>>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const item = useAppSelector((s) => s.scanner.lastScannedItem);

  const addToToday = useCallback(() => {
    if (!item) return;
    dispatch(addFoodToDay({ date: getTodayKey(), item }));
    dispatch(clearScan());
    (navigation as { navigate: (a: string) => void }).navigate('ScannerCamera');
  }, [item, dispatch, navigation]);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No scan result. Go back and scan again.</Text>
      </View>
    );
  }

  const n = item.nutrition;
  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.nutrition}>
          {n.calories} kcal · Protein {n.protein}g · Carbs {n.carbs}g · Fat {n.fat}g
        </Text>
      </Card>
      <Button title="Add to today's log" onPress={addToToday} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.background },
  empty: { fontSize: fontSizes.md, color: colors.textSecondary },
  name: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  nutrition: { fontSize: fontSizes.md, color: colors.textSecondary },
  btn: { marginTop: spacing.lg },
});
