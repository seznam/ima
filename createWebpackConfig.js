const fs = require('fs');
const path = require('path');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function createWebpackConfig(callback) {
  const rootDir = process.cwd();
  const ctx = {
    rootDir,
    isProduction: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
    outDir: path.join(rootDir, './dist'),
  };

  const config = {
    target: ['web', 'es2024'],
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
    devtool: ctx.isProduction ? 'source-map' : 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?|mjs|cjs)$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            sourceType: 'unambiguous',
            targets: {
              chrome: '80',
              edge: '80',
              firefox: '80',
              opera: '67',
              safari: '14',
              ios: '14',
            }, // es11
            babelrc: false,
            configFile: false,
            cacheDirectory: true,
            cacheCompression: false,
            compact: !ctx.isProduction,
            presets: [
              require.resolve('@babel/preset-typescript'),
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
                  corejs: { version: '3.21' },
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
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: {
                  auto: true,
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
      minimize: false,
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
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
      }),
    ],
  };

  // Clean build directory in production
  if (ctx.isProduction) {
    fs.rmSync(ctx.outDir, { recursive: true, force: true });
  }

  return callback(config, ctx);
}

module.exports = { createWebpackConfig };
