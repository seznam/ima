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

/**
 * Env default values
 */
const defaultEnvironment = {
  prod: {
    $Debug: false,
    $Language: {
      '//*:*': 'en',
    },
    $Server: {
      port: 3001,
      staticPath: '/static',
      // Max number of app instances to recycle (pool size)
      concurrency: 100,
      // Threshold for serving static error pages
      staticConcurrency: 100,
      // Threshold for showing overload message
      overloadConcurrency: 100,
      clusters: null,
      serveSPA: {
        allow: true,
      },
      cache: {
        enabled: false,
        cacheKeyGenerator: null,
        entryTtl: 60 * 60 * 1000,
        unusedEntryTtl: 15 * 60 * 1000,
        maxEntries: 500,
      },
      logger: {
        formatting: 'simple',
      },
    },
  },

  dev: {
    $Debug: true,
    $Language: {
      '//*:*': 'en',
    },
    $Server: {
      // Max number of app instances to recycle (pool size)
      concurrency: 1,
      logger: {
        formatting: 'dev',
      },
    },
  },
};

/**
 * @param {{
 *   applicationFolder: string,
 *   processEnvironment: (
 *     env: import('@ima/core').ParsedEnvironment
 *   ) => import('@ima/core').ParsedEnvironment
 * }} config
 * @returns {import('@ima/core').ParsedEnvironment}
 */
module.exports = function environmentFactory({
  applicationFolder,
  processEnvironment,
}) {
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

  if ($Language) {
    currentEnvironment.$Language = $Language;
  }

  currentEnvironment['$Env'] = env;

  if (typeof processEnvironment === 'function') {
    currentEnvironment = processEnvironment(currentEnvironment);
  }

  return currentEnvironment;
};
