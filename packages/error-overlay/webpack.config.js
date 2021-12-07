/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');

const rootDir = path.resolve(__dirname);
const overlayRootDir = path.resolve(__dirname, './overlay');
const clientRootDir = path.resolve(__dirname, './client');

const isProduction = process.env.NODE_ENV === 'production';

const baseConfig = {
  output: {
    path: path.join(rootDir, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: !isProduction ? 'eval-cheap-source-map' : false,
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
      minimize: isProduction,
      minimizer: ['...', new CssMinimizerPlugin()]
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
      new MiniCssExtractPlugin({
        filename: '[name].css'
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
