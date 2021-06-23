const path = require('path');
const deepmerge = require('deepmerge');
const fs = require('fs');

const webpackConfig = require('../webpack/config');
const { error, info } = require('./printUtils');
const defaultImaConf = require('./default.ima.conf');

const IMA_TMP_DIR = '.ima';
const IMA_CONF_FILENAME = 'ima.conf.js';

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

function loadImaConf(rootDir) {
  if (!rootDir) {
    return defaultImaConf;
  }

  const imaConfPath = path.join(rootDir, IMA_CONF_FILENAME);

  return fs.existsSync(imaConfPath)
    ? deepmerge(defaultImaConf, require(imaConfPath))
    : {};
}

function handlerFactory(handlerFn) {
  return async yargs => {
    // eslint-disable-next-line no-unused-vars
    const [command, dir = ''] = yargs._ || [];
    const isProduction = process.env.NODE_ENV === 'production';
    const rootDir = dir
      ? path.isAbsolute(dir)
        ? dir
        : path.resolve(process.cwd(), dir)
      : process.cwd();

    const { options, ...imaConf } = loadImaConf(rootDir);

    return await handlerFn({
      options: {
        ...options,
        ...yargs,
        rootDir,
        isProduction,
        command
      },
      imaConf
    });
  };
}

async function createWebpackConfig(
  { options = {}, imaConf = {} } = {},
  configurations = ['client', 'server'],
  loadOptionsFromTmpFile = false
) {
  let loadedOptions = options;
  let loadedImaConf = imaConf;

  try {
    const imaTmpDirPath = path.resolve(options.rootDir, IMA_TMP_DIR);
    const imaTmpOptionsFile = path.join(imaTmpDirPath, 'options.json');

    if (loadOptionsFromTmpFile) {
      loadedOptions = JSON.parse(fs.readFileSync(imaTmpOptionsFile));
      loadedImaConf = loadImaConf(loadedOptions.rootDir);
    } else {
      fs.rmSync(imaTmpDirPath, { recursive: true, force: true });
      fs.mkdirSync(imaTmpDirPath);
      fs.writeFileSync(imaTmpOptionsFile, JSON.stringify(options));
    }
  } catch (err) {
    error('Error occurred while creating webpack config.');
    error(err);
  }

  const finalConfigurationOptions = [];

  if (~configurations.indexOf('client')) {
    finalConfigurationOptions.push({
      ...loadedOptions,
      isServer: false
    });
  }

  if (~configurations.indexOf('server')) {
    finalConfigurationOptions.push({
      ...loadedOptions,
      isServer: true
    });
  }

  return Promise.all(
    finalConfigurationOptions.map(async options => {
      if (typeof loadedImaConf?.webpack === 'function') {
        return await loadedImaConf?.webpack(
          await webpackConfig(options, loadedImaConf),
          options,
          loadedImaConf
        );
      } else {
        return await webpackConfig(options, loadedImaConf);
      }
    })
  );
}

module.exports = {
  createWebpackConfig,
  statsFormattedOutput,
  handlerFactory,
  loadImaConf
};
