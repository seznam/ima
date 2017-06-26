'use strict';

const helpers = require('ima-helpers');

module.exports = environment => {
	let prod = 'prod';
	let dev = 'dev';
	let env = process.env.NODE_ENV || dev;

	if (env === 'development') {
		env = dev;
	}

	if (env === 'production') {
		env = prod;
	}

	let productEnvironment = environment[prod];
	let currentEnvironment = environment[env];

	if (env !== prod) {
		let $Language = Object.assign({}, currentEnvironment.$Language);
		helpers.assignRecursively(productEnvironment, currentEnvironment);
		currentEnvironment = productEnvironment;
		currentEnvironment.$Language = $Language;
	}

	let blacklistTester;
	if (currentEnvironment.$Server.serveSPA.blackList.length) {
		let blacklistPattern = currentEnvironment.$Server.serveSPA.blackList.join('|');
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
