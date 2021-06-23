const path = require('path');
const fs = require('fs');
const fg = require('fast-glob');

const { error } = require('../../lib/printUtils');

function resolveEnvironment(rootDir) {
  const envSource = require(path.resolve(rootDir, './app/environment.js'));
  const envConfig = require(path.resolve(
    rootDir,
    './node_modules/@ima/server/lib/environment.js'
  ))(envSource);

  return envConfig;
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
        fullPath: path.join(rootDir, fileName)
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
  } catch (err) {
    error(`Error occurred while loading ${configPath} file`);
    error(err);

    return defaultConfig;
  }
}

function additionalDataFactory(contentFunctions) {
  return content =>
    contentFunctions
      .map(fn => {
        if (typeof fn !== 'function') {
          return;
        }

        return fn(content);
      })
      .join('');
}

async function generateEntryPoints(rootDir, paths = [], outputPrefix = '') {
  const resolvedPaths = await fg(
    paths.map(globPath => path.join(rootDir, globPath))
  );

  return resolvedPaths.reduce((acc, cur) => {
    let entryPoint = path.join(outputPrefix, cur.replace(`${rootDir}/`, ''));

    const extensionIndex = entryPoint.lastIndexOf('.');
    entryPoint = entryPoint.substring(0, extensionIndex);

    acc[entryPoint] = cur;

    return acc;
  }, {});
}

function wif(condition, value, defaultValue = null) {
  if (condition) {
    return value;
  }

  if (defaultValue !== null) {
    return defaultValue;
  }

  return Array.isArray(value) ? [] : {};
}

module.exports = {
  wif,
  resolveEnvironment,
  requireConfig,
  additionalDataFactory,
  generateEntryPoints
};
