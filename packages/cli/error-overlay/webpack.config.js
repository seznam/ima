/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');

const rootDir = path.resolve(__dirname);
const overlayRootDir = path.resolve(__dirname, './overlay');
const clientRootDir = path.resolve(__dirname, './client');

const baseConfig = {
  output: {
    path: path.join(rootDir, './dist'),
    filename: '[name].js'
  },
  devtool: 'eval-cheap-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  }
};

module.exports = [
  merge(baseConfig, {
    entry: { overlay: './overlay/index.tsx' },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        }
      ]
    },
    resolve: {
      fallback: {
        fs: false,
        path: false
      },
      alias: {
        '#': path.resolve(overlayRootDir, './src/')
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: 'body',
        template: path.join(overlayRootDir, './public/index.html')
      })
    ]
  }),
  merge(baseConfig, {
    entry: { client: './client/index.ts' },
    target: 'node',
    output: {
      library: { type: 'commonjs2' }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.html$/i,
          use: 'raw-loader'
        }
      ]
    },
    resolve: {
      alias: {
        '#': path.resolve(clientRootDir, './src/')
      }
    }
  })
];
