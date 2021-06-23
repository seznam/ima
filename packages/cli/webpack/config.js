const path = require('path');
const webpack = require('webpack');
const postcss = require('postcss');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const PostCssPipelineWebpackPlugin = require('postcss-pipeline-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const RunImaServerPlugin = require('./plugins/RunImaServerPlugin');
const {
  requireConfig,
  resolveEnvironment,
  additionalDataFactory,
  generateEntryPoints,
  wif
} = require('./lib/configUtils');
const postCssScrambler = require('./postCssScrambler');

module.exports = async (options, imaConf) => {
  const { rootDir, isProduction, isServer, isWatch } = options;
  const packageJson = require(path.resolve(rootDir, './package.json'));
  const imaEnvironment = resolveEnvironment(rootDir);

  return {
    name: isServer ? 'server' : 'client',
    mode: isProduction ? 'production' : 'development',
    ...wif(!isServer, { target: 'web' }),
    entry: {
      ...wif(
        !isServer && options.amp && imaConf?.amp?.styleEntryPoints?.length > 0,
        await generateEntryPoints(rootDir, imaConf?.amp?.styleEntryPoints)
      ),
      ...wif(isServer, { server: path.join(rootDir, 'app/main.js') }),
      ...wif(!isServer, {
        client: [
          path.join(rootDir, 'app/main.js'),
          ...wif(isWatch, [
            `webpack-hot-middleware/client?path=//localhost:${imaEnvironment.$Server.port}/__webpack_hmr&timeout=20000&reload=true&overlay=true`
          ])
        ]
      })
    },
    output: {
      publicPath: options.publicPath,
      filename: ({ chunk }) => {
        if (chunk.name === 'server') {
          return 'ima/app.server.js';
        }

        return `static/js/${chunk.name === 'client' ? 'main' : '[name]'}.js`;
      },
      path: path.join(rootDir, 'build'),
      ...wif(isServer, { libraryTarget: 'commonjs2' })
    },
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    optimization: {
      minimize: isProduction && !isServer,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()]
    },
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
              loader: 'plugin-loader',
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
                      strictMath: true
                    },
                    additionalData: additionalDataFactory([
                      prefix =>
                        prefix(
                          `@import "${path.join(
                            rootDir,
                            'app/assets/less/globals.less'
                          )}";`
                        )
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
        ['app']: path.join(rootDir, 'app'),
        '@ima/core': `@ima/core/dist/ima.${
          isServer ? 'server' : 'client'
        }.cjs.js`
      }
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, 'loaders'), 'node_modules']
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
          ...wif(isWatch, [
            new RunImaServerPlugin({
              rootDir,
              open: options.open,
              port: imaEnvironment.$Server.port
            })
          ])
        ]
      : [
          new RemoveEmptyScriptsPlugin(),
          new MiniCssExtractPlugin({
            filename: ({ chunk }) =>
              `static/css/${chunk.name === 'client' ? 'app' : '[name]'}.css`
          }),
          ...wif(options.scrambleCss, [
            // This pipeline should run only for main app css file
            new PostCssPipelineWebpackPlugin({
              predicate: name => /static\/css\/app.css$/.test(name),
              suffix: 'srambled',
              processor: postcss([
                postCssScrambler({
                  generateHashTable: true,
                  uniqueIdentifier: `${packageJson.name}:${packageJson.version}`,
                  hashTable: path.join(rootDir, 'build/static/hashtable.json')
                })
              ])
            })
          ]),
          ...wif(options.amp, [
            // This should run only for amp entry points
            new PostCssPipelineWebpackPlugin({
              predicate: name =>
                !/static\/css\/app.css$/.test(name) &&
                !/srambled.css$/.test(name),
              suffix: 'srambled',
              processor: postcss([
                ...wif(options.scrambleCss, [
                  postCssScrambler({
                    generateHashTable: false,
                    hashTable: path.join(rootDir, 'build/static/hashtable.json')
                  })
                ]),
                ...wif(
                  imaConf?.amp?.postCssPlugins.length > 0,
                  imaConf?.amp?.postCssPlugins,
                  []
                )
              ])
            })
          ]),
          new HtmlWebpackPlugin({
            template: path.join(rootDir, 'app/assets/static/html/spa.html'),
            filename: 'index.html',
            templateParameters: {
              $Debug: imaEnvironment.$Debug,
              $Env: imaEnvironment.$Env,
              $App: JSON.stringify(imaEnvironment.$App || {}),
              $Language: Object.values(imaEnvironment.$Language)[0]
            }
          }),
          ...wif(isProduction && options.compress, [new CompressionPlugin()]),
          ...wif(isWatch, [new webpack.HotModuleReplacementPlugin()])
        ],
    ...wif(isServer, {
      externalsPresets: {
        node: true
      }
    }),
    ...wif(isServer, {
      node: false
    })
  };
};
