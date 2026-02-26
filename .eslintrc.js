/**
 * ESLint configuration - CaloriePlus
 * Enforces consistent code style and catches common errors
 */
module.exports = {
  root: true,
  extends: ['@react-native'],
  ignorePatterns: ['node_modules/', 'android/', 'ios/', '*.config.js'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx'],
      env: { jest: true },
    },
  ],
};
