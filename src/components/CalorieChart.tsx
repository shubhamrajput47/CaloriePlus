/**
 * Daily calorie progress chart - React Native Chart Kit
 * Memoized to avoid unnecessary re-renders
 */
import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { colors, spacing, fontSizes } from '@theme';

const chartWidth = Dimensions.get('window').width - spacing.lg * 2;

interface CalorieChartProps {
  consumed: number;
  goal: number;
  label?: string;
}

const chartConfig = {
  backgroundColor: colors.surface,
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo: colors.surface,
  decimalPlaces: 0,
  color: (opacity: number) => `rgba(46, 125, 50, ${opacity})`,
  labelColor: () => colors.textSecondary,
  barPercentage: 0.5,
};

const CalorieChart: React.FC<CalorieChartProps> = ({
  consumed,
  goal,
  label = 'Today',
}) => {
  const data = useMemo(
    () => ({
      labels: ['Consumed', 'Goal'],
      datasets: [{ data: [Math.min(consumed, goal), goal] }],
    }),
    [consumed, goal],
  );

  const percent = goal > 0 ? Math.round((consumed / goal) * 100) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <BarChart
        data={data}
        width={chartWidth}
        height={180}
        chartConfig={chartConfig}
        style={styles.chart}
        fromZero
        showBarTops={false}
        withInnerLines={false}
        yAxisLabel=""
        yAxisSuffix=""
      />
      <Text style={styles.summary}>
        {consumed} / {goal} kcal ({percent}%)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  label: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  chart: {
    borderRadius: 8,
  },
  summary: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default memo(CalorieChart);
