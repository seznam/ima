const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const {
  statsFormattedOutput,
  handlerFactory,
  createWebpackConfig
} = require('../lib/cliUtils');

async function build({ options, imaConf }) {
  // Clean build directory
  const buildDir = path.join(options.rootDir, 'build');
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
  }

  // Build ima app
  const config = await createWebpackConfig({ options, imaConf });
  const compiler = webpack(config);

  compiler.run(statsFormattedOutput);
}

const buildCommand = {
  command: 'build',
  desc: 'Build an application for production',
  builder: {
    amp: {
      desc: 'Builds separate CSS files for use in AMP mode',
      type: 'boolean',
      default: false
    }
  },
  handler: handlerFactory(build)
};

module.exports = buildCommand;
