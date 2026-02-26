/**
 * Forgot password - placeholder; can wire to Firebase sendPasswordResetEmail
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '@components';
import { colors, spacing, fontSizes } from '@theme';

export default function ForgotPasswordScreen({
  navigation,
}: {
  navigation: { goBack: () => void };
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset password</Text>
      <Text style={styles.subtitle}>
        Enter your email and we'll send you a link to reset your password.
      </Text>
      <Button
        title="Back to Login"
        onPress={() => navigation.goBack()}
        variant="outline"
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSizes.h2,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  btn: { marginTop: spacing.md },
});
