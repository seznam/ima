'use strict';

const path = require('path');
const applicationFolder = path.resolve('.');
const { Emitter, Event } = require('./lib/emitter.js');

module.exports = function createIMAServer({
  environment,
  logger,
  emitter,
} = {}) {
  environment =
    environment ||
    require('./lib/factory/environmentFactory.js')({ applicationFolder });

  global.$Debug = environment.$Debug;
  global.$IMA = global.$IMA || {};

  const requireUncached = require('./lib/factory/devUtilsFactory.js')();

  function appFactory() {
    requireUncached('./build/server/vendors.js', { optional: true });
    return requireUncached('./build/server/app.server.js');
  }

  function languageLoader(language) {
    return requireUncached(`./build/server/locale/${language}.js`).default;
  }

  emitter = emitter || new Emitter({ logger, debug: false });
  const instanceRecycler = require('./lib/instanceRecycler.js');
  const serverGlobal = require('./lib/serverGlobal.js');
  logger = logger || require('./lib/factory/loggerFactory.js')({ environment });

  const urlParser = require('./lib/factory/urlParserMiddlewareFactory.js')({
    environment,
    applicationFolder,
  });
  const serverApp = require('./lib/factory/serverAppFactory.js')({
    environment,
    logger,
    applicationFolder,
    languageLoader,
    appFactory,
    emitter,
    instanceRecycler,
    serverGlobal,
  });

  const cache = require('./lib/cache.js')({ environment });

  // TODO IMA@18 new performance utilization instead of concurrent requests
  // const performanceUtilization =
  //   require('./lib/factory/performanceUtilizationFactory.js')({ environment });

  // performanceUtilization.init();

  serverApp.useIMADefaultHook();

  // TODO IMA@18 prepare settings for lazy start
  !environment.$Debug && appFactory();

  return {
    environment,
    serverApp,
    urlParser,
    logger,
    cache,
    instanceRecycler,
    emitter,
    Event,
  };
};
