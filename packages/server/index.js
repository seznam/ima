
module.exports = (environmentConfig, languageLoader, appFactory) => {
	'use strict';

	var environment = require('./lib/environment.js')(environmentConfig);

	GLOBAL.$Debug = environment.$Debug;
	GLOBAL.$IMA = GLOBAL.$IMA || {};

	var logger = require('./lib/logger.js')(environment);
	var urlParser = require('./lib/urlParser.js')(environment);
	var proxy = require('./lib/proxy.js')(environment, logger);
	var clientApp = require('./lib/clientApp.js')(environment, logger, languageLoader, appFactory);
	var cache = require('./lib/cache.js')(environment);

	return {
		environment,
		clientApp,
		urlParser,
		logger,
		proxy,
		cache
	};
};
