const path = require('path');

function statsFormattedOutput(err, stats) {
  if (!err) {
    const out = stats.toString({
      assets: true,
      cached: false,
      children: false,
      chunks: false,
      chunkModules: false,
      colors: true,
      hash: true,
      modules: false,
      reasons: false,
      source: false,
      timings: true,
      version: true
    });

    console.log(out);
  } else {
    console.error(err);
  }
}

function handlerFactory(handlerFn) {
  return async yargs => {
    // eslint-disable-next-line no-unused-vars
    const [command, dir = ''] = yargs._ || [];

    const isProduction = process.env.NODE_ENV === 'production';
    const absoluteDir = path.isAbsolute(dir)
      ? dir
      : path.resolve(process.cwd(), dir);

    return await handlerFn({
      rootDir: dir ? absoluteDir : process.cwd(),
      isProduction,
      isLegacyMode: !!yargs.legacyCompatMode,
      publicPath: yargs.publicPath ? yargs.publicPath : '/'
    });
  };
}

function builderFactory(cliOptions = {}) {
  return {
    'public-path': {
      desc: 'Define public path for application assets'
    },
    ...cliOptions
  };
}

module.exports = {
  statsFormattedOutput,
  handlerFactory,
  builderFactory
};
