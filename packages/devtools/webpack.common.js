const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');

module.exports = {
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
  optimization: {
    splitChunks: {
      chunks: 'initial',
      minSize: 30000,
      automaticNameDelimiter: '.'
    }
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
    new CopyPlugin([
      {
        from: `${srcDir}/public`,
        to: distDir
      },
      {
        from: `${srcDir}/manifest.json`,
        to: distDir
      }
    ]),
    new MiniCssExtractPlugin({
      filename: `css/[name].css`
    })
  ],
  stats: {
    children: false
  }
};
