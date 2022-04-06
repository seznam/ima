const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const generate = require('generate-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pkg = require('./package');
const manifest = require('./src/manifest');

const rootDir = path.resolve(__dirname);
const isProduction =
  process.env.NODE_ENV && process.env.NODE_ENV === 'production';

function buildManifest() {
  const { version } = pkg;
  manifest.version = version;

  return JSON.stringify(manifest, null, '  ');
}

// TODO clean in production before building

module.exports = {
  target: ['web', 'es11'],
  entry: {
    options: './src/options.js',
    popup: './src/popup.js',
    contentScript: './src/contentScript.js',
    background: './src/background.js',
    devtools: './src/devtools.js',
    panel: './src/panel.js',
  },
  mode: isProduction ? 'production' : 'development',
  stats: 'minimal',
  output: {
    path: path.join(rootDir, 'dist'),
    filename: 'js/[name].js',
  },
  devtool: isProduction ? 'source-map' : 'eval-cheap-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.mjs'],
    fallback: {
      fs: false,
      path: false,
    },
    alias: {
      '@': path.join(rootDir, 'src'),
    },
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  optimization: {
    minimize: isProduction,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: `[path][name]__[local]--[hash:base64:5]`,
              },
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    generate({
      file: 'manifest.json',
      content: buildManifest(),
    }),
    new CopyPlugin({
      patterns: [{ from: path.join(rootDir, 'src/public') }],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
};
