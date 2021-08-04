const { handlerFactory, createWebpackConfig } = require('../lib/cliUtils');
const { runCompiler, handleCompilationError } = require('../lib/compiler');
const { info } = require('../lib/print');
const { SharedArgs } = require('../constants');

async function build(args) {
  try {
    info('Parsing webpack configuration file...');
    const config = await createWebpackConfig(['client', 'server'], args);

    info('Starting webpack compiler...');
    await runCompiler(config, args);
  } catch (err) {
    handleCompilationError(err);
  }
}

const buildCommand = {
  command: 'build',
  desc: 'Build an application for production',
  builder: {
    ...SharedArgs,
    clean: {
      desc: 'Clean build folder before building the application',
      type: 'boolean',
      default: true
    }
  },
  handler: handlerFactory(build)
};

module.exports = buildCommand;
