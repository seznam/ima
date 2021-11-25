'use strict';

let path = require('path');
let applicationFolder = path.resolve('.');

let environmentConfig = require(path.resolve(
  applicationFolder,
  './server/config/environment.js'
));
let environment = require('./lib/environment.js')(environmentConfig);

global.$Debug = environment.$Debug;
global.$IMA = global.$IMA || {};

// require(path.resolve(applicationFolder, './build/ima/shim.es.js'));
// require(path.resolve(applicationFolder, './build/ima/vendor.server.js'));

function appFactory() {
  delete require.cache[
    path.resolve(applicationFolder, './build/ima/app.server.js')
  ];

  return require(path.resolve(applicationFolder, './build/ima/app.server.js'));
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
