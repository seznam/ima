const path = require('path');
const childProcess = require('child_process');
const webpack = require('webpack');

const { statsFormattedOutput } = require('../build/output');
const serverConfig = require('../build/webpack/config/server');
const clientConfig = require('../build/webpack/config/client');

async function dev(args) {
  let serverStarted = false;
  const compiler = webpack([serverConfig(args), clientConfig(args)]);

  compiler.watch({}, statsFormattedOutput);

  // This is total mess, only for current testing
  setTimeout(() => {
    if (!serverStarted) {
      childProcess.fork(path.resolve(args.cwd, './build/server'));
      serverStarted = true;
    }
  }, 5000);
}

const devCommand = {
  command: 'dev',
  desc: 'Run application in development mode',
  builder: {
    'legacy-compat-mode': {
      desc: 'Runs application in ES5 compatible format'
    }
  },
  handler: async yargs => {
    await dev({
      yargs: yargs,
      cwd: process.cwd()
    });
  }
};

module.exports = devCommand;
