const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const postcss = require('postcss');
const miniSVGDataURI = require('mini-svg-data-uri');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const PostCssPipelineWebpackPlugin = require('postcss-pipeline-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const RunImaServerPlugin = require('./plugins/RunImaServerPlugin');
const {
  requireConfig,
  resolveEnvironment,
  additionalDataFactory,
  generateEntryPoints,
  wif
} = require('./utils');
const postCssScrambler = require('./postCssScrambler');

module.exports = async (args, imaConfig) => {
  const { rootDir, isProduction, isServer, isWatch } = args;
  const packageJson = require(path.resolve(rootDir, './package.json'));
  const imaEnvironment = resolveEnvironment(rootDir);
  const outputDir = path.join(rootDir, 'build');
  const ampEnabled = args.amp ?? imaConfig?.amp?.enabled;

  // Clean build directory
  if (args.clean && fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }

  return {
    target: 'web',
    mode: isProduction ? 'production' : 'development',
    name: isServer ? 'server' : 'client',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    bail: isProduction,
    entry: {
      ...wif(isServer)({ server: path.join(rootDir, 'app/main.js') }),
      ...wif(!isServer)({
        client: [
          ...wif(isWatch)([
            `webpack-hot-middleware/client?path=//localhost:${imaEnvironment.$Server.port}/__webpack_hmr&timeout=20000&reload=true&overlay=true&overlayWarnings=true`
          ]),
          path.join(rootDir, 'app/main.js')
        ]
      }),
      // AMP specific entry points
      ...wif(!isServer && ampEnabled && imaConfig?.amp?.entry?.length > 0)(
        await generateEntryPoints(rootDir, imaConfig?.amp?.entry)
      )
    },
    output: {
      path: outputDir,
      pathinfo: !isProduction,
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      filename: ({ chunk }) => {
        if (chunk.name === 'server') {
          return 'ima/app.server.js';
        }

        return `static/js/${chunk.name === 'client' ? 'main' : '[name]'}.js`;
      },
      publicPath: imaConfig?.publicPath ?? '',
      ...wif(isServer)({ library: { type: 'commonjs2' } })
    },
    // cache: {}, // TOOD compare filesystem/memory cache performance
    optimization: {
      minimize: isProduction && !isServer,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        app: path.join(rootDir, 'app'),
        '@ima/core': `@ima/core/dist/ima.${
          isServer ? 'server' : 'client'
        }.cjs.js`,
        ...(imaConfig?.webpackAliases ?? {})
      }
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, 'loaders'), 'node_modules']
    },
    module: {
      rules: [
        // Handle node_modules packages that contain sourcemaps
        {
          enforce: 'pre',
          test: /\.(js|mjs|jsx|ts|tsx|cjs|css)$/,
          use: 'source-map-loader'
        },
        {
          /**
           * This will traverse following loaders until a match is found.
           * If no matches are found, it falls back to resource loader
           * (much like create-react-app does this).
           */
          oneOf: [
            /**
             * Image loaders, which either load explicitly image as inline
             * or external, or choose which mode to use automatically based
             * on the resource size
             */
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.webp$/],
              oneOf: [
                {
                  resourceQuery: /inline/, // foo.png?inline
                  type: 'asset/inline'
                },
                {
                  resourceQuery: /external/, // foo.png?external
                  type: 'asset/resource'
                },
                {
                  type: 'asset',
                  parser: {
                    dataUrlCondition: {
                      maxSize: imaConfig?.imageInlineSizeLimit ?? 8192
                    }
                  }
                }
              ]
            },
            /**
             * Uses svgo to optimize loaded svg files. Inline and external logic
             * using the queryParam in import path applies here the same as with
             * the image assets. Inline SVGs are converted to more efficient data URI.
             * Defaults to external
             */
            {
              test: /\.svg$/,
              oneOf: [
                {
                  resourceQuery: /inline/, // foo.svg?inline
                  type: 'asset/inline',
                  generator: {
                    dataUrl: content => miniSVGDataURI(content.toString())
                  }
                },
                {
                  type: 'asset/resource'
                }
              ],
              use: 'svgo-loader'
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx|cjs)$/,
              exclude: /node_modules/,
              use: [
                // {
                //   loader: 'plugin-loader',
                //   options: {}
                // },
                {
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
                      presets: [
                        '@babel/preset-env',
                        [
                          '@babel/preset-react',
                          {
                            development: !isProduction,
                            runtime: 'classic'
                            // runtime: 'automatic'
                          }
                        ]
                      ],
                      // plugins: isProduction ? [] : ['react-refresh/babel']
                      plugins: []
                    }
                  })
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
            },
            {
              exclude: [
                /^$/,
                /\.(js|mjs|jsx|ts|tsx|cjs)$/,
                /\.html$/,
                /\.json$/
              ],
              type: 'asset/resource'
            }
          ]
        }
      ]
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
          ...wif(isWatch)([
            new RunImaServerPlugin({
              rootDir,
              open: args.open,
              verbose: args.verbose,
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
          ...wif(args.scrambleCss ?? imaConfig?.scrambleCss)([
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
          ...wif(ampEnabled)([
            // This should run only for amp entry points
            new PostCssPipelineWebpackPlugin({
              predicate: name =>
                !/static\/css\/app.css$/.test(name) &&
                !/srambled.css$/.test(name),
              suffix: 'srambled',
              processor: postcss([
                ...wif(args.scrambleCss ?? imaConfig?.scrambleCss)([
                  postCssScrambler({
                    generateHashTable: false,
                    hashTable: path.join(rootDir, 'build/static/hashtable.json')
                  })
                ]),
                ...wif(imaConfig?.amp?.postCssPlugins.length > 0)(
                  imaConfig?.amp?.postCssPlugins,
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
          ...wif(imaConfig?.compress)([new CompressionPlugin()]),
          ...wif(isWatch)([
            new webpack.HotModuleReplacementPlugin()
            // new ReactRefreshWebpackPlugin({
            //   overlay: {
            //     sockIntegration: 'whm'
            //   }
            // })
          ])
        ],
    ...wif(isServer)({
      externalsPresets: {
        node: true
      }
    })
  };
};
