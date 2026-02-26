/**
 * Theme colors - CaloriePlus
 * Centralized palette for light/dark and brand consistency
 */
export const colors = {
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#4CAF50',
  secondary: '#FF9800',
  secondaryDark: '#F57C00',
  secondaryLight: '#FFB74D',

  background: '#FAFAFA',
  backgroundDark: '#121212',
  surface: '#FFFFFF',
  surfaceDark: '#1E1E1E',

  text: '#212121',
  textSecondary: '#757575',
  textDark: '#FFFFFF',
  textSecondaryDark: '#B0B0B0',

  error: '#B00020',
  success: '#2E7D32',
  warning: '#FF9800',
  info: '#2196F3',

  border: '#E0E0E0',
  borderDark: '#333333',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof colors;
