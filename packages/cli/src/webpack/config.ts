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
  requireBabelConfig
} from './utils';

const POSTCSS_CONF_FILENAMES = [
  'postcss.config.js',
  'postcss.config.cjs',
  'postcss.config.json',
  '.postcssrc.js',
  '.postcssrc.cjs',
  '.postcssrc.json',
  '.postcssrc'
];

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
  const { rootDir, isProduction, isServer, isEsVersion, name } = ctx;

  // We use source maps always in development for better stack trace orientation.
  const isWatch = ctx.command === 'dev';
  const useSourceMaps = imaConfig.useSourceMaps || !isProduction;
  const imaEnvironment = resolveEnvironment(rootDir);
  const outputDir = path.join(rootDir, 'build');
  const publicPath = ctx?.publicPath ?? imaConfig.publicPath;

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
            localIdentName: isProduction
              ? '[hash:base64]'
              : '[path][name]__[local]--[hash:base64:5]'
          },
          sourceMap: useSourceMaps
        }
      },
      !onlyCssDefinitions && {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: requireConfig({
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
          }),
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
    target: isServer ? 'node' : 'web',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction
      ? imaConfig.useSourceMaps
        ? 'source-map'
        : false
      : 'cheap-module-source-map',
    entry: {
      ...(isServer
        ? {
            server: [path.join(rootDir, 'app/main.js')]
          }
        : {
            [name]: [
              isWatch &&
                // We have to use @gatsbyjs version, since the original package containing webpack 5 fix is not yet released
                `@gatsbyjs/webpack-hot-middleware/client?name=${name}&path=//localhost:${imaEnvironment.$Server.port}/__webpack_hmr&timeout=15000&reload=true&overlay=false&overlayWarnings=false&noInfo=true&quiet=true`,
              require.resolve('@ima/hmr-client/dist/imaHmrClient.js'),
              path.join(rootDir, 'app/main.js')
            ].filter(Boolean) as string[]
          })
    },
    output: {
      path: outputDir,
      pathinfo: !isProduction,
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      filename: ({ chunk }) => {
        // Put server-side JS into server directory
        if (isServer) {
          return `server/${chunk?.name === name ? 'app.server' : '[name]'}.js`;
        }

        // Separate client chunks into es and non-es folders
        const baseFolder = `static/${isEsVersion ? 'js.es' : 'js'}`;

        if (isProduction) {
          return `${baseFolder}/app.bundle.min.js`;
        }

        return `${baseFolder}/${
          chunk?.name === name ? 'app.client' : '[name]'
        }.js`;
      },
      publicPath,
      environment: {
        arrowFunction: isEsVersion || isServer,
        bigIntLiteral: false,
        const: isEsVersion || isServer,
        destructuring: isEsVersion || isServer,
        dynamicImport: false,
        forOf: isEsVersion || isServer,
        module: isEsVersion
      },
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
      minimize: isProduction && !isServer,
      minimizer: [
        new TerserPlugin({
          minify: TerserPlugin.esbuildMinify
        }),
        new CssMinimizerPlugin({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          minify: CssMinimizerPlugin.esbuildMinify
        })
      ],
      // Split chunks in dev for better performance and caching
      ...(!isProduction
        ? {
            moduleIds: 'deterministic',
            chunkIds: 'deterministic',
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
        useSourceMaps && {
          enforce: 'pre',
          exclude: /@babel(?:\/|\\{1,2})runtime/,
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
                {
                  loader: require.resolve('babel-loader'),
                  options: requireBabelConfig({
                    ctx,
                    defaultConfig: {
                      presets: [
                        [
                          require.resolve('@babel/preset-env'),
                          {
                            ...(isEsVersion || isServer
                              ? {
                                  targets: {
                                    node: '14'
                                  }
                                }
                              : {}),
                            modules: 'auto'
                          }
                        ],
                        [
                          require.resolve('@babel/preset-react'),
                          {
                            development: !isProduction,
                            runtime: 'automatic'
                          }
                        ]
                      ],
                      plugins:
                        isWatch && !isServer
                          ? [require.resolve('react-refresh/babel')]
                          : [],
                      /**
                       * Disable config and babel rc files since we handle those
                       * manually in the requireBabelConfig function.
                       */
                      babelrc: false,
                      configFile: false,
                      // Enable cache for better performance
                      cacheDirectory:
                        findCacheDir({
                          name: `babel-loader-ima-${name}-cache`
                        }) ?? true,
                      cacheCompression: false,
                      compact: isProduction,
                      sourceMaps: useSourceMaps,
                      inputSourceMap: useSourceMaps
                    }
                  })
                }
              ]
            },
            /**
             * Less loader configuration, which adds support for glob imports in the
             * less files, postcss, and css imports support. Additionally
             * app/less/globals.less is always prepended to every less file
             * computed. This allows you to define globals (variables) which don't
             * have to be imported in every LESS file manually.
             */
            {
              test: /\.less$/,
              sideEffects: true,
              exclude: /node_modules/,
              use: getStyleLoaders({ useLessLoader: true })
            },
            /**
             * CSS loader configuration, has the same capabilities as the less loader.
             */
            {
              test: /\.css$/,
              sideEffects: true,
              exclude: /node_modules/,
              use: getStyleLoaders()
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
                    isProduction ? '.min' : ''
                  }.css`,
                chunkFilename: `static/css/chunk-[id]${
                  isProduction ? '.min' : ''
                }.css`
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
    performance: false
  };
};
