'use strict';

const path = require('path');
const applicationFolder = path.resolve('.');
const { Emitter } = require('./hooks.js');

// TODO IMA@18 delete
require(path.resolve(applicationFolder, './build/ima/shim.es.js'));
require(path.resolve(applicationFolder, './build/ima/vendor.server.js'));
// TODO IMA@18 delete

// TODO IMA@18 update for webpack
function appFactory() {
  delete require.cache[
    path.resolve(applicationFolder, './build/ima/app.server.js')
  ];

  require(path.resolve(applicationFolder, './build/ima/app.server.js'))();
}

// TODO IMA@18 update for webpack
function languageLoader(language) {
  return require(path.resolve(
    applicationFolder,
    `./build/ima/locale/${language}.js`
  ));
}

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
  emitter = emitter || new Emitter({ logger });
  const instanceRecycler = require('./lib/instanceRecycler.js')();
  const serverGlobal = require('./lib/serverGlobal.js')();
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

  return {
    environment,
    serverApp,
    urlParser,
    logger,
    cache,
    instanceRecycler,
    emitter
  };
};
