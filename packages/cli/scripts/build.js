const fs = require('fs');
const path = require('path');

const { handlerFactory, createWebpackConfig } = require('../lib/cliUtils');
const { runCompiler, handleCompilationError } = require('../lib/compiler');
const sharedArgs = require('./lib/sharedArgs');

async function build({ options, imaConf }) {
  // Clean build directory
  const buildDir = path.join(options.rootDir, 'build');
  if (options.clean && fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
  }

  try {
    const config = await createWebpackConfig({ options, imaConf });
    await runCompiler(config, options.verbose);
  } catch (err) {
    handleCompilationError(err);
  }
}

const buildCommand = {
  command: 'build',
  desc: 'Build an application for production',
  builder: {
    ...sharedArgs,
    compress: {
      desc: 'Compresses resulted assets for use in content-encoding serving',
      type: 'boolean'
    },
    clean: {
      desc: 'Clean build folder before building the application',
      type: 'boolean'
    }
  },
  handler: handlerFactory(build)
};

module.exports = buildCommand;
