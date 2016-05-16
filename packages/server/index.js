
module.exports = (environmentConfig, languageLoader, appFactory) => {
	'use strict';

	var environment = require('./lib/environment.js')(environmentConfig);

	global.$Debug = environment.$Debug;
	global.$IMA = global.$IMA || {};

	var logger = require('./lib/logger.js')(environment);
	var urlParser = require('./lib/urlParser.js')(environment);
	var proxyFactory = require('./lib/proxy.js')(environment, logger);
	var proxy = proxyFactory(environment.$Proxy.server);
	var clientApp = require('./lib/clientApp.js')(environment, logger, languageLoader, appFactory);
	var cache = require('./lib/cache.js')(environment);

	return {
		environment,
		clientApp,
		urlParser,
		logger,
		proxy,
		proxyFactory,
		cache
	};
};
