var express = require('express');
var superAgent = require('superagent');

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

var sendJSONResponse = (req, res, error, response) => {
	var status = 0;
	var body = { Error: 'API error' };
	var text = '';

	if (error) {
		status = error.status || 500;
		text = error.response.text;
	}

	if (!error && response) {
		status = response.status || 200;
		body = response.body;
		text= response.text;
	}

	if ((!body || typeof body === 'object' && Object.keys(body).length === 0) &&
		typeof(text) === 'string' && response.text !== '') {
		try {
			logger.warn('API sent bad header of content-type. More info how you can to fix it: http://visionmedia.github.io/superagent/#parsing-response bodies');
			body = JSON.parse(response.text);
		} catch (error) {
			logger.error('API response is invalid JSON.', { error });
			body = {};
		}
	}

	res.status(status).json(body);
}


module.exports = (environment, logger) => {

	return (proxyServer) => {
		var router = express.Router();

		var _callRemoteServer = (req, res) => {
			var url = req.url;

			if ((req.url.length >= 1) && (req.url[req.url.length-1] === '/')) {
				url = url.substr(0, url.length - 1);
			}

			var proxyUrl = proxyServer + url;

			logger.log('debug', `API proxy: ${req.method} ${proxyUrl} query: ` + JSON.stringify(req.query));

			var httpRequest = createHttpRequest(req.method, proxyUrl, req.body);
			httpRequest = setCommonRequestHeaders(httpRequest, req.headers);

			if (req.get('Cookie') && req.get('Cookie') !== '') {
				httpRequest = httpRequest.set('Cookie', req.get('Cookie'));
			}

			httpRequest
				.end((error, response) => {
					if (error) {
						logger.error(`API ERROR: ${req.method} ${proxyUrl} query: ` + JSON.stringify(req.query), { error });

						sendJSONResponse(req, res, error, response);
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

						sendJSONResponse(req, res, error, response);
					}
				});
		};

		router.all('*', function(req, res) {
			_callRemoteServer(req, res);
		});

		return router;
	}
};

module.exports.parseSetCookieHeader = parseSetCookieHeader;
module.exports.firstLetterToLowerCase = firstLetterToLowerCase;
module.exports.firstLetterToUpperCase = firstLetterToUpperCase;
module.exports.createHttpRequest = createHttpRequest;
module.exports.setCommonRequestHeaders = setCommonRequestHeaders;
