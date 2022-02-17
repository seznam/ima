import fs from 'fs';
import path from 'path';
import { URLSearchParams } from 'url';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import miniSVGDataURI from 'mini-svg-data-uri';
import TerserPlugin from 'terser-webpack-plugin';
import webpack, {
  Configuration,
  RuleSetRule,
  RuleSetUseItem,
  WebpackPluginInstance,
} from 'webpack';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

import { ImaConfigurationContext, ImaConfig } from '../types';
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
  const { rootDir, isServer, isEsVersion, name, environment, processCss } = ctx;

  // Define helper variables derived from context
  const isDevEnv = environment === 'development';
  const useSourceMaps = imaConfig.useSourceMaps || isDevEnv;
  const imaEnvironment = resolveEnvironment(rootDir);
  const isDebug = imaEnvironment.$Debug;
  const outputDir = path.join(rootDir, 'build');
  const publicPath = ctx.publicPath ?? imaConfig.publicPath;
  const appDir = path.join(rootDir, 'app');
  const useHMR =
    ctx.command === 'dev' && !isServer && (isEsVersion || ctx.forceSPAWithHMR);
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
    targets = { node: '16' };
  }

  /**
   * Style loaders helper function used to define
   * common style loader functions, that is later used
   * to handle css and less source files.
   */
  const getStyleLoaders = async ({
    useLessLoader = false,
  }: {
    useLessLoader?: boolean;
  } = {}): Promise<RuleSetUseItem[]> => {
    /**
     * Ignore CSS and LESS modules when CSS modules are disabled and we would
     * need to generate the CSS module definitions. This is not needed for other
     * CSS files so we can ignore it and improve a performance a little bit.
     * see https://webpack.js.org/configuration/resolve/#resolvealias for more.
     */
    if (!processCss && !imaConfig.cssModules) {
      return [{ loader: 'null-loader' }];
    }

    return [
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
          sourceMap: false, // BROKEN ON LATEST VERSIONS
        },
      },
      processCss && {
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
          lessOptions: {
            strictMath: true,
          },
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
    target: isServer
      ? 'node16'
      : isEsVersion
      ? ['web', 'es11']
      : ['web', 'es5'],
    mode: isDevEnv ? 'development' : 'production',
    devtool: useHMR
      ? 'cheap-module-source-map' // Needed for proper source maps parsing in error-overlay
      : useSourceMaps
      ? 'source-map'
      : false,
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
                  path: `http://${devServerConfig.public}/__webpack_hmr`,
                  timeout: '15000',
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
                  public: devServerConfig.public,
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
          !isDevEnv && 'min',
          'js',
        ].filter(Boolean);

        return `${baseFolder}/${fileNameParts.join('.')}`;
      },
      publicPath,
      /**
       * We put hot updates into it's own folder
       * otherwise it clutters the built folder.
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
      minimize: !isDevEnv && !isServer,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: ctx.profile,
            keep_fnames: ctx.profile,
          },
        }),
        new CssMinimizerPlugin(),
      ],
      // Split chunks in dev for better caching
      ...(isDevEnv
        ? {
            moduleIds: 'named',
            chunkIds: 'named',
            splitChunks: {
              cacheGroups: {
                vendor: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendors',
                  chunks: 'all',
                },
              },
            },
          }
        : {}),
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      alias: {
        // App specific aliases
        app: path.join(rootDir, 'app'),
        '@ima/core': `@ima/core/dist/ima.${
          isServer ? 'server.cjs.js' : 'client.esm.js'
        }`,
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
        /**
         * Extract source maps for node_module packages.
         */
        useSourceMaps && {
          enforce: 'pre',
          test: /\.(js|mjs|jsx|ts|tsx|cjs|css|less)$/,
          use: require.resolve('source-map-loader'),
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
                          miniSVGDataURI(content.toString()),
                      },
                    },
                    {
                      type: 'asset/resource',
                    },
                  ],
                },
                {
                  loader: require.resolve('svgo-loader'),
                  options: {
                    js2svg: {
                      indent: 2,
                      pretty: isDevEnv,
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
             * Process js of app directory with general babel config
             */
            {
              test: /\.(js|mjs|cjs)$/,
              exclude: [/\bcore-js\b/, /\bwebpack\/buildin\b/, appDir],
              use: [
                {
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
                          corejs: { version: '3.20' },
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
              ],
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
                        corejs: { version: '3.20', proposals: true },
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
            {
              test: /\.less$/,
              sideEffects: true,
              use: await getStyleLoaders({ useLessLoader: true }),
            },
            /**
             * CSS loader configuration, has the same capabilities as the less loader.
             */
            {
              test: /\.css$/,
              sideEffects: true,
              use: await getStyleLoaders(),
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
      ].filter(Boolean) as RuleSetRule[],
    },
    plugins: [
      /**
       * Initialize webpack.ProgressPlugin to track and report compilation
       * progress across all configuration contexts. For verbose mode, we are using
       * the default implementation.
       */
      ctx.verbose
        ? new webpack.ProgressPlugin({
            // handler: (percentage, msg, ...args) => {
            //   console.log(
            //     chalk.cyan(`${(percentage * 100).toFixed(2)}%`),
            //     chalk.green.bold(msg),
            //     ...args
            //   );
            // },
          })
        : createProgress(name),

      // Server/client specific plugins are defined below
      ...(isServer
        ? // Server-specific plugins
          [
            // Copies essential assets to static directory
            new CopyPlugin({
              patterns: [
                { from: 'app/public', to: 'static/public' },
                ...extractLanguages(imaConfig),
              ],
            }),
          ]
        : // Client-specific plugins
          [
            // Removes generated empty script caused by non-js entry points
            new RemoveEmptyScriptsPlugin(),

            /**
             * Handles LESS/CSS extraction out of JS to separate css file.
             * We use MiniCssExtractPlugin.loader only in es bundle.
             */
            processCss &&
              new MiniCssExtractPlugin({
                filename: ({ chunk }) =>
                  `static/css/${chunk?.name === name ? 'app' : '[name]'}${
                    !isDevEnv ? '.min' : ''
                  }.css`,
                ignoreOrder: true,
                chunkFilename: `static/css/chunk-[id]${
                  !isDevEnv ? '.min' : ''
                }.css`,
              }),

            // Enables compression for assets in production build
            ...(!isDevEnv
              ? imaConfig.compression.map(
                  algorithm =>
                    new CompressionPlugin({
                      algorithm,
                      filename: `[path][base].${
                        algorithm === 'brotliCompress' ? 'br' : 'gz'
                      }`,
                      test: /\.(js|css|html|svg)$/,
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
                  module: '@ima/hmr-client/dist/fastRefreshClient',
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
  };
};
