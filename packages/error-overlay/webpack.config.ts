/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const rootDir = path.resolve(__dirname);
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  target: ['web', 'es5'],
  entry: { overlay: './src/index.tsx' },
  output: {
    clean: true,
    path: path.join(rootDir, './dist'),
    filename: '[name].js'
  },
  devtool: !isProduction ? 'eval-cheap-source-map' : false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  optimization: {
    minimize: false,
    minimizer: ['...', new CssMinimizerPlugin()]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    fallback: {
      fs: false,
      path: false
    },
    alias: {
      '#': path.resolve(rootDir, './src/')
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve('node_modules/source-map/lib/mappings.wasm') }
      ]
    })
  ]
};
