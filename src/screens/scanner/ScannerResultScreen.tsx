/**
 * Scan result - show nutrition and add to tracker
 */
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { addFoodToDay } from '@store/slices/trackerSlice';
import { clearScan } from '@store/slices/scannerSlice';
import { getTodayKey } from '@utils/date';
import { Card, Button } from '@components';
import { colors, spacing, fontSizes } from '@theme';
import { PieChart } from 'react-native-chart-kit';
import { saveMeal } from '@services/mealService';

const screenWidth = Dimensions.get('window').width;

type ParamList = { ScannerResult: { itemId?: string } };

export default function ScannerResultScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { lastScannedItem: item, recognizedLabels, visionConfidence } = useAppSelector((s) => s.scanner);

  const addToToday = useCallback(async () => {
    if (!item) return;
    try {
      // 1. Save to Firestore
      await saveMeal({
        foodName: item.name,
        calories: item.nutrition.calories,
        protein: item.nutrition.protein,
        carbs: item.nutrition.carbs,
        fat: item.nutrition.fat,
      });

      // 2. Local State update
      dispatch(addFoodToDay({ date: getTodayKey(), item }));
      dispatch(clearScan());
      
      (navigation as any).navigate('HomeScreen');
    } catch (error) {
      console.error('Failed to save meal:', error);
      // Fallback: still navigate or show Alert? 
      // For now, we'll Alert the user.
      Alert.alert('Save Error', 'Failed to save meal data locally.');
      dispatch(addFoodToDay({ date: getTodayKey(), item }));
      dispatch(clearScan());
      (navigation as any).navigate('HomeScreen');
    }
  }, [item, dispatch, navigation]);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No scan result. Go back and scan again.</Text>
      </View>
    );
  }

  const n = item.nutrition;

  const chartData = [
    {
      name: 'Protein',
      population: n.protein,
      color: '#4CAF50',
      legendFontColor: colors.textSecondary,
      legendFontSize: 12,
    },
    {
      name: 'Carbs',
      population: n.carbs,
      color: '#2196F3',
      legendFontColor: colors.textSecondary,
      legendFontSize: 12,
    },
    {
      name: 'Fat',
      population: n.fat,
      color: '#FF9800',
      legendFontColor: colors.textSecondary,
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.headerCard}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.calorieRow}>
          <Text style={styles.calorieValue}>{n.calories}</Text>
          <Text style={styles.calorieLabel}>kcal</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Macronutrients</Text>
        <View style={styles.chartWrapper}>
          <PieChart
            data={chartData}
            width={screenWidth - spacing.lg * 4}
            height={180}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
        
        <View style={styles.macroBreakdown}>
          {(() => {
            const totalMacros = n.protein + n.carbs + n.fat;
            return (
              <>
                <MacroInfo label="Protein" value={n.protein} color="#4CAF50" total={totalMacros} />
                <MacroInfo label="Carbs" value={n.carbs} color="#2196F3" total={totalMacros} />
                <MacroInfo label="Fat" value={n.fat} color="#FF9800" total={totalMacros} />
              </>
            );
          })()}
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>AI Recognition</Text>
        <View style={styles.labelContainer}>
          {recognizedLabels.slice(0, 3).map((label, i) => (
            <View key={label} style={[styles.badge, i === 0 && styles.activeBadge]}>
              <Text style={[styles.badgeText, i === 0 && styles.activeBadgeText]}>{label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.confidence}>
          AI Confidence: {(visionConfidence * 100).toFixed(1)}%
        </Text>
      </Card>
      
      <Button title="Add to today's log" onPress={addToToday} style={styles.btn} />
    </ScrollView>
  );
}

const MacroInfo = ({ label, value, color, total }: { label: string; value: number; color: string; total: number }) => (
  <View style={styles.macroRowContainer}>
    <View style={styles.macroRow}>
      <View style={styles.macroLabelGroup}>
        <View style={[styles.colorDot, { backgroundColor: color }]} />
        <Text style={styles.macroLabelText}>{label}</Text>
      </View>
      <Text style={styles.macroValueText}>{value}g</Text>
    </View>
    <View style={styles.progressBackground}>
      <View 
        style={[
          styles.progressFill, 
          { 
            backgroundColor: color, 
            width: total > 0 ? `${Math.min((value / total) * 100, 100)}%` : '0%' 
          }
        ]} 
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  empty: { fontSize: fontSizes.md, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
  headerCard: { marginBottom: spacing.md, alignItems: 'center', paddingVertical: spacing.lg },
  card: { marginBottom: spacing.md },
  sectionTitle: { 
    fontSize: fontSizes.sm, 
    color: colors.textSecondary, 
    marginBottom: spacing.md, 
    textTransform: 'uppercase', 
    letterSpacing: 1.2,
    fontWeight: '600'
  },
  name: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.text, marginBottom: spacing.xs, textAlign: 'center' },
  calorieRow: { flexDirection: 'row', alignItems: 'baseline' },
  calorieValue: { fontSize: 32, fontWeight: '800', color: colors.primary },
  calorieLabel: { fontSize: fontSizes.md, color: colors.textSecondary, marginLeft: 4, fontWeight: '600' },
  chartWrapper: { alignItems: 'center', marginVertical: spacing.sm },
  macroBreakdown: { marginTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  macroRowContainer: { marginBottom: spacing.sm },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  macroLabelGroup: { flexDirection: 'row', alignItems: 'center' },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  macroLabelText: { fontSize: fontSizes.md, color: colors.text },
  macroValueText: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
  progressBackground: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  labelContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  badge: { backgroundColor: colors.border, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 16, marginRight: spacing.xs, marginBottom: spacing.xs },
  activeBadge: { backgroundColor: colors.primary },
  badgeText: { fontSize: 12, color: colors.textSecondary },
  activeBadgeText: { color: 'white', fontWeight: 'bold' },
  confidence: { fontSize: 12, color: colors.textSecondary, fontStyle: 'italic' },
  btn: { marginTop: spacing.md },
});
