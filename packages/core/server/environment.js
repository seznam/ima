var environment = require('./config/environment.js');
var Helper = require('./helper.js');


module.exports = (() => {
	var prod = 'prod';
	var dev = 'dev';
	var env = process.env.NODE_ENV || dev;

	if (env === 'development') {
		env = dev;
	}

	var productEnvironment = environment[prod];
	var currentEnvironment = environment[env];

	if (env !== prod) {
		Helper.assignRecursively(productEnvironment, currentEnvironment);
		currentEnvironment = productEnvironment;
	}

	currentEnvironment['$Env'] = env;

	return currentEnvironment;
})();

