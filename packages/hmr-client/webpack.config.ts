import path from 'path';

import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';

const rootDir = path.resolve(__dirname);
const isProduction = process.env.NODE_ENV === 'production';

const baseConfig: Configuration = {
  target: ['web', 'es5'],
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
  merge<Configuration>(baseConfig, {
    entry: { imaHmrClient: './src/imaHmrClient.ts' },
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
        '#': path.resolve(rootDir, './src/')
      }
    }
  }),
  merge<Configuration>(baseConfig, {
    entry: { fastRefreshClient: './src/fastRefreshClient.ts' },
    target: 'node14',
    output: {
      library: { type: 'commonjs2' },
      environment: {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        dynamicImport: false,
        forOf: false,
        module: false,
        optionalChaining: false,
        templateLiteral: false,
      },
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
        '#': path.resolve(rootDir, './src/')
      }
    }
  })
];
