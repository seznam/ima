import fs from 'fs';
import path from 'path';

import { formatError, ParsedErrorData } from '@ima/dev-utils/cliUtils';
import { logger } from '@ima/dev-utils/logger';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { ParserConfig } from '@swc/core';
import CompressionPlugin from 'compression-webpack-plugin';
// eslint-disable-next-line import/default
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import lessPluginGlob from 'less-plugin-glob';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack, {
  Configuration,
  RuleSetRule,
  RuleSetUseItem,
  WebpackPluginInstance,
} from 'webpack';

import { getLanguageEntryPoints } from './languages';
import { GenerateRunnerPlugin } from './plugins/GenerateRunnerPlugin';
import { ManifestPlugin } from './plugins/ManifestPlugin';
import { createProgress } from './plugins/ProgressPlugin';
import {
  resolveEnvironment,
  createCacheKey,
  IMA_CONF_FILENAME,
  createPolyfillEntry,
  createDevServerConfig,
  getCurrentCoreJsVersion,
} from './utils';
import { ImaConfigurationContext, ImaConfig } from '../types';

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
  const useTypescript = fs.existsSync(path.join(rootDir, './tsconfig.json'));
  const isDevEnv = ctx.environment === 'development';
  const useSourceMaps = !!imaConfig.sourceMaps || isDevEnv;
  const imaEnvironment = resolveEnvironment(rootDir);
  const isDebug = imaEnvironment.$Debug;
  const outputDir = path.join(rootDir, 'build');
  const appDir = path.join(rootDir, 'app');
  const useHMR = ctx.command === 'dev' && isEsVersion;
  const devServerConfig = createDevServerConfig({ imaConfig, ctx });
  const mode = ctx.environment === 'production' ? 'production' : 'development';
  const lessGlobalsPath = path.join(rootDir, 'app/less/globals.less');

  // Bundle entries
  const publicPathEntry = path.join(__dirname, './entries/publicPathEntry');
  const appMainEntry = path.join(rootDir, 'app/main.js');

  // Define browserslist targets for current context
  const coreJsVersion = await getCurrentCoreJsVersion();

  // es2018 targets (taken from 'browserslist-generator')
  const targets = [
    'and_chr >= 66',
    'chrome >= 66',
    'and_ff >= 58',
    'android >= 103',
    'edge >= 79',
    'samsung >= 9.2',
    'safari >= 11.1',
    'ios_saf >= 11.4',
    'opera >= 53',
    'firefox >= 58',
  ];

  // Set correct devtool source maps config
  const devtool = useSourceMaps
    ? typeof imaConfig.sourceMaps === 'string'
      ? imaConfig.sourceMaps
      : 'source-map'
    : false;

  /**
   * Generates SWC loader for js and ts files
   */
  const getSwcLoader = async (syntax?: ParserConfig['syntax']) => {
    return imaConfig.swc(
      {
        // We use core-js only for lower ES version build
        ...(ctx.name === 'client' && {
          env: {
            targets,
            mode: 'usage',
            coreJs: coreJsVersion,
            bugfixes: true,
            dynamicImport: true,
          },
        }),
        isModule: true,
        module: {
          type: 'es6',
        },
        jsc: {
          target: ctx.name === 'client' ? 'es2018' : 'es2022',
          parser: {
            syntax: syntax ?? 'ecmascript',
            decorators: false,
            dynamicImport: true,
            [syntax === 'typescript' ? 'tsx' : 'jsx']: true,
          },
          transform: {
            react: {
              runtime: imaConfig.jsxRuntime ?? 'automatic',
              refresh: useHMR && ctx.reactRefresh,
              useBuiltins: true,
            },
          },
        },
        sourceMaps: useSourceMaps,
        inlineSourcesContent: useSourceMaps,
      },
      ctx
    );
  };

  /**
   * CSS loaders function generator. Contains postcss-loader
   * and optional less loaders.
   */
  const getStyleLoaders = async (
    useCssModules = false
  ): Promise<RuleSetUseItem[]> => {
    /**
     * Return null-loader in contexts that don't process styles while
     * not using css-modules, since we don't need to compile the styles at all.
     * This improves build performance significantly in applications with
     * large amounts of style files.
     */
    if (!useCssModules && !processCss) {
      return [{ loader: 'null-loader' }];
    }

    return [
      ...(!imaConfig.experiments?.css
        ? [
            processCss && {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                ...(useCssModules && {
                  modules: {
                    exportOnlyLocals: !processCss,
                    localIdentName: isDevEnv
                      ? '[path][name]__[local]--[hash:base64:5]'
                      : '[hash:base64]',
                  },
                }),
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
      {
        loader: require.resolve('less-loader'),
        options: {
          webpackImporter: false,
          sourceMap: useSourceMaps,
          implementation: require('less'),
          additionalData: fs.existsSync(lessGlobalsPath)
            ? `@import "${lessGlobalsPath}";\n\n`
            : '',
          lessOptions: {
            plugins: [lessPluginGlob],
            paths: [
              path.resolve(rootDir),
              path.resolve(rootDir, 'node_modules'),
            ],
          },
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
            server: [publicPathEntry, appMainEntry],
          }
        : {
            [name]: [
              publicPathEntry,
              useHMR &&
                isDebug &&
                `${require.resolve('@ima/hmr-client')}?${new URLSearchParams({
                  name,
                  noInfo: 'false',
                  reload: 'true',
                  timeout: '3000',
                  reactRefresh: ctx.reactRefresh ? 'true' : 'false',
                  port: devServerConfig.port.toString(),
                  hostname: devServerConfig.hostname,
                  publicUrl: devServerConfig.publicUrl,
                }).toString()}`,
              appMainEntry,
            ].filter(Boolean) as string[],
            ...createPolyfillEntry(ctx),
          }),
      ...getLanguageEntryPoints(imaConfig.languages, rootDir, useHMR),
    },
    output: {
      path: outputDir,
      pathinfo: isDevEnv,
      hashFunction: 'xxhash64',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      filename: ({ chunk }) => {
        // Put server-side JS into server directory
        if (isServer) {
          return `server/${
            chunk?.name === name ? 'app.server' : '[name]'
          }.[contenthash].js`;
        }

        // Separate client chunks into es and non-es folders
        const baseFolder = `static/${isEsVersion ? 'js.es' : 'js'}`;
        const fileNameParts = [
          chunk?.name === name && isDevEnv && 'app.client',
          chunk?.name === name && !isDevEnv && 'app.bundle',
          chunk?.name !== name && '[name]',
          '[contenthash]',
          'js',
        ].filter(Boolean);

        return `${baseFolder}/${fileNameParts.join('.')}`;
      },
      chunkFilename: () =>
        isServer
          ? `server/chunk.[id].[contenthash].js`
          : `static/${
              isEsVersion ? 'js.es' : 'js'
            }/chunk.[id].[contenthash].js`,
      cssFilename: ({ chunk }) =>
        `static/css/${
          chunk?.name === name ? 'app' : '[name]'
        }.[contenthash].css`,
      cssChunkFilename: `static/css/chunk.[id].[contenthash].css`,
      publicPath: imaConfig.publicPath,
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
      name: `${name}-${ctx.command}-${mode}`,
      version: createCacheKey(ctx, imaConfig, {
        ...devServerConfig,
        $Debug: isDebug,
        coreJsVersion: 'core-js',
        devtool,
      }),
      store: 'pack',
      hashAlgorithm: 'xxhash64',
      memoryCacheUnaffected: true,
      buildDependencies: {
        imaCli: [require.resolve('@ima/cli')],
        imaConfig: [path.join(rootDir, IMA_CONF_FILENAME)],
        defaultConfig: [__filename],
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
            test: /[\\/]node_modules[\\/](.(?!.*\.(less|css)$))*$/,
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
      extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'],
      mainFields: isServer ? ['module', 'main'] : ['browser', 'module', 'main'],
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
             * Handle app JS files
             */
            {
              test: /\.(mjs|js|jsx)$/,
              include: appDir,
              loader: require.resolve('swc-loader'),
              options: await getSwcLoader('ecmascript'),
            },
            /**
             * Handle app Typescript files
             */
            useTypescript && {
              test: /\.(ts|tsx)$/,
              include: appDir,
              loader: require.resolve('swc-loader'),
              options: await getSwcLoader('typescript'),
            },
            /**
             * Run vendor paths through swc for lower client versions
             */
            ctx.name === 'client' && {
              test: /\.(js|mjs|cjs)$/,
              include: [
                /@ima/,
                ...(imaConfig.transformVendorPaths?.include ?? []),
              ],
              exclude: [
                appDir,
                ...(imaConfig.transformVendorPaths?.exclude ?? []),
              ],
              loader: require.resolve('swc-loader'),
              options: await imaConfig.swcVendor(
                {
                  env: {
                    targets,
                    mode: 'usage',
                    coreJs: coreJsVersion,
                    bugfixes: true,
                    dynamicImport: true,
                  },
                  module: {
                    type: 'es6',
                  },
                  jsc: {
                    target: 'es2018',
                    parser: {
                      syntax: 'ecmascript',
                      decorators: false,
                      dynamicImport: true,
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
              test: /\.module\.(c|le)ss$/,
              sideEffects: true,
              use: await getStyleLoaders(true),
              ...(imaConfig.experiments?.css && { type: 'css' }),
            },
            {
              test: /\.(c|le)ss$/,
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
          ].filter(Boolean),
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
        /**
         * Extracts source maps from existing source files (from their sourceMappingURL),
         * this is usefull mainly for node_modules.
         */
        useSourceMaps && {
          enforce: 'pre',
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve('source-map-loader'),
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
                  `static/css/${chunk?.name === name ? 'app' : '[name]'}${
                    ctx.command === 'dev' ? '' : '.[contenthash]'
                  }.css`,
                ignoreOrder: true,
                chunkFilename: `static/css/[id].[contenthash].css`,
              }),

            // Copies essential assets to static directory
            isEsVersion &&
              new CopyPlugin({
                patterns: [
                  {
                    from: 'app/public',
                    to: 'static/public',
                    noErrorOnMissing: true,
                  },
                ],
              }),

            /**
             * TS type checking plugin (since swc doesn't do type checking, we want
             * to show errors at least during build so it fails before going to production.
             */
            isEsVersion &&
              useTypescript &&
              new ForkTsCheckerWebpackPlugin({
                async: ctx.command === 'dev', // be async only in watch mode,
                devServer: false,
                // Custom formatter for async mode
                ...(ctx.command === 'dev' && {
                  formatter: issue => {
                    return JSON.stringify({
                      fileUri: issue.file,
                      line: issue.location?.start.line,
                      column: issue.location?.start.column,
                      name: issue.code,
                      message: issue.message,
                    });
                  },
                  logger: {
                    error: async (message: string) => {
                      try {
                        logger.error(
                          await formatError(
                            JSON.parse(
                              message.split('\n')[1]
                            ) as ParsedErrorData,
                            ctx.rootDir
                          )
                        );
                      } catch {
                        // Fallback to original message
                        console.error(message);
                      }
                    },
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    log: () => {},
                  },
                }),
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
              ctx.reactRefresh &&
              new ReactRefreshWebpackPlugin({
                esModule: true,
                overlay: false,
                include: [/\.(jsx|tsx)$/],
                exclude: [/node_modules/],
              }),
          ]),

      // Generate assets manifest from all compilation instances
      new ManifestPlugin({ context: ctx, imaConfig }),
    ].filter(Boolean) as WebpackPluginInstance[],

    // Enable node preset for externals on server
    externalsPresets: {
      node: isServer,
    },

    // Server will use externals from node modules
    ...(isServer && {
      externals: {
        react: 'react',
        'react-dom': 'react-dom',
        'react-dom/client': 'react-dom/client',
        'react-dom/server': 'react-dom/server',
      },
    }),

    // Turn webpack performance reports off since we print reports ourselves
    performance: false,

    // Disable infrastructure logging in normal mode
    infrastructureLogging: {
      colors: true,
      appendOnly: true,
      level: ctx.verbose ? 'log' : 'error',
    },

    // Enable native css support (this replaces mini-css-extract-plugin and css-loader)
    experiments: {
      css: !!imaConfig.experiments?.css,
    },
  };
};
