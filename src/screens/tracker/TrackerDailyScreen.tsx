/**
 * Daily calorie tracker - list of foods and chart
 */
import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { removeFoodFromDay } from '@store/slices/trackerSlice';
import { getTodayKey } from '@utils/date';
import { CalorieChart, FoodItemRow } from '@components';
import { Card } from '@components';
import { colors, spacing, fontSizes } from '@theme';

const keyExtractor = (item: { id: string }) => item.id;

export default function TrackerDailyScreen() {
  const dispatch = useAppDispatch();
  const dateKey = getTodayKey();
  const history = useAppSelector((s) => s.tracker.history);
  const today = useAppSelector((s) => s.tracker.today) ?? history[dateKey] ?? null;
  const goal = useAppSelector((s) => s.tracker.goalCalories);
  const items = today?.items ?? [];
  const consumed = today?.totalCalories ?? 0;

  const handleRemove = useCallback(
    (itemId: string) => {
      dispatch(removeFoodFromDay({ date: dateKey, itemId }));
    },
    [dispatch, dateKey],
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof items)[0] }) => (
      <FoodItemRow
        item={item}
        showRemove
        onRemove={() => handleRemove(item.id)}
      />
    ),
    [handleRemove],
  );

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <CalorieChart consumed={consumed} goal={goal} label="Today" />
      </Card>
      <Text style={styles.sectionTitle}>Logged foods</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <Text style={styles.empty}>No foods logged today. Scan or add from Scanner.</Text>
        }
        contentContainerStyle={items.length === 0 ? styles.emptyList : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: { margin: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  empty: { fontSize: fontSizes.md, color: colors.textSecondary, padding: spacing.lg },
  emptyList: { flexGrow: 1 },
});
