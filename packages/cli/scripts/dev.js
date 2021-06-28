const { handlerFactory, createWebpackConfig } = require('../lib/cliUtils');
const { watchCompiler, handleCompilationError } = require('../lib/compiler');
const { info } = require('../lib/print');
const { SharedArgs } = require('../constants');

async function dev({ options, imaConf }) {
  try {
    info('Parsing webpack configuration file...');
    const config = await createWebpackConfig({
      options: {
        ...options,
        isProduction: false,
        isWatch: true
      },
      imaConf
    });

    info('Starting webpack compiler...');
    await watchCompiler(config, options.verbose);
  } catch (err) {
    console.log(err);
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
