const path = require('path');
const fs = require('fs');

const webpackConfig = require('../webpack/config');
const { error, info } = require('./printUtils');

const IMA_TMP_DIR = '.ima';

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

    info(out);
  } else {
    error(err);
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
      ...yargs,
      rootDir: dir ? absoluteDir : process.cwd(),
      isProduction,
      command
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

async function createWebpackConfig(
  args = {},
  configurations = ['server', 'client'],
  loadArgsFromTmpFile = false
) {
  let loadedArgs = args;

  try {
    const imaTmpDirPath = path.resolve(args.rootDir, IMA_TMP_DIR);
    const imaArgsFile = path.join(imaTmpDirPath, 'args.json');

    if (loadArgsFromTmpFile) {
      loadedArgs = JSON.parse(fs.readFileSync(imaArgsFile));
    } else {
      fs.rmSync(imaTmpDirPath, { recursive: true, force: true });
      fs.mkdirSync(imaTmpDirPath);
      fs.writeFileSync(imaArgsFile, JSON.stringify(args));
    }
  } catch (err) {
    error('Error occurred while creating webpack config.');
    error(err);
  }

  const finalConfiguration = [];

  if (~configurations.indexOf('server')) {
    finalConfiguration.push(
      await webpackConfig({
        ...loadedArgs,
        isServer: true
      })
    );
  }

  if (~configurations.indexOf('client')) {
    finalConfiguration.push(
      await webpackConfig({
        ...loadedArgs,
        isServer: false
      })
    );
  }

  return finalConfiguration;
}

module.exports = {
  createWebpackConfig,
  statsFormattedOutput,
  handlerFactory,
  builderFactory
};
