
module.exports = (environmentConfig, languageLoader, appFactory) => {
	'use strict';

	let environment = require('./lib/environment.js');
	environment.$__loadEnvironmentConfiguration(environmentConfig);

	GLOBAL.$Debug = environment.$Debug;
	GLOBAL.$IMA = GLOBAL.$IMA || {};

	let clientApp = require('./lib/clientApp.js')(languageLoader, appFactory);
	let urlParser = require('./lib/urlParser.js');
	let logger = require('./lib/logger.js');
	let proxy = require('./lib/proxy.js');
	let Cache = require('./lib/cache.js');

	return {
		environment,
		clientApp,
		urlParser,
		logger,
		proxy,
		Cache
	};
};
