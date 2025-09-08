module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '@': './',
            '@src': './src',
            '@config': './src/config',
            '@lib': './src/lib',
            '@context': './src/context',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@components': './components',
            '@types': './types',
            '@app': './app'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ],
  };
};
