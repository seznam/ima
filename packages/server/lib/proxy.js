var express = require('express');
var router = express.Router();
var superAgent = require('superagent');
var environment = require('./environment.js');
var logger = require('./logger.js');

var firstLetterToLowerCase = (world) => {
	return world.charAt(0).toLowerCase() + world.slice(1);
};

var firstLetterToUpperCase = (world) => {
	return world.charAt(0).toUpperCase() + world.slice(1);
};

var parseSetCookieHeader = (cookieString) => {
	var cookiePairs = cookieString.split('; ');

	var cookieName = null;
	var cookieValue = null;
	var cookieOptions = {
		path: '/',
		secure: false,
		expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
		httpOnly: false,
		'max-Age': null
	};

	cookiePairs.forEach((pair) => {
		var separatorIndexEqual =  pair.indexOf('=');
		var name = decodeURIComponent(firstLetterToLowerCase(pair.substr(0, separatorIndexEqual)).trim());
		var value = decodeURIComponent(pair.substr(separatorIndexEqual + 1).trim());

		if (name === '') {
			name = firstLetterToLowerCase(value);
			value = true;
		}

		if (cookieOptions.hasOwnProperty(name)) {

			if (name === 'expires') {
				cookieOptions[name] = new Date(value);
			} else {
				cookieOptions[name] = value;
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
}

var createHttpRequest = (method, proxyUrl, body) => {
	var httpRequest = null;

	switch(method) {
		case 'POST':
			httpRequest = superAgent
				.post(proxyUrl)
				.send(body);
			break;
		case 'PUT':
			httpRequest = superAgent
				.put(proxyUrl)
				.send(body);
			break;
		case 'PATCH':
			httpRequest = superAgent
				.patch(proxyUrl)
				.send(body);
			break;
		case 'DELETE':
			httpRequest = superAgent
				.del(proxyUrl)
				.send(body);
			break;
		case 'GET':
			httpRequest = superAgent
				.get(proxyUrl);
			break;
	};

	return httpRequest;
};

var setCommonRequestHeaders = (httpRequest, headers) => {
	Object
		.keys(headers)
		.filter((key) => {
			return ['host', 'Cookie'].indexOf(key) === -1;
		})
		.forEach((header) => {
			httpRequest.set(header, headers[header]);
		});

	return httpRequest;
};


module.exports = (environment, logger) => {

	var _callRemoteServer = (req, res) => {
		var url = req.url;

		if ((req.url.length > 1) && (req.url[req.url.length-1] === '/')) {
			url = url.substr(0, url.length - 1);
		}

		var proxyUrl = environment.$Proxy.server + url;

		logger.info(`API proxy: ${req.method} ${proxyUrl} query: ` + JSON.stringify(req.query));

		var httpRequest = createHttpRequest(req.method, proxyUrl, req.body);
		httpRequest = setCommonRequestHeaders(httpRequest, req.headers);

		if (req.get('Cookie') && req.get('Cookie') !== '') {
			httpRequest = httpRequest.set('Cookie', req.get('Cookie'));
		}

		httpRequest
			.end((error, response) => {
				if (error) {
					logger.error(`API ERROR: ${req.method} ${proxyUrl} query: ` + JSON.stringify(req.query), { error });
					res.status(error.status || 500).json({Error: 'API error', message: error.message});
				} else if (response) {
					var settedCookies = response.header['set-cookie'];

					Object
						.keys(response.header)
						.filter((key) => {
							return ['set-cookie', 'content-encoding', 'content-type', 'content-length', 'transfer-encoding'].indexOf(key) === -1;
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
							var cookie = parseSetCookieHeader(cookieString);
							res.cookie(cookie.name, cookie.value, cookie.options);
						});
					}

					var result = response.body;
					if ((!result || typeof result === 'object' && Object.keys(result).length === 0) &&
						typeof(response.text) === 'string' && response.text !== '') {
						try {
							console.warn('API sent bad header of content-type. More info how you can to fix it: http://visionmedia.github.io/superagent/#parsing-response bodies');
							result = JSON.parse(response.text);
						} catch (e) {
							console.error('API response is invalid JSON.', { err });
							result = {};
						}
					}

					res.status(response.status).json(result);
				}
			});
	};

	router.all('*', function(req, res) {
		_callRemoteServer(req, res);
	});

	return router;
};

module.exports.parseSetCookieHeader = parseSetCookieHeader;
module.exports.firstLetterToLowerCase = firstLetterToLowerCase;
module.exports.firstLetterToUpperCase = firstLetterToUpperCase;
module.exports.createHttpRequest = createHttpRequest;
module.exports.setCommonRequestHeaders = setCommonRequestHeaders;
