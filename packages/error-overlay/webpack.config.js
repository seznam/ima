const path = require('path');

const CompressionPlugin = require('compression-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const { createWebpackConfig } = require('../../createWebpackConfig');

module.exports = createWebpackConfig(baseConfig => {
  const config = {
    ...baseConfig,
    entry: { overlay: './src/index.tsx' },
    plugins: [
      new CompressionPlugin({
        algorithm: 'brotliCompress',
        filename: `[path][base].br`,
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          level: 9,
        },
        threshold: 0,
        minRatio: 0.95,
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.join(
              path.dirname(require.resolve('source-map')),
              'lib/mappings.wasm'
            ),
          },
        ],
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
      /**
       * Allows optional lazy insert to custom document element.
       */
      // Allows custom insert using `styles.use({ target: this.shadowRoot })`;
      insert: (element, options) => {
        const parent = options.target || document.head;

        parent.appendChild(element);
      },
    },
  };

  return config;
});
