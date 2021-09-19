import path from 'path';
import fs from 'fs';
import webpack, { Configuration, RuleSetRule } from 'webpack';
import postcss from 'postcss';
import miniSVGDataURI from 'mini-svg-data-uri';

import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';
import PostCssPipelineWebpackPlugin from 'postcss-pipeline-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { ConfigurationContext, ImaConfig } from '../types';
import RunImaServerPlugin from './plugins/RunImaServerPlugin';
import {
  requireConfig,
  resolveEnvironment,
  additionalDataFactory,
  createCacheKey,
  resolveEsVersionTargets,
  IMA_CONF_FILENAME
} from './utils';
import postCssScrambler from './postCssScrambler';
import { generateEntryPoints } from './postCssScrambler/postCssScramblerUtils';

/**
 * Creates Webpack configuration object based on input ConfigurationContext
 * and ImaConfig objects.
 *
 * @returns {Promise<Configuration>} Webpack configuration object.
 */
export default async (
  ctx: ConfigurationContext,
  imaConfig: ImaConfig
): Promise<Configuration> => {
  const { rootDir, isProduction, isServer, isWatch, ecma, name } = ctx;
  const packageJsonPath = path.resolve(rootDir, './package.json');
  const packageJson = packageJsonPath ? require(packageJsonPath) : {};
  const imaEnvironment = resolveEnvironment(rootDir);
  const outputDir = path.join(rootDir, 'build');

  const scrambleCssEnabled = ctx.scrambleCss ?? imaConfig.scrambleCss;
  const ampEnabled =
    (ctx.amp ?? imaConfig?.amp?.enabled) &&
    imaConfig?.amp?.entry &&
    imaConfig.amp.entry?.length > 0;

  // Clean build directory
  if (ctx?.clean && fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }

  return {
    // TODO adapt targets to esVersions configurations
    name,
    target: 'web',
    mode: isProduction ? 'production' : 'development',
    devtool: false,
    bail: isProduction,
    entry: {
      ...(isServer
        ? { server: path.join(rootDir, 'app/main.js') }
        : {
            client: [
              isWatch
                ? `webpack-hot-middleware/client?path=//localhost:${imaEnvironment.$Server.port}/__webpack_hmr&timeout=20000&reload=true&overlay=true&overlayWarnings=true`
                : '',
              path.join(rootDir, 'app/main.js')
            ].filter(Boolean)
          }),

      // AMP specific entry points
      ...(!isServer &&
        ampEnabled && {
          ...(await generateEntryPoints(rootDir, imaConfig?.amp?.entry))
        })
    },
    output: {
      path: outputDir,
      pathinfo: !isProduction,
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      filename: ({ chunk }) => {
        if (chunk?.name === 'server') {
          return 'ima/app.server.js';
        }

        return `static/js/${chunk?.name === 'client' ? 'main' : '[name]'}${
          ecma?.suffix ?? ''
        }.js`;
      },
      publicPath: imaConfig.publicPath,
      ...(isServer && { library: { type: 'commonjs2' } })
    },
    cache: {
      type: 'filesystem',
      version: createCacheKey(ctx, imaConfig),
      cacheDirectory: path.join(rootDir, './.ima/cache'),
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [path.join(rootDir, IMA_CONF_FILENAME)].filter(f =>
          fs.existsSync(f)
        )
      }
    },
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
        !isProduction && {
          enforce: 'pre',
          test: /\.(js|mjs|jsx|ts|tsx|cjs|css)$/,
          use: require.resolve('source-map-loader')
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
                      maxSize: imaConfig.imageInlineSizeLimit
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
                    dataUrl: (content: string | Buffer) =>
                      miniSVGDataURI(content.toString())
                  }
                },
                {
                  type: 'asset/resource'
                }
              ],
              use: require.resolve('svgo-loader')
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
                  loader: require.resolve('babel-loader'),
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
                        [
                          require.resolve('@babel/preset-env'),
                          {
                            targets: resolveEsVersionTargets(ecma?.version)
                          }
                        ],
                        [
                          require.resolve('@babel/preset-react'),
                          {
                            development: !isProduction,
                            runtime: 'classic'
                            // runtime: 'automatic' // TODO Prepare ima to be able to handle automatic runtime
                          }
                        ]
                      ],
                      plugins:
                        isWatch && !isServer
                          ? [require.resolve('react-refresh/babel')]
                          : [],
                      cacheDirectory: true,
                      cacheCompression: false,
                      compact: isProduction,
                      sourceMaps: !isProduction,
                      inputSourceMap: !isProduction
                    }
                  })
                }
              ]
            },
            // TODO add support for CSS files import
            /**
             * Less loader configuration, which adds support for glob imports in the
             * less files, postcss, and css imports support. Additionally
             * app/assets/less/globals.less is always prepended to every less file
             * computed. This allows you to define globals (variables) which don't
             * have to be imported in every LESS file manually.
             */
            {
              test: /\.less$/,
              sideEffects: true,
              exclude: /node_modules/,
              use: [
                !isServer &&
                  ecma?.isMain && {
                    loader: MiniCssExtractPlugin.loader
                  },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: isServer || !ecma?.isMain ? 1 : 2,
                    modules: {
                      auto: true,
                      exportOnlyLocals: isServer || !ecma?.isMain,
                      localIdentName: isProduction
                        ? '[hash:base64]'
                        : '[path][name]__[local]--[hash:base64:5]'
                    },
                    sourceMap: !isProduction
                  }
                },
                !isServer &&
                  ecma?.isMain && {
                    loader: require.resolve('postcss-loader'),
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
                      }),
                      sourceMap: !isProduction
                    }
                  },
                {
                  loader: require.resolve('less-loader'),
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
                    ]),
                    sourceMap: !isProduction
                  }
                },
                {
                  loader: require.resolve('glob-import-loader'),
                  options: {
                    sourceMap: !isProduction
                  }
                }
              ].filter(Boolean)
            },
            /**
             * Fallback loader for all modules, that don't match any
             * of the above defined rules.
             */
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
      ].filter(Boolean) as RuleSetRule[]
    },
    plugins: [
      // General plugins
      !isProduction &&
        new webpack.SourceMapDevToolPlugin({
          test: /\.(le|c)ss$/
        }),
      !isProduction &&
        new webpack.EvalSourceMapDevToolPlugin({
          test: /\.[jt]sx?$/
        }),

      // Server/client specific plugins are defined below
      ...(isServer
        ? // Server-specific plugins
          [
            // Copies essential assets to static directory
            new CopyPlugin({
              patterns: [
                { from: 'app/assets/static', to: 'static' },
                { from: 'app/environment.js', to: 'ima/config/environment.js' },
                'server/server.js'
              ]
            }),

            // Opens web browser after running dev script
            isWatch &&
              new RunImaServerPlugin({
                rootDir,
                open: ctx?.open,
                verbose: ctx?.verbose,
                port: imaEnvironment.$Server.port
              })
          ]
        : // Client-specific plugins
          [
            // Removes generated empty script caused by non-js entry points
            new RemoveEmptyScriptsPlugin(),

            // Handles LESS/CSS extraction out of JS to separate css file
            new MiniCssExtractPlugin({
              filename: ({ chunk }) =>
                `static/css/${chunk?.name === 'client' ? 'app' : '[name]'}.css`,
              chunkFilename: 'static/css/[name].chunk.css'
            }),

            // This pipeline should run only for main app css file
            scrambleCssEnabled &&
              new PostCssPipelineWebpackPlugin({
                predicate: (name: string) => /static\/css\/app.css$/.test(name),
                suffix: 'srambled',
                processor: postcss([
                  // Run CSS scrambler, this needs to run on generated assets
                  postCssScrambler({
                    generateHashTable: true,
                    uniqueIdentifier: `${packageJson.name}:${packageJson.version}`,
                    hashTable: path.join(rootDir, 'build/static/hashtable.json')
                  })
                ])
              }),

            // This should run only for amp entry points
            ampEnabled &&
              new PostCssPipelineWebpackPlugin({
                predicate: (name: string) =>
                  !/static\/css\/app.css$/.test(name) &&
                  !/srambled.css$/.test(name),
                suffix: 'srambled',
                processor: postcss(
                  [
                    // Run CSS scrambler on AMP sources, if enabled
                    ...(scrambleCssEnabled
                      ? [
                          postCssScrambler({
                            generateHashTable: false,
                            hashTable: path.join(
                              rootDir,
                              'build/static/hashtable.json'
                            )
                          })
                        ]
                      : []),

                    // Custom AMP postCss plugins
                    ...(imaConfig?.amp?.postCssPlugins?.length
                      ? imaConfig?.amp?.postCssPlugins
                      : [])
                  ].filter(Boolean)
                )
              }),

            // Handles generation of spa.html public file
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

            // Enables compression for assets in production build
            ...(isProduction
              ? imaConfig.compression.map(
                  algorithm =>
                    new CompressionPlugin({
                      algorithm,
                      filename: `[path][base].${
                        algorithm === 'brotliCompress' ? 'br' : 'gz'
                      }`,
                      test: /\.(js|css|html|svg)$/,
                      compressionOptions: {
                        level: 9
                      },
                      threshold: 0,
                      minRatio: 0.95
                    })
                )
              : []),

            // Following plugins enable react refresh and hmr in watch mode
            isWatch && new webpack.HotModuleReplacementPlugin(),
            isWatch &&
              new ReactRefreshWebpackPlugin({
                overlay: {
                  sockIntegration: 'whm'
                }
              })
          ])
    ].filter(Boolean),

    // Enable node preset for externals on server
    externalsPresets: {
      node: isServer
    }
  };
};
