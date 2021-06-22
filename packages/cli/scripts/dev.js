const webpack = require('webpack');

const {
  statsFormattedOutput,
  handlerFactory,
  builderFactory,
  createWebpackConfig
} = require('../lib/cliUtils');

async function dev(args) {
  const config = await createWebpackConfig({
    ...args,
    isProduction: false,
    isWatch: true
  });

  const compiler = webpack(config);
  compiler.watch({}, statsFormattedOutput);
}

const devCommand = {
  command: 'dev',
  desc: 'Run application in development watch mode',
  builder: builderFactory({
    open: {
      alias: 'o',
      desc: 'Opens browser window after server has been started',
      type: 'boolean',
      default: true
    },
    amp: {
      desc: 'Builds separate CSS files for use in AMP mode',
      type: 'boolean',
      default: false
    }
  }),
  handler: handlerFactory(dev)
};

module.exports = devCommand;
