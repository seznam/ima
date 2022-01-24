const path = require('path');

const { merge } = require('webpack-merge');

const rootDir = path.resolve(__dirname);
const isProduction = process.env.NODE_ENV === 'production';

const baseConfig = {
  output: {
    path: path.join(rootDir, './dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: !isProduction ? 'eval-cheap-source-map' : false,
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
};

module.exports = [
  merge(baseConfig, {
    target: ['web', 'es11'],
    entry: { imaHmrClient: './src/imaHmrClient.ts' },
    module: {
      rules: [
        {
          test: /\.html$/,
          type: 'asset/source',
        },
      ],
    },
    resolve: {
      alias: {
        '#': path.resolve(rootDir, './src/'),
      },
    },
  }),
  merge(baseConfig, {
    target: 'node16',
    entry: { fastRefreshClient: './src/fastRefreshClient.ts' },
    output: {
      library: { type: 'commonjs2' },
    },
    resolve: {
      alias: {
        '#': path.resolve(rootDir, './src/'),
      },
    },
  }),
];
