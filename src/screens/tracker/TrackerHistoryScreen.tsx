/**
 * History - past days (list by date)
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppSelector } from '@store/hooks';
import { formatDisplayDate } from '@utils/date';
import { colors, spacing, fontSizes } from '@theme';

export default function TrackerHistoryScreen() {
  const history = useAppSelector((s) => s.tracker.history);
  const sortedDates = useMemo(
    () => Object.keys(history).sort((a, b) => b.localeCompare(a)),
    [history],
  );

  const renderItem = ({ item: date }: { item: string }) => {
    const day = history[date];
    if (!day) return null;
    return (
      <View style={styles.row}>
        <Text style={styles.date}>{formatDisplayDate(date)}</Text>
        <Text style={styles.calories}>
          {day.totalCalories} / {day.goalCalories} kcal
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedDates}
        renderItem={renderItem}
        keyExtractor={(d) => d}
        ListEmptyComponent={
          <Text style={styles.empty}>No history yet.</Text>
        }
        contentContainerStyle={sortedDates.length === 0 ? styles.emptyList : styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  emptyList: { flexGrow: 1, padding: spacing.lg },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  date: { fontSize: fontSizes.md, color: colors.text },
  calories: { fontSize: fontSizes.md, color: colors.textSecondary },
  empty: { fontSize: fontSizes.md, color: colors.textSecondary },
});
