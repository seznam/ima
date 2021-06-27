const { handlerFactory, createWebpackConfig } = require('../lib/cliUtils');
const { watchCompiler, handleCompilationError } = require('../lib/compiler');
const sharedArgs = require('./lib/sharedArgs');

async function dev({ options, imaConf }) {
  try {
    const config = await createWebpackConfig({
      options: {
        ...options,
        isProduction: false,
        isWatch: true
      },
      imaConf
    });

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
