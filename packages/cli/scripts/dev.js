const webpack = require('webpack');

const {
  statsFormattedOutput,
  handlerFactory,
  createWebpackConfig
} = require('../lib/cliUtils');
const sharedArgs = require('./lib/sharedArgs');

async function dev({ options, imaConf }) {
  const config = await createWebpackConfig({
    options: {
      ...options,
      isProduction: false,
      isWatch: true
    },
    imaConf
  });

  const compiler = webpack(config);
  compiler.watch({}, statsFormattedOutput);
}

const devCommand = {
  command: 'dev',
  desc: 'Run application in development watch mode',
  builder: {
    ...sharedArgs,
    open: {
      alias: 'o',
      desc: 'Opens browser window after server has been started',
      type: 'boolean',
      default: true
    }
  },
  handler: handlerFactory(dev)
};

module.exports = devCommand;
