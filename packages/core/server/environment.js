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
		var $Language = Object.assign({}, currentEnvironment.$Language);
		Helper.assignRecursively(productEnvironment, currentEnvironment);
		currentEnvironment = productEnvironment;
		currentEnvironment.$Language = $Language;
	}

	currentEnvironment.$Server.serveSPA.blackListReg = new RegExp(currentEnvironment.$Server.serveSPA.blackList.join('|'), 'g');

	currentEnvironment['$Env'] = env;

	return currentEnvironment;
})();

