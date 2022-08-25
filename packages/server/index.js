let path = require('path');
let applicationFolder = path.resolve('.');

let environmentConfig = require(path.resolve(
  applicationFolder,
  './server/config/environment.js'
));
let environment = require('./lib/environment.js')(environmentConfig);

global.$Debug = environment.$Debug;
global.$IMA = global.$IMA || {};

const modulePathCache = new Map();

function requireUncached(module) {
  if (!modulePathCache.has(module)) {
    modulePathCache.set(module, path.resolve(module));
  }

  if (environment.$Env === 'dev') {
    delete require.cache[require.resolve(modulePathCache.get(module))];
  }

  return require(modulePathCache.get(module));
}

if (environment.$Env === 'dev') {
  requireUncached('./build/server/vendors.js');
}

function appFactory() {
  // Require new server-side bundle on dev reload
  if (environment.$Env === 'dev') {
    try {
      requireUncached('./build/server/vendors.js');
      return requireUncached('./build/server/app.server.js');
    } catch (error) {
      (logger ?? console).error('Application factory error', {
        error,
      });

      return null;
    }
  }

  return requireUncached('./build/server/app.server.js');
}

function languageLoader(language) {
  return requireUncached(`./build/static/js.es/${language}.js`);
}

let logger = require('./lib/logger.js')(environment);
let urlParser = require('./lib/urlParser.js')(environment);
let clientApp = require('./lib/clientApp.js')(
  environment,
  logger,
  languageLoader,
  appFactory
);
let cache = require('./lib/cache.js')(environment);

module.exports = {
  environment,
  clientApp,
  urlParser,
  logger,
  cache,
};
