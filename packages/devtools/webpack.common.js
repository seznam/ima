const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const generate = require('generate-file-webpack-plugin');

const pkg = require('./package');
const manifest = require('./manifest');

const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');

const PRODUCTION =
  process.env.NODE_ENV && process.env.NODE_ENV === 'production';

function buildManifest() {
  const { version } = pkg;
  manifest.version = version;

  return JSON.stringify(manifest, null, '  ');
}

module.exports = {
  mode: PRODUCTION ? 'production' : 'development',
  entry: {
    options: `${srcDir}/options.js`,
    popup: `${srcDir}/popup.js`,
    contentScript: `${srcDir}/contentScript.js`,
    background: `${srcDir}/background.js`,
    devtools: `${srcDir}/devtools.js`,
    panel: `${srcDir}/panel.js`
  },
  output: {
    path: distDir,
    filename: 'js/[name].js'
  },
  resolve: {
    modules: [srcDir, 'node_modules'],
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx']
  },
  watchOptions: {
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: `[path][name]__[local]--[hash:base64:5]`
              }
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images',
              publicPath: '../images/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    generate({
      file: 'manifest.json',
      content: buildManifest()
    }),
    new CopyPlugin({
      patterns: [{ from: `${srcDir}/public`, to: distDir }]
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],
  stats: {
    children: false
  }
};
