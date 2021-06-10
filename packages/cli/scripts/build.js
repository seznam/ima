const webpack = require('webpack');

const {
  statsFormattedOutput,
  handlerFactory,
  builderFactory
} = require('../build/utils');
const { getWebpackConfig } = require('../build/webpack/config');

async function build(args) {
  const config = [
    await getWebpackConfig({
      ...args,
      isServer: true
    }),
    await getWebpackConfig({
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
