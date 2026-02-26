/**
 * Diet recommendations based on today's intake
 */
import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setRecommendations, setLoading, setError } from '@store/slices/dietSlice';
import { getRecommendations } from '@services/dietService';
import { Card } from '@components';
import { colors, spacing, fontSizes } from '@theme';

export default function DietRecommendationsScreen() {
  const dispatch = useAppDispatch();
  const { recommendations, isLoading } = useAppSelector((s) => s.diet);
  const today = useAppSelector((s) => s.tracker.today);
  const goal = useAppSelector((s) => s.tracker.goalCalories);

  const load = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const recs = await getRecommendations({
        dailyCalories: today?.totalCalories ?? 0,
        consumedCalories: today?.totalCalories ?? 0,
        goalCalories: goal,
        totalProtein: today?.totalProtein,
        totalCarbs: today?.totalCarbs,
        totalFat: today?.totalFat,
      });
      dispatch(setRecommendations(recs));
    } catch (e) {
      dispatch(setError(e instanceof Error ? e.message : 'Failed to load'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, today, goal]);

  useEffect(() => {
    load();
  }, [load]);

  const renderItem = ({ item }: { item: (typeof recommendations)[0] }) => (
    <Card key={item.id} style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.reason}>{item.reason}</Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <FlatList
          data={recommendations}
          renderItem={renderItem}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No recommendations right now. Log some meals first.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  card: { marginBottom: spacing.md },
  title: { fontSize: fontSizes.lg, fontWeight: '600', color: colors.text },
  desc: { fontSize: fontSizes.md, color: colors.textSecondary, marginTop: spacing.xs },
  reason: { fontSize: fontSizes.sm, color: colors.primary, marginTop: spacing.xs },
  loading: { padding: spacing.lg, color: colors.textSecondary },
  empty: { padding: spacing.lg, color: colors.textSecondary },
});
