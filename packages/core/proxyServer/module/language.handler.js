var config = require('../config/environment.js');

module.exports = function(req, res, next) {
	var domain = req.protocol + '://' + req.get('host');

	if (config.$Language[domain]) {
		res.locals.language = config.$Language[domain];
		res.locals.domain = domain;
	} else {
		res.locals.language = 'en';
		throw new Error(`Domain '${domain}' isnt defined in server config environment.`);
	}

	next();
};