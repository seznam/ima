
var Helper = require('./helper.js');

module.exports = {
	$__loadEnvironmentConfiguration: loadEnvironmentConfiguration
};

function loadEnvironmentConfiguration(environment) {
	var prod = 'prod';
	var dev = 'dev';
	var env = process.env.NODE_ENV || dev;

	if (env === 'development') {
		env = dev;
	}

	if (env === 'production') {
		env = prod;
	}

	var productEnvironment = environment[prod];
	var currentEnvironment = environment[env];

	if (env !== prod) {
		var $Language = Object.assign({}, currentEnvironment.$Language);
		Helper.assignRecursively(productEnvironment, currentEnvironment);
		currentEnvironment = productEnvironment;
		currentEnvironment.$Language = $Language;
	}

	currentEnvironment.$Server.serveSPA.blackListReg = new RegExp(currentEnvironment.$Server.serveSPA.blackList.join('|'), 'g');

	currentEnvironment['$Env'] = env;

	Object.assign(module.exports, currentEnvironment);
};
