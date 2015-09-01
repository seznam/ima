var express = require('express');
var router = express.Router();
var superAgent = require('superagent');
var environment = require('./environment.js');

var firstLetterToLowerCase = (world) => {
	return world.charAt(0).toLowerCase() + world.slice(1);
};

var firstLetterToUpperCase = (world) => {
	return world.charAt(0).toUpperCase() + world.slice(1);
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

	var proxyUrl = environment.$Proxy.server + url;

	console.log(`API: ${req.method} ${proxyUrl} query:`, req.query);

	switch(req.method) {
		case 'POST':
			httpRequest = superAgent
				.post(proxyUrl)
				.send(req.body);
			break;
		case 'PUT':
			httpRequest = superAgent
				.put(proxyUrl)
				.send(req.body);
			break;
		case 'PATCH':
			httpRequest = superAgent
				.patch(proxyUrl)
				.send(req.body);
			break;
		case 'DELETE':
			httpRequest = superAgent
				.del(proxyUrl)
				.send(req.body);
			break;
		case 'GET':
			httpRequest = superAgent
				.get(proxyUrl)
				.query(req.query);
			break;
	}

	Object
		.keys(req.headers)
		.filter((key) => {
			return ['host', 'Cookie'].indexOf(key) === -1;
		})
		.forEach((key) => {
			httpRequest.set(key, req.headers[key]);
		});

	if (req.get('Cookie') && req.get('Cookie') !== '') {
		httpRequest = httpRequest.set('Cookie', req.get('Cookie'));
	}

	httpRequest
		.end((error, response) => {
			if (error) {
				console.error('API ERROR', error);
				res.status(error.status || 500).json({Error: 'API error', message: error.message});
			} else if (response) {
				var settedCookies = response.header['set-cookie'];

				Object
					.keys(response.header)
					.filter((key) => {
						return ['set-cookie', 'content-encoding'].indexOf(key) === -1;
					})
					.map((key) => {
						return ({
							headerName: key
									.split('-')
									.map(firstLetterToUpperCase)
									.join('-'),
							key: key
						});
					})
					.forEach((item) => {
						res.set(item.headerName, response.header[item.key]);
					});

				if (settedCookies) {
					settedCookies.forEach((cookieString) => {
						var cookie = parseCookieString(cookieString);
						res.cookie(cookie.name, cookie.value, cookie.options);
					});
				}

				res.status(response.status).json(response.body);
			}
		});
};

router.all('*', function(req, res) {
	callRemoteServer(req, res);
});

module.exports = router;