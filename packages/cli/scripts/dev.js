const webpack = require('webpack');

const {
  statsFormattedOutput,
  handlerFactory,
  builderFactory,
  createWebpackConfig
} = require('../lib/cliUtils');

async function dev(args) {
  const config = await createWebpackConfig({
    ...args,
    isProduction: false,
    isWatch: true
  });

  const compiler = webpack(config);
  compiler.watch({}, statsFormattedOutput);
}

const devCommand = {
  command: 'dev',
  desc: 'Run application in development watch mode',
  builder: builderFactory({
    'legacy-compat-mode': {
      desc: 'Runs application in ES5 compatible format'
    }
  }),
  handler: handlerFactory(dev)
};

module.exports = devCommand;
