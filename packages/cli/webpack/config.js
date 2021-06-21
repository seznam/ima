const path = require('path');
const webpack = require('webpack');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const RunImaServerPlugin = require('./plugins/RunImaServerPlugin');
const {
  requireConfig,
  resolveEnvironment,
  additionalDataFactory
} = require('./lib/configUtils');

module.exports = async args => {
  const { rootDir, isProduction, isServer, isWatch } = args;
  const packageJson = require(path.resolve(rootDir, './package.json'));
  const imaEnvironment = resolveEnvironment(rootDir);

  return {
    name: isServer ? 'server' : 'client',
    mode: isProduction ? 'production' : 'development',
    ...(isServer ? undefined : { target: 'web' }),
    entry: [
      ...(isWatch && !isServer
        ? [
            `webpack-hot-middleware/client?path=//localhost:${imaEnvironment.$Server.port}/__webpack_hmr&timeout=20000&reload=true&overlay=true`
          ]
        : []),
      path.resolve(rootDir, './app/main.js')
    ],
    output: {
      publicPath: args.publicPath,
      filename: isServer ? 'ima/app.server.js' : 'static/js/main.js',
      path: path.resolve(rootDir, './build'),
      ...(isServer ? { libraryTarget: 'commonjs2' } : undefined)
    },
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: requireConfig({
              rootDir,
              packageJson,
              packageJsonKey: 'babel',
              fileNames: [
                'babel.config.js',
                'babel.config.cjs',
                'babel.config.json',
                '.babelrc.js',
                '.babelrc.cjs',
                '.babelrc.json',
                '.babelrc'
              ],
              defaultConfig: {
                presets: ['@babel/preset-react'],
                plugins: []
              }
            })
          }
        },
        {
          test: /\.(js|jsx)$/,
          use: [
            {
              loader: path.resolve(__dirname, './loaders/pluginLoader.js'),
              options: {}
            }
          ]
        },
        {
          test: /\.less$/,
          sideEffects: true,
          exclude: /node_modules/,
          use: isServer
            ? 'null-loader'
            : [
                {
                  loader: MiniCssExtractPlugin.loader
                },
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 2,
                    modules: {
                      auto: true,
                      localIdentName: isProduction
                        ? '[hash:base64]'
                        : '[path][name]__[local]--[hash:base64:5]'
                    }
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: requireConfig({
                      rootDir,
                      packageJson,
                      packageJsonKey: 'postcss',
                      fileNames: [
                        'postcss.config.js',
                        'postcss.config.cjs',
                        'postcss.config.json',
                        '.postcssrc.js',
                        '.postcssrc.cjs',
                        '.postcssrc.json',
                        '.postcssrc'
                      ],
                      defaultConfig: {
                        plugins: [
                          'postcss-flexbugs-fixes',
                          [
                            'postcss-preset-env',
                            {
                              autoprefixer: {
                                flexbox: 'no-2009'
                              },
                              stage: 3,
                              features: {
                                'custom-properties': false
                              }
                            }
                          ]
                        ]
                      }
                    })
                  }
                },
                {
                  loader: 'less-loader',
                  options: {
                    lessOptions: {
                      strictMath: true,
                      paths: [path.resolve(rootDir, './app/assets/less')]
                    },
                    additionalData: additionalDataFactory([
                      content => `@import "globals.less";\n\n${content}`
                    ])
                  }
                },
                {
                  loader: 'glob-import-loader'
                }
              ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        ['app']: path.resolve(rootDir, './app'),
        '@ima/core': `@ima/core/dist/ima.${
          isServer ? 'server' : 'client'
        }.cjs.js`
      }
    },
    plugins: isServer
      ? [
          new CopyPlugin({
            patterns: [
              { from: 'app/assets/static', to: 'static' },
              { from: 'app/environment.js', to: 'ima/config/environment.js' },
              'server/server.js'
            ]
          }),
          ...(isWatch
            ? [
                new RunImaServerPlugin({
                  rootDir,
                  open: args.open,
                  port: imaEnvironment.$Server.port
                })
              ]
            : [])
        ]
      : [
          new MiniCssExtractPlugin({
            filename: './static/css/app.css'
          }),
          new HtmlWebpackPlugin({
            template: path.resolve(
              rootDir,
              './app/assets/static/html/spa.html'
            ),
            filename: 'index.html',
            templateParameters: {
              $Debug: imaEnvironment.$Debug,
              $Env: imaEnvironment.$Env,
              $App: JSON.stringify(imaEnvironment.$App || {}),
              $Language: Object.values(imaEnvironment.$Language)[0]
            }
          }),
          ...(isWatch ? [new webpack.HotModuleReplacementPlugin()] : [])
        ],
    ...(isServer
      ? {
          externalsPresets: {
            node: true
          }
        }
      : undefined),
    ...(isServer
      ? {
          node: false
        }
      : undefined)
  };
};
