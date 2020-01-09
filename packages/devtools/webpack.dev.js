const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common');

module.exports = merge.smartStrategy({ 'module.rules.use': 'prepend' })(
  common,
  {
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.(le|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: true
              }
            }
          ]
        }
      ]
    }
  }
);
