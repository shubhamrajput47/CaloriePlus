const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration - CaloriePlus
 * Ensures correct resolution for monorepo/absolute imports
 */
const config = {
  resolver: {
    nodeModulesPaths: [require('path').resolve(__dirname, 'node_modules')],
  },
  watchFolders: [require('path').resolve(__dirname, 'src')],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
