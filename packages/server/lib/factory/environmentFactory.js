const helpers = require('@ima/helpers');
const path = require('path');

const prod = 'prod';
const dev = 'dev';
let env = process.env.NODE_ENV || dev;

if (env === 'development') {
  env = dev;
}

if (env === 'production') {
  env = prod;
}

module.exports = function environmentFactory({ applicationFolder }) {
  let environmentConfig = require(path.resolve(
    applicationFolder,
    './server/config/environment.js'
  ));

  let currentEnvironment = environmentConfig[env];
  let $Language =
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

  return currentEnvironment;
};
