'use strict';
const DEFAULT_LANGUAGE = 'cs';

let path = require('path');
let applicationFolder = path.resolve('.');

let environmentConfig = require(path.resolve(
	applicationFolder,
	'./build/ima/config/environment.js')
);
let environment = require('./lib/environment.js')(environmentConfig);

global.$Debug = environment.$Debug;
global.$IMA = global.$IMA || {};

require(path.resolve(applicationFolder, './build/ima/shim.js'));
require(path.resolve(applicationFolder, './build/ima/vendor.server.js'));

function appFactory() {
	delete require.cache[path.resolve(
		applicationFolder,
		'./build/ima/app.server.js'
	)];

	require(path.resolve(applicationFolder, './build/ima/app.server.js'))();
}

function languageLoader(language) {
	if (!language) {
		language = environment.$Language[Object.keys(environment.$Language)[0]] || DEFAULT_LANGUAGE;
	}

	return require(
		path.resolve(
			applicationFolder,
			`./build/ima/locale/${language}.js`
		));
}

let logger = require('./lib/logger.js')(environment);
let urlParser = require('./lib/urlParser.js')(environment);
let proxyFactory = require('./lib/proxy.js')(environment, logger);
let proxy = proxyFactory(environment.$Proxy.server);
let clientApp = require('./lib/clientApp.js')(
	environment,
	logger,
	languageLoader,
	appFactory
);
let cache = require('./lib/cache.js')(environment);

module.exports =  {
	environment,
	clientApp,
	urlParser,
	logger,
	proxy,
	proxyFactory,
	cache
};
