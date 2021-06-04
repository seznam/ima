const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function clientConfig(args) {
  const envSource = require(path.resolve(args.cwd, './app/environment.js'));
  const environmentConfig = require(path.resolve(
    args.cwd,
    './node_modules/@ima/server/lib/environment.js'
  ))(envSource);
  const serverPort = environmentConfig.$Server.port;

  return {
    name: 'client',
    target: 'web',
    mode: 'development',
    entry: [
      `webpack-hot-middleware/client?path=//localhost:${serverPort}/__webpack_hmr&timeout=20000&reload=true`,
      path.resolve(args.cwd, './app/main.js')
    ],
    output: {
      publicPath: '/',
      filename: 'static/js/main.js',
      path: path.resolve(args.cwd, 'build/')
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        ['app']: path.resolve(args.cwd, '/app'),
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
              loader: path.resolve(__dirname, '../loaders/pluginLoader.js'),
              options: {}
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(args.cwd, './app/assets/static/html/spa.html'),
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
}

module.exports = clientConfig;
