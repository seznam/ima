const path = require('path');

const CompressionPlugin = require('compression-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ProgressPlugin } = require('webpack');

const rootDir = path.resolve(__dirname);
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  target: ['web', 'es11'],
  entry: { overlay: './index.tsx' },
  output: {
    clean: true,
    path: path.join(rootDir, './dist'),
    filename: '[name].js',
  },
  devtool: isProduction ? 'source-map' : 'eval-cheap-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(less)$/i,
        sideEffects: true,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'lazyStyleTag',
              insert: (element, options) => {
                const parent = options.target || document.head;

                parent.appendChild(element);
              },
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      browsers: 'last 2 versions, last 1 year, not safari 12.1',
                    },
                  ],
                ],
              },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  optimization: {
    minimize: isProduction,
    minimizer: ['...', new CssMinimizerPlugin()],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    fallback: {
      fs: false,
      path: false,
    },
    alias: {
      '#': path.resolve(rootDir, './src/'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new ProgressPlugin(),
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
        { from: path.resolve('node_modules/source-map/lib/mappings.wasm') },
      ],
    }),
  ].filter(Boolean),
};
