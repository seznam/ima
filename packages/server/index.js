'use strict';

let path = require('path');
let applicationFolder = path.resolve('.');

let environmentConfig = require(path.resolve(
  applicationFolder,
  './server/config/environment.js'
));
let environment = require('./lib/environment.js')(environmentConfig);

if (environment.$Env === 'dev') {
  require(path.resolve(applicationFolder, './build/server/runtime.js'));
  require(path.resolve(applicationFolder, './build/server/vendors.js'));
}

global.$Debug = environment.$Debug;
global.$IMA = global.$IMA || {};

function appFactory() {
  delete require.cache[
    path.resolve(applicationFolder, './build/server/app.server.js')
  ];

  // Require new server-side bundle on dev reload
  if (environment.$Env === 'dev') {
    try {
      delete require.cache[
        path.resolve(applicationFolder, './build/server/runtime.js')
      ];

      require(path.resolve(applicationFolder, './build/server/runtime.js'));

      return require(path.resolve(
        applicationFolder,
        './build/server/app.server.js'
      ));
    } catch (_) {
      // fail silently for potential compile errors which are handled in error overlay
      return null;
    }
  }

  return require(path.resolve(
    applicationFolder,
    './build/server/app.server.js'
  ));
}

function languageLoader(language) {
  return require(path.resolve(
    applicationFolder,
    `./build/static/js/locale/${language}.js`
  ));
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
  cache
};
