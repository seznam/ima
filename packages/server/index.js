'use strict';

const path = require('path');
const applicationFolder = path.resolve('.');
const { Emitter, Event } = require('./lib/emitter.js');
const { createMonitoring } = require('@esmj/monitor');

module.exports = function createIMAServer({
  environment,
  logger,
  emitter,
  performance,
  devUtils,
} = {}) {
  environment =
    environment ||
    require('./lib/factory/environmentFactory.js')({ applicationFolder });
  devUtils = devUtils || require('./lib/factory/devUtilsFactory.js')();

  global.$Debug = environment.$Debug;
  global.$IMA = global.$IMA || {};

  function appFactory() {
    devUtils.manifestRequire('server/vendors.js', {
      optional: true,
      dependencies: ['server/app.server.js'],
    });

    return devUtils.manifestRequire('server/app.server.js');
  }

  function languageLoader(language) {
    return devUtils.manifestRequire(`server/locale/${language}.js`).default;
  }

  performance = performance || createMonitoring();
  performance.monitor.start();

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
    performance,
    instanceRecycler,
    serverGlobal,
  });
  const memStaticProxy =
    require('./lib/factory/memStaticProxyMiddlewareFactory')();

  const cache = require('./lib/cache.js')({ environment });

  serverApp.useIMADefaultHook();

  // Lazy init app factory
  process.env.IMA_CLI_LAZY_SERVER !== 'true' && appFactory();

  return {
    environment,
    serverApp,
    urlParser,
    logger,
    cache,
    instanceRecycler,
    memStaticProxy,
    emitter,
    performance,
    Event,
  };
};
