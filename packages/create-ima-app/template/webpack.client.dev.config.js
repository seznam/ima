const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const envSource = require(process.cwd() + '/app/environment.js');
const environmentConfig = require('@ima/server/lib/environment.js')(envSource);
const serverPort = environmentConfig.$Server.port;

module.exports = {
  name: 'client',
  target: 'web',
  mode: 'development',
  entry: [
    `webpack-hot-middleware/client?path=//localhost:${serverPort}/__webpack_hmr&timeout=20000&reload=true`,
    './app/main.js'
  ],
  output: {
    publicPath: '/',
    filename: 'static/js/main.js',
    path: path.resolve(__dirname, 'build/')
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      ['app']: path.resolve(__dirname + '/app'),
      '@ima/core': '@ima/core/dist/ima.client.cjs.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
            plugins: []
          }
        }
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: path.resolve(__dirname + '/pluginLoader.js'),
            options: {}
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/assets/static/html/spa.html',
      filename: 'index.html',
      templateParameters: {
        $Debug: environmentConfig.$Debug,
        $Env: environmentConfig.$Env,
        $App: JSON.stringify(environmentConfig.$App || {}),
        $Language: Object.values(environmentConfig.$Language)[0]
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
