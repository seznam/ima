const webpack = require('webpack');

const webpackConfig = require('../build/webpack/config');
const {
  statsFormattedOutput,
  handlerFactory,
  builderFactory
} = require('../build/utils');

async function build(args) {
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
  compiler.run(statsFormattedOutput);
}

const buildCommand = {
  command: 'build',
  desc: 'Build an application for production',
  builder: builderFactory(),
  handler: handlerFactory(build)
};

module.exports = buildCommand;
