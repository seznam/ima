const CompressionPlugin = require('compression-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const { createWebpackConfig } = require('../../createWebpackConfig');

module.exports = createWebpackConfig(baseConfig => {
  const config = {
    ...baseConfig,
    entry: { overlay: './src/index.tsx' },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new CompressionPlugin({
        algorithm: 'brotliCompress',
        filename: `[path][base].br`,
        test: /\.(js|css|html|svg)$/,
        minRatio: 0.95,
      }),
    ].filter(Boolean),
  };

  const lessRules = config.module.rules.find(rule =>
    rule.test.test('file.less')
  );

  // Replace MiniCssExtractPlugin with style-loader
  lessRules.use[0] = {
    loader: require.resolve('style-loader'),
    options: {
      injectType: 'lazyStyleTag',
      insert: require.resolve('./insert-styles.js'),
    },
  };

  return config;
});
