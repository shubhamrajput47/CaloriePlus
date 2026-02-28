/**
 * Register screen - Formik + Yup
 */
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setLoading, setError } from '@store/slices/authSlice';
import { register } from '@services/authService';
import { Button, Input } from '@components';
import { colors, spacing, fontSizes } from '@theme';

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password required'),
  displayName: Yup.string().optional(),
});

interface FormValues {
  email: string;
  password: string;
  displayName: string;
}

const initial: FormValues = { email: '', password: '', displayName: '' };

export default function RegisterScreen({
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
        await register({
          
          email: values.email,
          password: values.password,
          displayName: values.displayName || undefined,
        }).then((e) => console.log(e)
        )
      } catch (e) {
        dispatch(
          setError(e instanceof Error ? e.message : 'Registration failed'),
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
      <Text style={styles.title}>Create account</Text>

      <Formik
        initialValues={initial}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <Input
              label="Display name"
              placeholder="Your name"
              value={values.displayName}
              onChangeText={handleChange('displayName')}
              onBlur={handleBlur('displayName')}
            />
            <Input
              label="Email"
              placeholder="you@example.com"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email ? errors.email : undefined}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Password"
              placeholder="Min 6 characters"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password ? errors.password : undefined}
              secureTextEntry
            />
            {error ? <Text style={styles.apiError}>{error}</Text> : null}
            <Button
              title="Sign Up"
              onPress={() => handleSubmit()}
              loading={isLoading}
              style={styles.btn}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.link}
            >
              <Text style={styles.linkText}>Already have an account? Sign in</Text>
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
    fontSize: fontSizes.h2,
    fontWeight: '700',
    color: colors.text,
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
  link: { marginTop: spacing.lg, alignItems: 'center' },
  linkText: { color: colors.primary, fontSize: fontSizes.md },
});
