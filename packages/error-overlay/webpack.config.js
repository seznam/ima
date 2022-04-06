const path = require('path');

const CompressionPlugin = require('compression-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');

const { createWebpackConfig } = require('../../createWebpackConfig');

module.exports = createWebpackConfig(
  (config, { isProduction }) =>
    merge(config, {
      entry: { overlay: './src/index.tsx' },
      plugins: [
        isProduction &&
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
    }),
  { useStyleLoader: true }
);
