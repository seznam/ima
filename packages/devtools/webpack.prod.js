const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(
  {
    optimization: {
      minimize: true,
    },
    plugins: [new CleanWebpackPlugin()],
  },
  common
);
