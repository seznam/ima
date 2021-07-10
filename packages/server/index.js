'use strict';

let path = require('path');
let applicationFolder = path.resolve('.');

// TODO IMA@18 delete
require(path.resolve(applicationFolder, './build/ima/shim.es.js'));
require(path.resolve(applicationFolder, './build/ima/vendor.server.js'));
// TODO IMA@18 delete

function appFactory() {
  delete require.cache[
    path.resolve(applicationFolder, './build/ima/app.server.js')
  ];

  require(path.resolve(applicationFolder, './build/ima/app.server.js'))();
}

function languageLoader(language) {
  return require(path.resolve(
    applicationFolder,
    `./build/ima/locale/${language}.js`
  ));
}

module.exports = function createIMAServer({ environment, logger } = {}) {
  environment =
    environment ||
    require('./lib/factory/environmentFactory.js')({ applicationFolder });

  global.$Debug = environment.$Debug;
  global.$IMA = global.$IMA || {};

  logger = logger || require('./lib/factory/loggerFactory.js')({ environment });
  const devErrorPage = require('./lib/factory/devErrorPageFactory.js')({
    logger
  });
  const urlParser = require('./lib/factory/urlParserMiddlewareFactory.js')({
    environment,
    applicationFolder
  });
  const clientApp = require('./lib/clientApp.js')({
    environment,
    logger,
    devErrorPage,
    languageLoader,
    appFactory
  });
  const cache = require('./lib/cache.js')({ environment });

  return {
    environment,
    clientApp,
    urlParser,
    logger,
    cache
  };
};
