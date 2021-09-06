const { handlerFactory, createWebpackConfig } = require('../lib/cliUtils');
const { watchCompiler, handleCompilationError } = require('../lib/compiler');
const { info } = require('../lib/print');
const { SharedArgs } = require('./lib/SharedArgs');

async function dev(args: DevCliArgs) {
  try {
    info('Parsing webpack configuration file...');
    const config = await createWebpackConfig(['client', 'server'], {
      ...args,
      isProduction: false,
      isWatch: true
    });

    info('Starting webpack compiler...');
    await watchCompiler(config, args);
  } catch (err) {
    handleCompilationError(err);
  }
}

const devCommand = {
  command: 'dev',
  desc: 'Run application in development watch mode',
  builder: {
    ...SharedArgs,
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
