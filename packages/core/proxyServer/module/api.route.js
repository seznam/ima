var express = require('express');
var router = express.Router();
var superAgent = require('superagent');
var config = require('../config/environment.js');

var firstLetterToLowerCase = (world) => {
	return world.charAt(0).toLowerCase() + world.slice(1);
};

var parseCookieString = (cookieString) => {
	var cookiePairs = cookieString.split('; ');

	var cookieName = null;
	var cookieValue = null;
	var cookieOptions = {
		path: '/',
		secure: false,
		expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
		httpOnly: false
	};

	cookiePairs.forEach((pair) => {
		var separatorIndexEqual =  pair.indexOf('=');
		var name = decodeURIComponent(firstLetterToLowerCase(pair.substr(0, separatorIndexEqual)));
		var value = decodeURIComponent(pair.substr(separatorIndexEqual + 1));

		if (cookieOptions[name]) {
			var date = new Date(value);

			if (isNaN(date.getTime())) {
				cookieOptions[name] = value;
			} else {
				cookieOptions[name] = date;
			}

		} else {
			cookieName = name;
			cookieValue = value;
		}
	});

	return {
		name: cookieName,
		value: cookieValue,
		options: cookieOptions
	};
};


var callRemoteServer = (req, res) => {
	var url = req.url;
	var httpRequest = null;

	if ((req.url.length > 1) && (req.url[req.url.length-1] === '/')) {
		url = url.substr(0, url.length - 1);
	}

	console.log(`API: ${req.method} ${config.$Api.server + url} query:`, req.query);

	switch(req.method) {
		case 'POST':
			httpRequest = superAgent
				.post(config.$Api.server + url)
				.send(req.body);
			break;
		case 'PUT':
			httpRequest = superAgent
				.put(config.$Api.server + url)
				.send(req.body);
			break;
		case 'PATCH':
			httpRequest = superAgent
				.patch(config.$Api.server + url)
				.send(req.body);
			break;
		case 'DELETE':
			httpRequest = superAgent
				.delete(config.$Api.server + url)
				.send(req.body);
			break;
		case 'GET':
			httpRequest = superAgent
				.get(config.$Api.server + url)
				.query(req.query);
			break;
	}

	if (req.get('Authorization')) {
		httpRequest = httpRequest.set('Authorization', req.get('Authorization'));
	}

	httpRequest
		.set('Cookie', req.get('Cookie'))
		.end((error, respond) => {
			if (error) {
				console.error('API ERROR', e);
				res.status(500).json({Error: 'API error', message: e.message});
			}

			if (respond) {
				var settedCookies = respond.header['set-cookie'];

				if (settedCookies) {
					settedCookies.forEach((cookieString) => {
						var cookie = parseCookieString(cookieString);
						res.cookie(cookie.name, cookie.value, cookie.options);
					});
				}
				res.status(respond.status).json(respond.body);
			}
		});
};

router.all('*', function(req, res) {
	callRemoteServer(req, res);
});

module.exports = router;