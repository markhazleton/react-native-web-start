const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    alias: {
      'react-native-web': 'react-native',
    },
    platforms: ['native', 'android', 'ios'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
