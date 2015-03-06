var config = require('../config/environment.js');


module.exports = function(req, res, next) {
	var domain = req.protocol + '://' + req.get('host');

	if (config.language[domain]) {
		res.locals.language = config.language[domain];
		res.locals.domain = domain;
	} else {
		throw new Error(`Domain '${domain}' isnt defined in server config environment.`);
	}

	next();
};