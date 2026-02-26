/**
 * Generate personalized diet plan
 */
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCurrentPlan, setLoading, setError } from '@store/slices/dietSlice';
import { generateDietPlan } from '@services/dietService';
import { Button } from '@components';
import { colors, spacing, fontSizes } from '@theme';

export default function DietPlanGenerateScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const goalCalories = useAppSelector((s) => s.tracker.goalCalories);
  const [duration] = useState(7);

  const generate = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const plan = await generateDietPlan({
        goalCalories: goalCalories || 2000,
        durationDays: duration,
      });
      dispatch(setCurrentPlan(plan));
      (navigation as { navigate: (a: string) => void }).navigate('DietPlan');
    } catch (e) {
      dispatch(setError(e instanceof Error ? e.message : 'Failed to generate'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, navigation, goalCalories, duration]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate diet plan</Text>
      <Text style={styles.subtitle}>
        Target: {goalCalories || 2000} kcal/day for {duration} days.
      </Text>
      <Button title="Generate plan" onPress={generate} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.background },
  title: { fontSize: fontSizes.h3, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: fontSizes.md, color: colors.textSecondary, marginTop: spacing.sm },
  btn: { marginTop: spacing.xl },
});
