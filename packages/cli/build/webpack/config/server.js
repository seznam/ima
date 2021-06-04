const path = require('path');
//const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = args => ({
  name: 'server',
  mode: 'development',
  entry: [path.resolve(args.cwd, './app/main.js')],
  output: {
    publicPath: '/',
    filename: 'ima/app.server.js',
    path: path.resolve(args.cwd, 'build'),
    libraryTarget: 'commonjs2'
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
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      ['app']: path.resolve(args.cwd, '/app'),
      '@ima/core': '@ima/core/dist/ima.server.cjs.js'
    }
  },
  externalsPresets: {
    node: true
  },
  externals: [], //nodeExternals()
  node: {
    __dirname: false,
    __filename: false
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'app/assets/static', to: 'static' },
        { from: 'app/environment.js', to: 'ima/config/environment.js' },
        'server/server.js'
      ]
    })
  ]
});
