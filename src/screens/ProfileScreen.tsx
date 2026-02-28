/**
 * Profile - user info and logout
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '@store/hooks';
import { logout } from '@services/authService';
import { Button, Card } from '@components';
import { colors, spacing, fontSizes } from '@theme';

export default function ProfileScreen() {
  const user = useAppSelector((s) => s.auth.user);
  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? '—'}</Text>
        <Text style={styles.label}>Daily goal</Text>
        <Text style={styles.value}>{user?.dailyCalorieGoal ?? 2000} kcal</Text>
      </Card>
      <Button title="Sign out" onPress={handleLogout} variant="outline" style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xxl,
    margin:  spacing.lg,
    backgroundColor: colors.background,
  },
  card: { marginBottom: spacing.lg  },
  label: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: spacing.sm },
  value: { fontSize: fontSizes.lg, color: colors.text, marginBottom: spacing.xs },
  btn: { marginTop: spacing.lg },
});
