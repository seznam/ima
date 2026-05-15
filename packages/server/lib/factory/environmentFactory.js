const path = require('path');

const helpers = require('@ima/helpers');

const createJSONLogger = require('./loggerFactory');

const prod = 'prod';
const dev = 'dev';

/**
 * Env default values
 */
const defaultEnvironment = {
  prod: {
    $Debug: false,
    $Server: {
      port: 3001,
      staticPath: '/static',
      // Max number of app instances to recycle (pool size)
      concurrency: 5,
      clusters: null,
      cache: {
        enabled: false,
        cacheKeyGenerator: null,
        entryTtl: 15 * 1000,
        unusedEntryTtl: 10 * 1000,
        maxEntries: 200,
      },
      loggerFactory: createJSONLogger,
    },
  },

  dev: {
    $Debug: true,
    $Server: {
      // Max number of app instances to recycle (pool size)
      concurrency: 1,
      loggerFactory: () => console,
    },
  },
};

/**
 * @param {{
 *   applicationFolder: string,
 *   environment?: keyof import('@ima/core').AppEnvironment,
 *   processEnvironment: (
 *     env: import('@ima/core').ParsedEnvironment
 *   ) => import('@ima/core').ParsedEnvironment
 * }} config
 * @returns {import('@ima/core').ParsedEnvironment}
 */
module.exports = function environmentFactory({
  applicationFolder,
  environment,
  processEnvironment,
}) {
  const env = resolveEnvironmentName(environment);
  const environmentConfig = require(
    path.resolve(applicationFolder, './server/config/environment.js')
  );

  // Merge defaults with resolved env config
  const baseEnvConfig = helpers.assignRecursively(
    defaultEnvironment,
    environmentConfig
  );

  let currentEnvironment = baseEnvConfig[env] || {};

  const $Language =
    currentEnvironment.$Language &&
    Object.assign({}, currentEnvironment.$Language);

  currentEnvironment = helpers.resolveEnvironmentSetting(baseEnvConfig, env);

  if (!currentEnvironment.$Language) {
    currentEnvironment.$Language = {
      '//*:*': 'en',
    };
  } else {
    if ($Language) {
      currentEnvironment.$Language = $Language;
    }
  }

  currentEnvironment['$Env'] = env;

  if (typeof processEnvironment === 'function') {
    currentEnvironment = processEnvironment(currentEnvironment);
  }

  return currentEnvironment;
};

function resolveEnvironmentName(environment) {
  let env = environment || process.env.IMA_ENV || process.env.NODE_ENV || dev;

  if (env === 'development') {
    env = dev;
  }

  if (env === 'production') {
    env = prod;
  }

  return env;
}
