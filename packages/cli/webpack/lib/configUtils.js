const path = require('path');
const fs = require('fs');

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

module.exports = {
  resolveEnvironment,
  requireConfig,
  additionalDataFactory
};
