'use strict';

const path = require('path');

const defaultApplicationFolder = path.resolve('.');
const { createMonitoring } = require('@esmj/monitor');

const {
  createUserAgentDegradation,
  createPathDegradation,
  createHeaderDegradation,
  combineAnd,
  combineOr,
  invert,
} = require('./lib/degradation.js');
const { Emitter, Event } = require('./lib/emitter.js');
const environmentFactory = require('./lib/factory/environmentFactory');
const urlParserFactory = require('./lib/factory/urlParserFactory');
const { sanitizeValue } = require('./lib/factory/utils/metaUtils');
const {
  renderStyles,
  renderScript,
} = require('./lib/factory/utils/resourcesUtils');
const { instrumentEmitterWithTimings } = require('./lib/metric/timingMonitor');
const { TimingTracker } = require('./lib/metric/TimingTracker');

function createIMAServer({
  environment,
  logger,
  emitter,
  performance,
  devUtils,
  applicationFolder = defaultApplicationFolder,
  processEnvironment,
} = {}) {
  environment =
    environment ||
    require('./lib/factory/environmentFactory.js')({
      applicationFolder,
      processEnvironment,
    });
  devUtils =
    devUtils ||
    require('./lib/factory/devUtilsFactory.js')({ applicationFolder });

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

  logger =
    logger ||
    (typeof environment?.$Server?.loggerFactory === 'function'
      ? environment.$Server.loggerFactory({ environment })
      : console);

  emitter = emitter || new Emitter({ logger, debug: false });
  const instanceRecycler = require('./lib/instanceRecycler.js');
  const serverGlobal = require('./lib/serverGlobal.js');

  const concurrentRequestsMetric =
    require('./lib/metric/concurrentRequestsMetricFactory.js')({
      instanceRecycler,
    });
  performance = performance || createMonitoring();
  performance.monitor.add(concurrentRequestsMetric);
  performance.start();

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
    logger,
    cache,
    instanceRecycler,
    memStaticProxy,
    emitter,
    performance,
    Event,
  };
}

module.exports = {
  renderStyles,
  renderScript,
  createIMAServer,
  environmentFactory,
  urlParserFactory,
  sanitizeValue,
  TimingTracker,
  instrumentEmitterWithTimings,
  Event,
  createUserAgentDegradation,
  createPathDegradation,
  createHeaderDegradation,
  combineAnd,
  combineOr,
  invert,
};
