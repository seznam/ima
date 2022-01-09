'use strict';

let path = require('path');
let applicationFolder = path.resolve('.');

let environmentConfig = require(path.resolve(
  applicationFolder,
  './server/config/environment.js'
));
let environment = require('./lib/environment.js')(environmentConfig);

require(path.resolve(applicationFolder, './build/server/runtime.js'));
require(path.resolve(applicationFolder, './build/server/vendors.js'));

global.$Debug = environment.$Debug;
global.$IMA = global.$IMA || {};

function appFactory() {
  delete require.cache[
    path.resolve(applicationFolder, './build/server/app.server.js')
  ];

  // Require new server-side bundle on dev reload
  try {
    if (environment.$Env === 'dev') {
      delete require.cache[
        path.resolve(applicationFolder, './build/server/runtime.js')
      ];

      require(path.resolve(applicationFolder, './build/server/runtime.js'));

      return require(path.resolve(
        applicationFolder,
        './build/server/app.server.js'
      ));
    }
  } catch (error) {
    // fail silently for potential compile errors which are handled separately
  }
}

// eslint-disable-next-line no-unused-vars
function languageLoader(language) {
  return () => {};
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
