'use strict';

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
  // TODO IMA@18 rewrite to js file from server folder
  let environmentConfig = require(path.resolve(
    applicationFolder,
    './build/ima/config/environment.js'
  ));

  let currentEnvironment = environmentConfig[env];
  let $Language = Object.assign({}, currentEnvironment.$Language);

  currentEnvironment = helpers.resolveEnvironmentSetting(
    environmentConfig,
    env
  );
  currentEnvironment.$Language = $Language;
  currentEnvironment['$Env'] = env;

  return currentEnvironment;
};
