const path = require('path');
const fs = require('fs');

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

function requireConfig({
  rootDir,
  fileNames,
  packageJson = null,
  packageJsonKey = '',
  defaultConfig = {}
}) {
  if (
    !rootDir ||
    !Array.isArray(fileNames) ||
    fileNames.length === 0 ||
    !fs.existsSync(rootDir)
  ) {
    return defaultConfig;
  }

  const { fullPath: configPath, fileName: configFileName } =
    fileNames
      .map(fileName => ({
        fileName,
        fullPath: path.resolve(rootDir, fileName)
      }))
      .find(({ fullPath }) => fs.existsSync(fullPath)) || {};

  if (
    !configPath &&
    !(packageJson && packageJsonKey && packageJson[packageJsonKey])
  ) {
    return defaultConfig;
  }

  try {
    if (configPath) {
      const extension = configFileName.split('.').pop();

      return ~['js', 'cjs', 'json'].indexOf(extension)
        ? require(configPath)
        : JSON.parse(fs.readFileSync(configPath));
    } else {
      return packageJson[packageJsonKey];
    }
  } catch (error) {
    console.error(`Error occurred while loading ${configPath} file.`);
    console.error(error);

    return defaultConfig;
  }
}

module.exports = {
  requireConfig,
  statsFormattedOutput,
  handlerFactory,
  builderFactory
};
