const merge = require('webpack-merge');
const common = require('./webpack.common');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const pkg = require('./package.json');

module.exports = merge.smartStrategy({ 'module.rules.use': 'prepend' })(
  common,
  {
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.(le|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            }
          ]
        }
      ]
    },
    optimization: {
      minimize: true
    },
    plugins: [
      new CleanWebpackPlugin(),
      new ZipPlugin({
        filename: `ima.devtools.${pkg.version}.zip`
      })
    ]
  }
);
