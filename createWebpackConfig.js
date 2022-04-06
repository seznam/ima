const fs = require('fs');
const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function createWebpackConfig(callback, { useStyleLoader = false } = {}) {
  const rootDir = process.cwd();
  const ctx = {
    rootDir,
    isProduction: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
    outDir: path.join(rootDir, './dist'),
  };

  const config = {
    target: ['web', 'es11'],
    mode: ctx.isProduction ? 'production' : 'development',
    stats: 'minimal',
    output: {
      path: ctx.outDir,
      filename: 'js/[name].js',
      assetModuleFilename: 'media/[name].[hash][ext]',
    },
    cache: {
      type: 'filesystem',
      store: 'pack',
    },
    devtool: ctx.isProduction ? 'source-map' : 'eval-cheap-source-map',
    watchOptions: {
      ignored: /node_modules/,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: require.resolve('ts-loader'),
          exclude: /node_modules/,
        },
        {
          test: /\.(js|mjs|jsx|cjs)$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            targets: { chrome: '80', safari: '14' }, // es11
            babelrc: false,
            configFile: false,
            cacheDirectory: true,
            cacheCompression: false,
            compact: !ctx.isProduction,
            presets: [
              [
                require.resolve('@babel/preset-react'),
                {
                  development: !ctx.isProduction,
                  runtime: 'automatic',
                },
              ],
              [
                require.resolve('@babel/preset-env'),
                {
                  bugfixes: true,
                  modules: false,
                  useBuiltIns: 'usage',
                  corejs: { version: '3.21', proposals: true },
                  exclude: ['transform-typeof-symbol'],
                },
              ],
            ],
            sourceMaps: !ctx.isProduction,
            inputSourceMap: !ctx.isProduction,
          },
        },
        {
          test: /\.(le|c)ss$/,
          sideEffects: true,
          use: [
            useStyleLoader
              ? {
                  loader: require.resolve('style-loader'),
                  options: {
                    injectType: 'lazyStyleTag',
                    // Allows custom insert using `styles.use({ target: this.shadowRoot })`;
                    insert: (element, options) => {
                      const parent = options.target || document.head;

                      parent.appendChild(element);
                    },
                  },
                }
              : { loader: MiniCssExtractPlugin.loader },
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: {
                  localIdentName: `[path][name]__[local]--[hash:base64:5]`,
                },
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      'postcss-preset-env',
                      {
                        browsers:
                          'last 2 versions, last 1 year, not safari 12.1',
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
              },
            },
            require.resolve('less-loader'),
          ],
        },
        {
          test: /\.mjs$/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          type: 'asset/resource',
        },
      ],
    },
    optimization: {
      minimize: ctx.isProduction,
      minimizer: ['...', new CssMinimizerPlugin()],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.mjs', '.cjs'],
      fallback: {
        fs: false,
        path: false,
      },
      alias: {
        '@': path.join(ctx.rootDir, 'src'),
      },
    },
    plugins: [
      !useStyleLoader &&
        new MiniCssExtractPlugin({
          filename: 'css/[name].css',
        }),
    ].filter(Boolean),
  };

  // Clean build directory in production
  if (ctx.isProduction) {
    fs.rmSync(ctx.outDir, { recursive: true, force: true });
  }

  return callback(config, ctx);
}

module.exports = { createWebpackConfig };
