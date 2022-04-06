const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const generate = require('generate-file-webpack-plugin');
const { merge } = require('webpack-merge');

const { createWebpackConfig } = require('../../createWebpackConfig');

module.exports = createWebpackConfig((config, { rootDir }) =>
  merge(config, {
    entry: {
      options: './src/options.js',
      popup: './src/popup.js',
      contentScript: './src/contentScript.js',
      background: './src/background.js',
      devtools: './src/devtools.js',
      panel: './src/panel.js',
    },
    plugins: [
      generate({
        file: 'manifest.json',
        content: () => {
          const { version } = require('./package');
          const manifest = require('./src/manifest');
          manifest.version = version;

          return JSON.stringify(manifest, null, '  ');
        },
      }),
      new CopyPlugin({
        patterns: [{ from: path.join(rootDir, 'src/public') }],
      }),
    ],
  })
);
