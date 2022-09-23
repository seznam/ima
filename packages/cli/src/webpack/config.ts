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
  createDevServerConfig,
  getCurrentCoreJsVersion,
  getLocaleEntryPoints,
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
  const useSourceMaps = !!imaConfig.sourceMaps || isDevEnv;
  const imaEnvironment = resolveEnvironment(rootDir);
  const isDebug = imaEnvironment.$Debug;
  const outputDir = path.join(rootDir, 'build');
  const appDir = path.join(rootDir, 'app');
  const useHMR = ctx.command === 'dev' && isEsVersion;
  const devServerConfig = createDevServerConfig({ imaConfig, ctx });
  const mode = isDevEnv ? 'development' : 'production';

  // Define browserslist targets for current context
  let targets: Record<string, string> | string[];
  const coreJsVersion = await getCurrentCoreJsVersion();

  if (isEsVersion) {
    // es2022 targets (taken from 'browserslist-generator')
    targets = [
      'and_chr >= 91',
      'chrome >= 91',
      'and_ff >= 90',
      'android >= 103',
      'edge >= 91',
      'samsung >= 16.0',
      'safari >= 15',
      'ios_saf >= 15.1',
      'opera >= 77',
      'firefox >= 90',
    ];
  } else if (isServer) {
    targets = { node: '18' };
  } else {
    // es2018 targets
    targets = [
      'and_chr >= 63',
      'chrome >= 63',
      'and_ff >= 58',
      'android >= 103',
      'edge >= 79',
      'samsung >= 8.2',
      'safari >= 11.1',
      'ios_saf >= 11.4',
      'opera >= 50',
      'firefox >= 58',
    ];
  }

  // Set correct devtool source maps config
  const devtool = useSourceMaps
    ? typeof imaConfig.sourceMaps === 'string'
      ? imaConfig.sourceMaps
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
                    browsers: '>0.5%, not dead, not op_mini all, not ie 11',
                    autoprefixer: {
                      flexbox: 'no-2009',
                      grid: 'autoplace',
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
      ? ['web', 'es2022']
      : ['web', 'es2018'],
    mode,
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
      ...getLocaleEntryPoints(imaConfig),
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
      name: `${name}-${mode}-${createCacheKey(ctx, imaConfig)}`,
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
            ecma: isServer || isEsVersion ? 2020 : 2018,
            mangle: {
              // Added for profiling in devtools
              keep_classnames: ctx.profile || isDevEnv,
              keep_fnames: ctx.profile || isDevEnv,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
      moduleIds: 'named',
      chunkIds: 'named',
      ...(!isServer && { runtimeChunk: 'single' }),
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /node_modules/,
            name: 'vendors',
            enforce: isDevEnv,
            chunks: isDevEnv ? 'initial' : 'async',
            reuseExistingChunk: true,
          },
          default: {
            chunks: 'async',
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
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
                      coreJs: coreJsVersion,
                      bugfixes: true,
                      dynamicImport: true,
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
                    coreJs: coreJsVersion,
                    shippedProposals: true,
                    bugfixes: true,
                    dynamicImport: true,
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
                        useBuiltins: true,
                      },
                    },
                  },
                  sourceMaps: useSourceMaps,
                  inlineSourcesContent: useSourceMaps,
                },
                ctx
              ),
            },
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
           * Allows the use of // @if | @else | @elseif | @endif directives
           * on client server, ctx === 'client'|'client.es'|'server' variables
           * to conditionally exclude parts of the source code for concrete bundles.
           */
          test: /\.(js|mjs|jsx|cjs|ts|tsx)$/,
          loader: 'preprocess-loader',
          include: appDir,
          options: {
            context: {
              server: isServer,
              client: !isServer,
              ctx: ctx.name,
            },
          },
        },
        {
          /**
           * Allow interop import of .mjs modules.
           */
          test: /\.m?js$/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /virtualImaLocale\.json$/,
          type: 'javascript/auto',
          loader: 'locale-loader',
          options: {
            imaConfig,
            rootDir,
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
      !ctx.verbose && createProgress(name),

      // Server/client specific plugins are defined below
      ...(isServer
        ? // Server-specific plugins
          []
        : // Client-specific plugins
          [
            // This needs to run for both client bundles
            new GenerateRunnerPlugin({
              context: ctx,
              imaConfig,
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
                patterns: [{ from: 'app/public', to: 'static/public' }],
              }),

            // Enables compression for assets in production build
            ...(ctx.command === 'build' && imaConfig.compress
              ? ['brotliCompress', 'gzip'].map(
                  algorithm =>
                    new CompressionPlugin({
                      algorithm,
                      filename: `[path][base].${
                        algorithm === 'brotliCompress' ? 'br' : 'gz'
                      }`,
                      test: /\.(js|css|svg)$/,
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
      colors: true,
      appendOnly: true,
      level: ctx.verbose ? 'log' : 'none',
    },

    // Enable native css support (this replaces mini-css-extract-plugin and css-loader)
    experiments: {
      css: !!imaConfig.experiments?.css,
    },
  };
};
