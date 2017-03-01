
var helper = require('ima-helpers');

module.exports = (environment) => {
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
		helper.assignRecursively(productEnvironment, currentEnvironment);
		currentEnvironment = productEnvironment;
		currentEnvironment.$Language = $Language;
	}

	var blacklistTester;
	if (currentEnvironment.$Server.serveSPA.blackList.length) {
		var blacklistPattern = currentEnvironment.$Server.serveSPA.blackList.join('|');
		blacklistTester = new RegExp(blacklistPattern, 'g');
	} else {
		blacklistTester = {
			test() {
				return false;
			}
		};
	}
	currentEnvironment.$Server.serveSPA.blackListReg = blacklistTester;

	currentEnvironment['$Env'] = env;

	return currentEnvironment;
};
