const path = require('path');

const helpers = require('@ima/helpers');

const prod = 'prod';
const dev = 'dev';
let env = process.env.NODE_ENV || dev;

if (env === 'development') {
  env = dev;
}

if (env === 'production') {
  env = prod;
}

module.exports = function environmentFactory({
  applicationFolder,
  processEnvironment,
}) {
  const environmentConfig = require(path.resolve(
    applicationFolder,
    './server/config/environment.js'
  ));

  let currentEnvironment = environmentConfig[env] || {};
  const $Language =
    currentEnvironment.$Language &&
    Object.assign({}, currentEnvironment.$Language);

  currentEnvironment = helpers.resolveEnvironmentSetting(
    environmentConfig,
    env
  );

  if ($Language) {
    currentEnvironment.$Language = $Language;
  }

  currentEnvironment['$Env'] = env;

  if (typeof processEnvironment === 'function') {
    currentEnvironment = processEnvironment(currentEnvironment);
  }

  return currentEnvironment;
};
