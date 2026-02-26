/**
 * Home screen - quick stats and shortcuts
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppSelector } from '@store/hooks';
import { useNavigation } from '@react-navigation/native';
import { Card, Button, CalorieChart } from '@components';
import { colors, spacing, fontSizes } from '@theme';
import { getTodayKey } from '@utils/date';

export default function HomeScreen() {
  const navigation = useNavigation();
  const user = useAppSelector((s) => s.auth.user);
  const today = useAppSelector((s) => s.tracker.today);
  const dateKey = getTodayKey();
  const consumed = today?.totalCalories ?? 0;
  const goal = today?.goalCalories ?? user?.dailyCalorieGoal ?? 2000;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>
        Hello, {user?.displayName ?? user?.email ?? 'User'}
      </Text>
      <Card style={styles.card}>
        <CalorieChart consumed={consumed} goal={goal} label="Today's intake" />
      </Card>
      <View style={styles.actions}>
        <Button
          title="Scan food"
          onPress={() => (navigation as unknown as { navigate: (a: string, b?: object) => void }).navigate('ScannerTab')}
          style={styles.actionBtn}
        />
        <Button
          title="View tracker"
          onPress={() => (navigation as unknown as { navigate: (a: string) => void }).navigate('TrackerTab')}
          variant="outline"
          style={styles.actionBtn}
        />
        <Button
          title="Diet plan"
          onPress={() => (navigation as unknown as { navigate: (a: string) => void }).navigate('DietTab')}
          variant="secondary"
          style={styles.actionBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  greeting: {
    fontSize: fontSizes.h3,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: { marginBottom: spacing.lg },
  actions: { gap: spacing.sm },
  actionBtn: { marginBottom: spacing.sm },
});
