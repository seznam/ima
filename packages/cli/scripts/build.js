const webpack = require('webpack');

const {
  statsFormattedOutput,
  handlerFactory,
  builderFactory,
  createWebpackConfig
} = require('../lib/cliUtils');

async function build(args) {
  const config = await createWebpackConfig(args);
  const compiler = webpack(config);

  compiler.run(statsFormattedOutput);
}

const buildCommand = {
  command: 'build',
  desc: 'Build an application for production',
  builder: builderFactory(),
  handler: handlerFactory(build)
};

module.exports = buildCommand;
