'use strict';

const path = require('path');

const applicationFolder = path.resolve('.');
const { createMonitoring } = require('@esmj/monitor');

const { Emitter, Event } = require('./lib/emitter.js');

module.exports = function createIMAServer({
  environment,
  logger,
  emitter,
  performance,
  manifestRequire = require('./lib/factory/devUtilsFactory.js')(),
} = {}) {
  environment =
    environment ||
    require('./lib/factory/environmentFactory.js')({ applicationFolder });

  global.$Debug = environment.$Debug;
  global.$IMA = global.$IMA || {};

  function appFactory() {
    manifestRequire('server/vendors.js', {
      optional: true,
      dependencies: ['server/app.server.js'],
    });

    return manifestRequire('server/app.server.js');
  }

  function languageLoader(language) {
    return manifestRequire(`server/locale/${language}.js`).default;
  }

  emitter = emitter || new Emitter({ logger, debug: false });
  const instanceRecycler = require('./lib/instanceRecycler.js');
  const serverGlobal = require('./lib/serverGlobal.js');
  logger = logger || require('./lib/factory/loggerFactory.js')({ environment });

  const concurrentRequestsMetric =
    require('./lib/metric/concurrentRequestsMetricFactory.js')({
      instanceRecycler,
    });
  performance = performance || createMonitoring();
  performance.monitor.add(concurrentRequestsMetric);
  performance.monitor.start();

  const urlParser = require('./lib/middlewares/urlParserMiddlewareFactory.js')({
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
    require('./lib/middlewares/memStaticProxyMiddlewareFactory')();

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
