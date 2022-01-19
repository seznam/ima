import path from 'path';
import fs from 'fs';
import findCacheDir from 'find-cache-dir';
import webpack, { Configuration, RuleSetRule, RuleSetUseItem } from 'webpack';
import miniSVGDataURI from 'mini-svg-data-uri';

import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { ConfigurationContext, ImaConfig } from '../types';
import {
  requireConfig,
  resolveEnvironment,
  additionalDataFactory,
  createCacheKey,
  IMA_CONF_FILENAME,
  createPolyfillEntry,
  POSTCSS_CONF_FILENAMES,
  BABEL_CONF_ES_FILENAMES,
  BABEL_CONF_FILENAMES
} from './utils';

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
  const { rootDir, isServer, isEsVersion, name } = ctx;

  // Define helper variables derived from context
  const isDev = ctx.command === 'dev';
  const useSourceMaps = imaConfig.useSourceMaps || isDev;
  const imaEnvironment = resolveEnvironment(rootDir);
  const isDebug = imaEnvironment.$Debug;
  const outputDir = path.join(rootDir, 'build');
  const publicPath = ctx?.publicPath ?? imaConfig.publicPath;
  const appDir = path.join(rootDir, 'app');

  /**
   * When using build script and dev mode (not legacy, or forceSPA which uses es5),
   * the CSS files are only generated once for es version pass. For other compilers
   * only definitions are generated in order to fully support css.modules but
   * improve a compiling speed a little bit.
   */
  const onlyCssDefinitions =
    isServer || (!isEsVersion && ctx.command === 'build');

  /**
   * Style loaders helper function used to define
   * common style loader functions, that is later used
   * to handle css and less source files.
   */
  const getStyleLoaders = ({
    useLessLoader = false
  }: {
    useLessLoader?: boolean;
  } = {}): RuleSetUseItem[] => {
    let importLoaders = onlyCssDefinitions ? 0 : 1;

    // Increase number of import loaders for less loader
    if (useLessLoader) {
      importLoaders += 1;
    }

    return [
      !onlyCssDefinitions && {
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders,
          modules: {
            auto: true,
            exportOnlyLocals: onlyCssDefinitions,
            localIdentName: isDev
              ? '[path][name]__[local]--[hash:base64:5]'
              : '[hash:base64]'
          },
          sourceMap: useSourceMaps
        }
      },
      !onlyCssDefinitions && {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            config: false,
            // Require custom config (with defaults)
            ...requireConfig({
              ctx,
              packageJsonKey: 'postcss',
              fileNames: POSTCSS_CONF_FILENAMES,
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
          },
          implementation: require('postcss'),
          sourceMap: useSourceMaps
        }
      },
      useLessLoader && {
        loader: require.resolve('less-loader'),
        options: {
          lessOptions: {
            strictMath: true
          },
          additionalData: additionalDataFactory([
            prefix =>
              prefix(
                `@import "${path.join(rootDir, 'app/less/globals.less')}";`
              )
          ]),
          sourceMap: useSourceMaps
        }
      },
      {
        loader: require.resolve('glob-import-loader'),
        options: {
          sourceMap: useSourceMaps
        }
      }
    ].filter(Boolean) as RuleSetUseItem[];
  };

  return {
    name,
    target: isServer
      ? 'node14'
      : isEsVersion
      ? ['web', 'es11']
      : ['web', 'es5'],
    mode: isDev ? 'development' : 'production',
    devtool: isDev
      ? 'cheap-module-source-map'
      : useSourceMaps
      ? 'source-map'
      : false,
    entry: {
      ...(isServer
        ? {
            server: [path.join(rootDir, 'app/main.js')]
          }
        : {
            [name]: [
              isEsVersion &&
                isDev &&
                // We have to use @gatsbyjs version, since the original package containing webpack 5 fix is not yet released
                `@gatsbyjs/webpack-hot-middleware/client?name=${name}&path=//localhost:${imaEnvironment.$Server.port}/__webpack_hmr&timeout=15000&reload=true&overlay=false&overlayWarnings=false&noInfo=true&quiet=true`,
              isEsVersion &&
                isDev &&
                isDebug &&
                require.resolve('@ima/hmr-client/dist/imaHmrClient.js'),
              path.join(rootDir, 'app/main.js')
            ].filter(Boolean) as string[],
            ...createPolyfillEntry(ctx)
          })
    },
    output: {
      path: outputDir,
      pathinfo: isDev,
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      filename: ({ chunk }) => {
        // Put server-side JS into server directory
        if (isServer) {
          return `server/${chunk?.name === name ? 'app.server' : '[name]'}.js`;
        }

        // Separate client chunks into es and non-es folders
        const baseFolder = `static/${isEsVersion ? 'js.es' : 'js'}`;
        const fileNameParts = [
          chunk?.name === name && isDev && 'app.client',
          chunk?.name === name && !isDev && 'app.bundle',
          chunk?.name !== name && '[name]',
          !isDev && 'min',
          'js'
        ].filter(Boolean);

        return `${baseFolder}/${fileNameParts.join('.')}`;
      },
      publicPath,
      /**
       * We put hot updates into it's own folder
       * otherwise it clutters the built folder.
       */
      hotUpdateChunkFilename: 'hot/[id].[fullhash].hot-update.js',
      hotUpdateMainFilename: 'hot/[runtime].[fullhash].hot-update.json',
      ...(isServer && { library: { type: 'commonjs2' } })
    },
    cache: {
      type: 'filesystem',
      version: createCacheKey(ctx, imaConfig),
      store: 'pack',
      buildDependencies: {
        cliDeps: [__filename],
        defaultWebpack: ['webpack/lib/'],
        imaConfig: [path.join(rootDir, IMA_CONF_FILENAME)].filter(f =>
          fs.existsSync(f)
        )
      }
    },
    optimization: {
      minimize: !isDev && !isServer,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: {
              safari10: true
            },
            // Added for profiling in devtools
            keep_classnames: ctx.profile,
            keep_fnames: ctx.profile
          }
        }),
        new CssMinimizerPlugin()
      ],
      // Split chunks in dev for better caching
      ...(isDev
        ? {
            moduleIds: 'named',
            chunkIds: 'named',
            runtimeChunk: 'single', // Separate common runtime for better caching
            splitChunks: {
              cacheGroups: {
                vendor: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendors',
                  chunks: 'all'
                }
              }
            }
          }
        : {})
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      alias: {
        app: path.join(rootDir, 'app'),
        '@ima/core': `@ima/core/dist/ima.${
          isServer ? 'server' : 'client'
        }.cjs.js`,
        // Enable better profiling in react devtools
        ...(ctx.profile && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling'
        }),
        ...(imaConfig?.webpackAliases ?? {})
      }
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, 'loaders'), 'node_modules']
    },
    module: {
      rules: [
        /**
         * Extract source maps for node_module packages.
         */
        useSourceMaps && {
          enforce: 'pre',
          test: /\.(js|mjs|jsx|ts|tsx|cjs|css|less)$/,
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
              rules: [
                {
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
                  ]
                },
                {
                  loader: require.resolve('svgo-loader'),
                  options: {
                    js2svg: {
                      indent: 2,
                      pretty: isDev
                    }
                  }
                }
              ]
            },
            /**
             * Raw loaders, by default it loads file source into the bundle,
             * optionally by postfixing the import with '?external' we can
             * force it to return path to the source.
             */
            {
              test: [/\.csv$/, /\.txt$/, /\.html/],
              oneOf: [
                {
                  resourceQuery: /external/, // foo.png?external
                  type: 'asset/resource'
                },
                {
                  type: 'asset/source'
                }
              ]
            },
            {
              test: /\.(js|mjs|jsx|cjs)$/,
              include: appDir,
              exclude: /node_modules/,
              loader: require.resolve('babel-loader'),
              options: {
                // Disable config files since we handle the loading manually
                babelrc: false,
                configFile: false,
                // Enable cache for better performance
                cacheDirectory:
                  findCacheDir({
                    name: `babel-loader-ima-${name}-app-cache`
                  }) ?? true,
                cacheCompression: false,
                compact: !isDev,
                // Require custom config (with defaults)
                ...requireConfig({
                  ctx,
                  fileNames:
                    isEsVersion || isServer
                      ? BABEL_CONF_ES_FILENAMES
                      : BABEL_CONF_FILENAMES,
                  packageJsonKey:
                    isEsVersion || isServer ? 'babel.es' : 'babel',
                  defaultConfig: {
                    presets: [
                      [
                        require.resolve('@babel/preset-react'),
                        {
                          development: isDev,
                          runtime: 'automatic'
                        }
                      ],
                      [
                        require.resolve('@babel/preset-env'),
                        {
                          targets:
                            isEsVersion || isServer
                              ? { node: '14' }
                              : 'defaults',
                          bugfixes: true,
                          modules: false,
                          useBuiltIns: 'usage',
                          corejs: { version: '3.20', proposals: true },
                          exclude: ['transform-typeof-symbol']
                        }
                      ]
                    ],
                    plugins:
                      isDev && !isServer
                        ? [require.resolve('react-refresh/babel')]
                        : []
                  }
                }),
                sourceMaps: useSourceMaps,
                inputSourceMap: useSourceMaps
              }
            },
            /**
             * Process js of app directory with general babel config
             */
            {
              test: /\.(js|mjs|cjs)$/,
              exclude: /\bcore-js\b/, // Ignore core-js to prevent circular parsing
              loader: require.resolve('babel-loader'),
              options: {
                sourceType: 'unambiguous',
                babelrc: false,
                configFile: false,
                // Enable cache for better performance
                cacheDirectory:
                  findCacheDir({
                    name: `babel-loader-ima-${name}-cache`
                  }) ?? true,
                cacheCompression: false,
                compact: !isDev,
                presets: [
                  [
                    require.resolve('@babel/preset-env'),
                    {
                      targets:
                        isEsVersion || isServer ? { node: '14' } : 'defaults',
                      bugfixes: true,
                      modules: false,
                      useBuiltIns: 'usage',
                      corejs: { version: '3.20' },
                      exclude: ['transform-typeof-symbol']
                    }
                  ]
                ],
                sourceMaps: useSourceMaps,
                inputSourceMap: useSourceMaps
              }
            },
            {
              test: /\.less$/,
              sideEffects: true,
              use: getStyleLoaders({ useLessLoader: true })
            },
            /**
             * CSS loader configuration, has the same capabilities as the less loader.
             */
            {
              test: /\.css$/,
              sideEffects: true,
              use: getStyleLoaders()
            },
            /**
             * Fallback loader for all modules, that don't match any
             * of the above defined rules. This should be defined last.
             */
            {
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx|cjs)$/, /\.json$/],
              type: 'asset/resource'
            }
          ]
        }
      ].filter(Boolean) as RuleSetRule[]
    },
    plugins: [
      // Server/client specific plugins are defined below
      ...(isServer
        ? // Server-specific plugins
          [
            // Copies essential assets to static directory
            new CopyPlugin({
              patterns: [{ from: 'app/public', to: 'static/public' }]
            })
          ].filter(Boolean)
        : // Client-specific plugins
          [
            // Removes generated empty script caused by non-js entry points
            new RemoveEmptyScriptsPlugin(),

            /**
             * Handles LESS/CSS extraction out of JS to separate css file.
             * We use MiniCssExtractPlugin.loader only in es bundle.
             */
            !onlyCssDefinitions &&
              new MiniCssExtractPlugin({
                filename: ({ chunk }) =>
                  `static/css/${chunk?.name === name ? 'app' : '[name]'}${
                    !isDev ? '.min' : ''
                  }.css`,
                chunkFilename: `static/css/chunk-[id]${
                  !isDev ? '.min' : ''
                }.css`
              }),

            // Enables compression for assets in production build
            ...(!isDev
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
            isDev && new webpack.HotModuleReplacementPlugin(),
            isDev &&
              new ReactRefreshWebpackPlugin({
                overlay: {
                  module: '@ima/hmr-client/dist/fastRefreshClient.js',
                  sockIntegration: 'whm'
                }
              })
          ])
    ].filter(Boolean),

    // Enable node preset for externals on server
    externalsPresets: {
      node: isServer
    },

    // Turn webpack performance reports off since we print reports ourselves
    performance: false,

    // Disable infrastructure logging in normal mode
    infrastructureLogging: {
      level: ctx.verbose ? 'info' : 'none'
    }
  };
};
