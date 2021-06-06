const webpack = require('webpack');

const webpackConfig = require('../build/webpack/config');
const {
  statsFormattedOutput,
  handlerFactory,
  builderFactory
} = require('../build/utils');

async function dev(args) {
  const config = [
    await webpackConfig({
      ...args,
      isServer: true,
      isWatch: true
    }),
    await webpackConfig({
      ...args,
      isServer: false,
      isWatch: true
    })
  ];

  const compiler = webpack(config);
  compiler.watch({}, statsFormattedOutput);
}

const devCommand = {
  command: 'dev',
  desc: 'Run application in development watch mode',
  builder: builderFactory({
    'legacy-compat-mode': {
      desc: 'Runs application in ES5 compatible format'
    }
  }),
  handler: handlerFactory(dev)
};

module.exports = devCommand;
