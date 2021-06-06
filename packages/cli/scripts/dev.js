const path = require('path');
const childProcess = require('child_process');
const webpack = require('webpack');

const webpackConfig = require('../build/webpack/config');
const {
  statsFormattedOutput,
  handlerFactory,
  builderFactory
} = require('../build/utils');

async function dev(args) {
  let serverStarted = false;

  const config = [
    await webpackConfig({
      ...args,
      isServer: true
    }),
    await webpackConfig({
      ...args,
      isServer: false
    })
  ];

  const compiler = webpack(config);
  compiler.watch({}, statsFormattedOutput);

  // This is total mess, only for current testing
  setTimeout(() => {
    if (!serverStarted) {
      childProcess.fork(path.resolve(args.rootDir, './build/server'));
      serverStarted = true;
    }
  }, 5000);
}

const devCommand = {
  command: 'dev',
  desc: 'Run application in development mode',
  builder: builderFactory({
    'legacy-compat-mode': {
      desc: 'Runs application in ES5 compatible format'
    }
  }),
  handler: handlerFactory(dev)
};

module.exports = devCommand;
