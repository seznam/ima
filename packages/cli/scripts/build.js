const webpack = require('webpack');

const { statsFormattedOutput } = require('../build/output');
const serverConfig = require('../build/webpack/config/server');
const clientConfig = require('../build/webpack/config/client');

async function build(args) {
  const compiler = webpack([serverConfig(args), clientConfig(args)]);

  compiler.run(statsFormattedOutput);
}

const buildCommand = {
  command: 'build',
  desc: 'Build an application for production',
  handler: async yargs => {
    await build({
      yargs: yargs,
      cwd: process.cwd()
    });
  }
};

module.exports = buildCommand;
