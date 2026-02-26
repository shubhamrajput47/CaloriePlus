/**
 * Babel configuration for CaloriePlus
 * Enables: React Native preset, module resolver (absolute imports), env variables
 */
const isTest = process.env.NODE_ENV === 'test';
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ...(isTest ? [] : [['module:react-native-dotenv', { moduleName: '@env', path: '.env' }]]),
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@assets': './src/assets',
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@store': './src/store',
          '@services': './src/services',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@theme': './src/theme',
          '@models': './src/models',
          '@config': './src/config',
        },
      },
    ],

    'react-native-worklets/plugin'  
  ],
};
