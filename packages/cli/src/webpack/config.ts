import fs from 'fs';
import path from 'path';
import { URLSearchParams } from 'url';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
// eslint-disable-next-line import/default
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack, {
  Configuration,
  RuleSetRule,
  RuleSetUseItem,
  WebpackPluginInstance,
} from 'webpack';

import { ImaConfigurationContext, ImaConfig } from '../types';
import { GenerateRunnerPlugin } from './plugins/GenerateRunnerPlugin';
import { createProgress } from './plugins/ProgressPlugin';
import {
  resolveEnvironment,
  createCacheKey,
  IMA_CONF_FILENAME,
  createPolyfillEntry,
  extractLanguages,
  createDevServerConfig,
} from './utils';

/**
 * Creates Webpack configuration object based on input ConfigurationContext
 * and ImaConfig objects.
 *
 * @returns {Promise<Configuration>} Webpack configuration object.
 */
export default async (
  ctx: ImaConfigurationContext,
  imaConfig: ImaConfig
): Promise<Configuration> => {
  const { rootDir, isServer, isEsVersion, name, processCss } = ctx;

  // Define helper variables derived from context
  const isDevEnv = ctx.environment === 'development';
  const useSourceMaps = !!imaConfig.sourceMap || isDevEnv;
  const imaEnvironment = resolveEnvironment(rootDir);
  const isDebug = imaEnvironment.$Debug;
  const outputDir = path.join(rootDir, 'build');
  const appDir = path.join(rootDir, 'app');
  const useHMR = ctx.command === 'dev' && isEsVersion;
  const devServerConfig = createDevServerConfig({ imaConfig, ctx });

  // Define browserslist targets for current context
  let targets: 'defaults' | Record<string, string> = 'defaults';

  if (isEsVersion) {
    targets = {
      chrome: '80',
      edge: '80',
      firefox: '80',
      opera: '67',
      safari: '14',
      ios: '14',
    };
  } else if (isServer) {
    targets = { node: '18' };
  }

  // Set correct devtool source maps config
  const devtool = useSourceMaps
    ? typeof imaConfig.sourceMap === 'string'
      ? imaConfig.sourceMap
      : 'source-map'
    : false;

  /**
   * CSS loaders function generator. Contains postcss-loader
   * and optional less loaders.
   */
  const getStyleLoaders = async (
    useLessLoader = false
  ): Promise<RuleSetUseItem[]> => {
    return [
      ...(!imaConfig.experiments?.css
        ? [
            processCss && {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: {
                  auto: true,
                  exportOnlyLocals: !processCss,
                  localIdentName: isDevEnv
                    ? '[path][name]__[local]--[hash:base64:5]'
                    : '[hash:base64]',
                },
                sourceMap: useSourceMaps,
              },
            },
          ]
        : []),
      {
        loader: require.resolve('postcss-loader'),
        options: await imaConfig.postcss(
          {
            postcssOptions: {
              config: false,
              plugins: [
                'postcss-flexbugs-fixes',
                [
                  'postcss-preset-env',
                  {
                    browsers: 'defaults',
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 3,
                    features: {
                      'custom-properties': false,
                    },
                  },
                ],
              ],
            },
            implementation: require('postcss'),
            sourceMap: useSourceMaps,
          },
          ctx
        ),
      },
      useLessLoader && {
        loader: require.resolve('less-loader'),
        options: {
          sourceMap: useSourceMaps,
        },
      },
      useLessLoader && {
        loader: 'extend-less-loader',
        options: {
          globalsPath: path.join(rootDir, 'app/less/globals.less'),
        },
      },
    ].filter(Boolean) as RuleSetUseItem[];
  };

  return {
    name,
    dependencies: [],
    target: isServer
      ? 'node18'
      : isEsVersion
      ? ['web', 'es11']
      : ['web', 'es5'],
    mode: isDevEnv ? 'development' : 'production',
    devtool: useHMR
      ? 'cheap-module-source-map' // Needed for proper source maps parsing in error-overlay
      : devtool,
    entry: {
      ...(isServer
        ? {
            server: [path.join(rootDir, 'app/main.js')],
          }
        : {
            [name]: [
              // Inject fetch polyfill to es5 bundle
              !isEsVersion && require.resolve('whatwg-fetch'),
              // We have to use @gatsbyjs version, since the original package containing webpack 5 fix is not yet released
              useHMR &&
                `@gatsbyjs/webpack-hot-middleware/client?${new URLSearchParams({
                  name,
                  path: `${devServerConfig.publicUrl}/__webpack_hmr`,
                  timeout: '3000',
                  reload: 'true',
                  overlay: 'false',
                  overlayWarnings: 'false',
                  noInfo: 'true',
                  quiet: 'true',
                }).toString()}`,
              useHMR &&
                isDebug &&
                `@ima/hmr-client/dist/imaHmrClient?${new URLSearchParams({
                  port: devServerConfig.port.toString(),
                  hostname: devServerConfig.hostname,
                  publicUrl: devServerConfig.publicUrl,
                }).toString()}`,
              path.join(rootDir, 'app/main.js'),
            ].filter(Boolean) as string[],
            ...createPolyfillEntry(ctx),
          }),
    },
    output: {
      path: outputDir,
      pathinfo: isDevEnv,
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      filename: ({ chunk }) => {
        // Put server-side JS into server directory
        if (isServer) {
          return `server/${chunk?.name === name ? 'app.server' : '[name]'}.js`;
        }

        // Separate client chunks into es and non-es folders
        const baseFolder = `static/${isEsVersion ? 'js.es' : 'js'}`;
        const fileNameParts = [
          chunk?.name === name && isDevEnv && 'app.client',
          chunk?.name === name && !isDevEnv && 'app.bundle',
          chunk?.name !== name && '[name]',
          'js',
        ].filter(Boolean);

        return `${baseFolder}/${fileNameParts.join('.')}`;
      },
      chunkFilename: () =>
        isServer
          ? `server/chunk.[id].js`
          : `static/${isEsVersion ? 'js.es' : 'js'}/chunk.[id].js`,
      cssFilename: ({ chunk }) =>
        `static/css/${chunk?.name === name ? 'app' : '[name]'}.css`,
      cssChunkFilename: `static/css/chunk.[id].css`,
      publicPath: ctx.publicPath ?? imaConfig.publicPath,
      /**
       * We put hot updates into it's own folder
       * otherwise it clutters the build folder.
       */
      hotUpdateChunkFilename: 'static/hot/[id].[fullhash].hot-update.js',
      hotUpdateMainFilename: 'static/hot/[runtime].[fullhash].hot-update.json',
      ...(isServer && { library: { type: 'commonjs2' } }),
    },
    cache: {
      type: 'filesystem',
      version: createCacheKey(ctx, imaConfig),
      store: 'pack',
      buildDependencies: {
        config: [__filename],
        defaultWebpack: ['webpack/lib/'],
        imaConfig: [path.join(rootDir, IMA_CONF_FILENAME)].filter(f =>
          fs.existsSync(f)
        ),
      },
    },
    optimization: {
      minimize: ctx.command === 'build' && !isServer,
      minimizer: [
        new TerserPlugin({
          minify: TerserPlugin.swcMinify,
          terserOptions: {
            ecma: isServer || isEsVersion ? 2020 : 5,
            mangle: {
              // Added for profiling in devtools
              keep_classnames: ctx.profile || isDevEnv,
              keep_fnames: ctx.profile || isDevEnv,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
      ...(!isServer && { runtimeChunk: 'single' }),
      splitChunks: {
        ...(isDevEnv && {
          cacheGroups: {
            // Split vendor chunk in dev for better watch caching
            vendor: {
              // Split only JS files
              test: /[\\/]node_modules[\\/](.*)(js|jsx|ts|tsx)$/,
              name: 'vendors',
              enforce: true,
              chunks: 'all',
            },
          },
        }),
      },
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      mainFields: isServer ? ['main', 'module'] : ['browser', 'module', 'main'],
      alias: {
        // App specific aliases
        app: path.join(rootDir, 'app'),
        // Enable better profiling in react devtools
        ...(ctx.profile && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling',
        }),
        // Ima config overrides
        ...(imaConfig.webpackAliases ?? {}),
      },
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, 'loaders'), 'node_modules'],
    },
    module: {
      rules: [
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
              test: [
                /\.bmp$/,
                /\.gif$/,
                /\.jpe?g$/,
                /\.png$/,
                /\.webp$/,
                /\.svg$/,
              ],
              oneOf: [
                {
                  resourceQuery: /inline/, // foo.png?inline
                  type: 'asset/inline',
                },
                {
                  resourceQuery: /external/, // foo.png?external
                  type: 'asset/resource',
                },
                {
                  type: 'asset',
                  parser: {
                    dataUrlCondition: {
                      maxSize: imaConfig.imageInlineSizeLimit,
                    },
                  },
                },
              ],
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
                  type: 'asset/resource',
                },
                {
                  type: 'asset/source',
                },
              ],
            },
            ...(imaConfig.experiments?.swc
              ? [
                  /**
                   * Run node_modules and app JS through swc
                   */
                  {
                    test: /\.(js|mjs|cjs)$/,
                    exclude: [/\bcore-js\b/, /\bwebpack\/buildin\b/, appDir],
                    use: [
                      !isServer && {
                        loader: require.resolve('swc-loader'),
                        options: {
                          env: {
                            targets,
                            mode: 'usage',
                            coreJs: '3.22.7',
                            bugfixes: true,
                          },
                          module: {
                            type: 'commonjs',
                          },
                          jsc: {
                            parser: {
                              syntax: 'ecmascript',
                            },
                          },
                          sourceMaps: useSourceMaps,
                          inlineSourcesContent: useSourceMaps,
                        },
                      },
                      {
                        // This injects new plugin loader interface into legacy plugins
                        loader: 'ima-legacy-plugin-loader',
                      },
                    ].filter(Boolean),
                  },
                  {
                    test: /\.(js|mjs|jsx|cjs)$/,
                    include: appDir,
                    exclude: /node_modules/,
                    loader: require.resolve('swc-loader'),
                    options: await imaConfig.swc(
                      {
                        env: {
                          targets,
                          mode: 'usage',
                          coreJs: '3.22.7',
                          shippedProposals: true,
                          bugfixes: true,
                        },
                        module: {
                          type: 'es6',
                        },
                        jsc: {
                          parser: {
                            syntax: 'ecmascript',
                            jsx: true,
                          },
                          transform: {
                            react: {
                              runtime: imaConfig.jsxRuntime ?? 'automatic',
                              development: isDevEnv,
                              refresh: useHMR,
                            },
                          },
                        },
                        sourceMaps: useSourceMaps,
                        inlineSourcesContent: useSourceMaps,
                      },
                      ctx
                    ),
                  },
                ]
              : [
                  /**
                   * Process js of app directory with general babel config
                   */
                  {
                    test: /\.(js|mjs|cjs)$/,
                    exclude: [/\bcore-js\b/, /\bwebpack\/buildin\b/, appDir],
                    use: [
                      !isServer && {
                        loader: require.resolve('babel-loader'),
                        options: {
                          sourceType: 'unambiguous',
                          babelrc: false,
                          configFile: false,
                          cacheDirectory: true,
                          cacheCompression: false,
                          compact: !isDevEnv,
                          targets,
                          presets: [
                            [
                              require.resolve('@babel/preset-env'),
                              {
                                bugfixes: true,
                                modules: false,
                                useBuiltIns: 'usage',
                                corejs: { version: '3.22.7' },
                                exclude: ['transform-typeof-symbol'],
                              },
                            ],
                          ],
                          sourceMaps: useSourceMaps,
                          inputSourceMap: useSourceMaps,
                        },
                      },
                      {
                        // This injects new plugin loader interface into legacy plugins
                        loader: 'ima-legacy-plugin-loader',
                      },
                    ].filter(Boolean),
                  },
                  {
                    test: /\.(js|mjs|jsx|cjs)$/,
                    include: appDir,
                    exclude: /node_modules/,
                    loader: require.resolve('babel-loader'),
                    options: await imaConfig.babel(
                      {
                        targets,
                        babelrc: false,
                        configFile: false,
                        cacheDirectory: true,
                        cacheCompression: false,
                        compact: !isDevEnv,
                        presets: [
                          [
                            require.resolve('@babel/preset-react'),
                            {
                              development: isDevEnv,
                              runtime: imaConfig.jsxRuntime ?? 'automatic',
                            },
                          ],
                          [
                            require.resolve('@babel/preset-env'),
                            {
                              bugfixes: true,
                              modules: false,
                              useBuiltIns: 'usage',
                              corejs: { version: '3.22.7', proposals: true },
                              exclude: ['transform-typeof-symbol'],
                            },
                          ],
                        ],
                        plugins: useHMR
                          ? [require.resolve('react-refresh/babel')]
                          : [],
                        sourceMaps: useSourceMaps,
                        inputSourceMap: useSourceMaps,
                      },
                      ctx
                    ),
                  },
                ]),
            /**
             * CSS & LESS loaders, both have the exact same capabilities
             */
            {
              test: /\.less$/,
              sideEffects: true,
              use: await getStyleLoaders(true),
              ...(imaConfig.experiments?.css && { type: 'css' }),
            },
            {
              test: /\.css$/,
              sideEffects: true,
              use: await getStyleLoaders(),
              ...(imaConfig.experiments?.css && { type: 'css' }),
            },
            /**
             * Fallback loader for all modules, that don't match any
             * of the above defined rules. This should be defined last.
             */
            {
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx|cjs)$/, /\.json$/],
              type: 'asset/resource',
            },
          ],
        },
        {
          /**
           * Allow interop import of .mjs modules.
           */
          test: /\.mjs$/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
      ].filter(Boolean) as RuleSetRule[],
    },
    plugins: [
      /**
       * Initialize webpack.ProgressPlugin to track and report compilation
       * progress across all configuration contexts. For verbose mode, we are using
       * the default implementation.
       */
      ctx.verbose ? new webpack.ProgressPlugin() : createProgress(name),

      // Server/client specific plugins are defined below
      ...(isServer
        ? // Server-specific plugins
          []
        : // Client-specific plugins
          [
            // This needs to run for both client bundles
            new GenerateRunnerPlugin({
              context: ctx,
            }),

            processCss &&
              new MiniCssExtractPlugin({
                filename: ({ chunk }) =>
                  `static/css/${chunk?.name === name ? 'app' : '[name]'}.css`,
                ignoreOrder: true,
                chunkFilename: `static/css/[id].css`,
              }),

            // Copies essential assets to static directory
            isEsVersion &&
              new CopyPlugin({
                patterns: [
                  { from: 'app/public', to: 'static/public' },
                  ...extractLanguages(imaConfig),
                ],
              }),

            // Enables compression for assets in production build
            ...(ctx.command === 'build'
              ? imaConfig.compression.map(
                  algorithm =>
                    new CompressionPlugin({
                      algorithm,
                      filename: `[path][base].${
                        algorithm === 'brotliCompress' ? 'br' : 'gz'
                      }`,
                      test: /\.(js|css|svg)$/,
                      compressionOptions: {
                        level: 9,
                      },
                      threshold: 0,
                      minRatio: 0.95,
                    })
                )
              : []),

            // Following plugins enable react refresh and hmr in watch mode
            useHMR && new webpack.HotModuleReplacementPlugin(),
            useHMR &&
              new ReactRefreshWebpackPlugin({
                overlay: {
                  module: '@ima/hmr-client',
                  sockIntegration: 'whm',
                },
              }),
          ]),
    ].filter(Boolean) as WebpackPluginInstance[],

    // Enable node preset for externals on server
    externalsPresets: {
      node: isServer,
    },

    // Turn webpack performance reports off since we print reports ourselves
    performance: false,

    // Disable infrastructure logging in normal mode
    infrastructureLogging: {
      level: ctx.verbose ? 'info' : 'none',
    },

    // Enable native css support (this replaces mini-css-extract-plugin and css-loader)
    experiments: {
      css: !!imaConfig.experiments?.css,
    },
  };
};
