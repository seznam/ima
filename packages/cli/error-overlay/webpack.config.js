/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const rootDir = path.resolve(__dirname);

module.exports = {
  entry: './index.tsx',
  output: {
    path: path.join(rootDir, './dist'),
    filename: 'bundle.js'
  },
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(rootDir, 'public')
    },
    compress: true,
    hot: true,
    port: 4000
  },
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
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.join(rootDir, './public/index.html')
    })
  ]
};
