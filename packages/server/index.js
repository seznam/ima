'use strict';

const path = require('path');
const applicationFolder = path.resolve('.');
const { Emitter, Event } = require('./lib/emitter.js');

module.exports = function createIMAServer({
  environment,
  logger,
  emitter
} = {}) {
  environment =
    environment ||
    require('./lib/factory/environmentFactory.js')({ applicationFolder });

  global.$Debug = environment.$Debug;
  global.$IMA = global.$IMA || {};

  const modulePathCache = new Map();
  function requireUncached(module) {
    if (!modulePathCache.has(module)) {
      modulePathCache.set(module, path.resolve(module));
    }

    const modulePath = modulePathCache.get(module);

    if (environment.$Env === 'dev') {
      const moduleName = require.resolve(modulePath);

      if (!moduleName) {
        return;
      }

      searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
      });
    }

    return require(modulePath);
  }

  function searchCache(moduleName, callback) {
    if (moduleName && require.cache[moduleName] !== undefined) {
      const module = require.cache[moduleName];

      traverse(module, callback);

      Object.keys(module.constructor._pathCache).forEach(function (cacheKey) {
        if (cacheKey.indexOf(moduleName) > -1) {
          delete module.constructor._pathCache[cacheKey];
        }
      });
    }
  }

  function traverse(module, callback) {
    (module?.children || []).forEach(function (child) {
      if (child && require.cache[child.id] !== undefined) {
        traverse(require.cache[child.id], callback);
      }
    });

    callback(module);
  }

  function appFactory() {
    requireUncached('./build/server/vendors.js');
    return requireUncached('./build/server/app.server.js');
  }

  function languageLoader(language) {
    return requireUncached(`./build/static/locale/${language}.js`);
  }

  emitter = emitter || new Emitter({ logger });
  const instanceRecycler = require('./lib/instanceRecycler.js');
  const serverGlobal = require('./lib/serverGlobal.js');
  logger = logger || require('./lib/factory/loggerFactory.js')({ environment });
  const devErrorPage = require('./lib/factory/devErrorPageFactory.js')({
    logger
  });
  const urlParser = require('./lib/factory/urlParserMiddlewareFactory.js')({
    environment,
    applicationFolder
  });
  const serverApp = require('./lib/factory/serverAppFactory.js')({
    environment,
    logger,
    applicationFolder,
    devErrorPage,
    languageLoader,
    appFactory,
    emitter,
    instanceRecycler,
    serverGlobal
  });

  const cache = require('./lib/cache.js')({ environment });

  // TODO IMA@18 new performance utilization instead of concurrent requests
  // const performanceUtilization =
  //   require('./lib/factory/performanceUtilizationFactory.js')({ environment });

  // performanceUtilization.init();

  serverApp.useIMADefaultHook();

  !environment.$Debug && appFactory();

  return {
    environment,
    serverApp,
    urlParser,
    logger,
    cache,
    instanceRecycler,
    emitter,
    Event
  };
};
