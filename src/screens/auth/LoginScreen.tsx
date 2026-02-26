/**
 * Login screen - Formik + Yup validation
 */
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setLoading, setError } from '@store/slices/authSlice';
import { login } from '@services/authService';
import { Button, Input } from '@components';
import { colors, spacing, fontSizes } from '@theme';

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password required'),
});

interface FormValues {
  email: string;
  password: string;
}

const initial: FormValues = { email: '', password: '' };

export default function LoginScreen({
  navigation,
}: {
  navigation: { navigate: (name: string) => void };
}) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((s) => s.auth);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      dispatch(setError(null));
      dispatch(setLoading(true));
      try {
        await login({ email: values.email, password: values.password });
      } catch (e) {
        dispatch(
          setError(e instanceof Error ? e.message : 'Login failed'),
        );
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>CaloriePlus</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <Formik
        initialValues={initial}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="you@example.com"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email ? errors.email : undefined}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Input
              label="Password"
              placeholder="••••••••"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password ? errors.password : undefined}
              secureTextEntry
            />
            {error ? <Text style={styles.apiError}>{error}</Text> : null}
            <Button
              title="Sign In"
              onPress={() => handleSubmit()}
              loading={isLoading}
              style={styles.btn}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.link}
            >
              <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.link}
            >
              <Text style={styles.linkText}>Create account</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
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
    fontSize: fontSizes.h1,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: { marginBottom: spacing.lg },
  btn: { marginTop: spacing.sm },
  apiError: {
    color: colors.error,
    fontSize: fontSizes.sm,
    marginBottom: spacing.sm,
  },
  link: { marginTop: spacing.sm, alignItems: 'center' },
  linkText: { color: colors.primary, fontSize: fontSizes.md },
});
