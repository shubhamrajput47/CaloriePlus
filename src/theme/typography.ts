/**
 * Typography scale - CaloriePlus
 */
import { Platform } from 'react-native';

export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  h3: 24,
  h2: 28,
  h1: 32,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const defaultFontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});
