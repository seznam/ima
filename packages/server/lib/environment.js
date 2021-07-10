'use strict';
// TODO IMA@18 remove

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

module.exports = environment => {
  let currentEnvironment = environment[env];
  let $Language = Object.assign({}, currentEnvironment.$Language);

  currentEnvironment = helpers.resolveEnvironmentSetting(environment, env);
  currentEnvironment.$Language = $Language;
  currentEnvironment['$Env'] = env;

  return currentEnvironment;
};
