/**
 * Current diet plan view
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@store/hooks';
import { Card, Button } from '@components';
import { colors, spacing, fontSizes } from '@theme';

export default function DietPlanScreen() {
  const navigation = useNavigation();
  const plan = useAppSelector((s) => s.diet.currentPlan);

  if (!plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No active plan.</Text>
        <Button
          title="Generate plan"
          onPress={() =>
            (navigation as { navigate: (a: string) => void }).navigate('DietPlanGenerate')
          }
          style={styles.btn}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.name}>{plan.name}</Text>
        <Text style={styles.desc}>{plan.description}</Text>
        <Text style={styles.meta}>
          {plan.dailyCalorieTarget} kcal/day · {plan.durationDays} days
        </Text>
      </Card>
      {plan.meals.map((meal, i) => (
        <Card key={i} style={styles.mealCard}>
          <Text style={styles.mealName}>{meal.name} — {meal.time}</Text>
          <Text style={styles.foods}>{meal.foods.join(', ')}</Text>
          <Text style={styles.nutrition}>
            {meal.nutrition.calories} kcal · P {meal.nutrition.protein}g · C {meal.nutrition.carbs}g · F {meal.nutrition.fat}g
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  empty: { padding: spacing.lg, fontSize: fontSizes.md, color: colors.textSecondary },
  btn: { margin: spacing.lg },
  name: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.text },
  desc: { fontSize: fontSizes.md, color: colors.textSecondary, marginTop: spacing.xs },
  meta: { fontSize: fontSizes.sm, color: colors.primary, marginTop: spacing.xs },
  mealCard: { marginTop: spacing.md },
  mealName: { fontSize: fontSizes.lg, fontWeight: '600', color: colors.text },
  foods: { fontSize: fontSizes.md, color: colors.textSecondary, marginTop: spacing.xs },
  nutrition: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: spacing.xs },
});
