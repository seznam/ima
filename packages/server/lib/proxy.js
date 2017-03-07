const express = require('express');
const fs = require('fs');
const superAgent = require('superagent');

function firstLetterToLowerCase(world) {
	return world.charAt(0).toLowerCase() + world.slice(1);
}

function firstLetterToUpperCase(world) {
	return world.charAt(0).toUpperCase() + world.slice(1);
}

function parseSetCookieHeader(cookieString) {
	let cookiePairs = cookieString.split('; ');

	let cookieName = null;
	let cookieValue = null;
	let cookieOptions = {
		path: '/',
		secure: false,
		expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
		httpOnly: false,
		'max-Age': null
	};

	cookiePairs.forEach(pair => {
		let separatorIndexEqual = pair.indexOf('=');
		let name = decodeURIComponent(
			firstLetterToLowerCase(pair.substr(0, separatorIndexEqual)).trim()
		);
		let value = decodeURIComponent(
			pair.substr(separatorIndexEqual + 1).trim()
		);

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

function createHttpRequest(method, proxyUrl, clientRequest) {
	let httpRequest = null;
	let body = clientRequest.body;

	switch (method) {
		case 'POST':
			httpRequest = superAgent.post(proxyUrl);
			let contentType = clientRequest.get('Content-Type');

			if (/^multipart\/form-data;\s+/i.test(contentType)) {
				for (let fieldName of Object.keys(body)) {
					httpRequest.field(fieldName, body[fieldName]);
				}

				for (let fieldName of Object.keys(clientRequest.files || {})) {
					let files = clientRequest.files[fieldName];
					for (let file of files) {
						let { fieldname, path, originalname } = file;
						httpRequest.attach(fieldname, path, originalname);
					}
				}
			} else {
				httpRequest.send(body);
			}
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
		default:
			console.warn(`Unknown HTTP request method: ${method}`);
			break;
	}

	return httpRequest;
}

function setCommonRequestHeaders(httpRequest, headers) {
	Object
		.keys(headers)
		.filter((key) => {
			return !['host', 'Cookie'].includes(key);
		})
		.forEach((header) => {
			httpRequest.set(header, headers[header]);
		});

	return httpRequest;
}

function cleanUpRequest(clientRequest) {
	if (clientRequest.method !== 'POST') {
		return;
	}

	let contentType = clientRequest.get('Content-Type');
	if (!/^multipart\/form-data;\s+/i.test(contentType)) {
		return;
	}

	for (let fieldName of Object.keys(clientRequest.files || {})) {
		for (let { path } of clientRequest.files[fieldName]) {
			fs.unlink(path, () => {});
		}
	}
}

module.exports = (environment, logger) => {

	function getResponseData(error, response) {
		let status = 0;
		let body = {};
		let text = '';

		if (error) {
			status = error.status || 500;
			body = error.response.body || {};
			text = error.response.text;
		}

		if (!error && response) {
			status = response.status || 200;
			body = response.body;
			text = response.text;
		}

		if (
			(
				!body ||
				typeof body === 'object' &&
				Object.keys(body).length === 0
			) &&
			typeof(text) === 'string' &&
			text !== ''
		) {
			try {
				logger.warn(
					'The API sent invalid Content-Type header. More info ' +
					'about how you can to fix this: ' +
					'http://visionmedia.github.io/superagent/#parsing-response ' +
					'bodies'
				);
				body = JSON.parse(text);
			} catch (error) {
				logger.error('API response is invalid JSON.', { error });
				body = {};
			}
		}

		return { status, body };
	}

	function sendJSONResponse(req, res, error, response) {
		let { status, body } = getResponseData(error, response);

		if (!Object.keys(body).length) {
			body = { Error: 'API error' };
		}

		res.status(status).json(body);
	}


	return (proxyServer) => {
		let router = express.Router();

		let _callRemoteServer = (req, res) => {
			let url = req.url;

			if (url.length && (url[url.length - 1] === '/')) {
				url = url.substr(0, url.length - 1);
			}

			let proxyUrl = proxyServer + url;

			logger.log(
				'debug',
				`API proxy: ${req.method} ${proxyUrl} query: ` +
				JSON.stringify(req.query)
			);

			let httpRequest = createHttpRequest(req.method, proxyUrl, req);
			httpRequest = setCommonRequestHeaders(httpRequest, req.headers);

			if (req.get('Cookie') && req.get('Cookie') !== '') {
				httpRequest = httpRequest.set('Cookie', req.get('Cookie'));
			}

			httpRequest
				.end((error, response) => {
					cleanUpRequest(req);

					if (error) {
						logger.error(
							`API ERROR: ${req.method} ${proxyUrl} query: ` +
							JSON.stringify(req.query),
							{ error }
						);

						sendJSONResponse(req, res, error, response);
					} else if (response) {
						let hasSetCookies = response.header['set-cookie'];

						Object
							.keys(response.header)
							.filter(key => {
								return ![
									'set-cookie',
									'content-encoding',
									'content-type',
									'content-length',
									'transfer-encoding'
								].includes(key);
							})
							.map(key => ({
								headerName: key
										.split('-')
										.map(firstLetterToUpperCase)
										.join('-'),
								key: key
							}))
							.forEach(item => {
								res.set(
									item.headerName,
									response.header[item.key]
								);
							});

						if (hasSetCookies) {
							hasSetCookies.forEach((cookieString) => {
								let cookie = parseSetCookieHeader(cookieString);
								res.cookie(
									cookie.name,
									cookie.value,
									cookie.options
								);
							});
						}

						sendJSONResponse(req, res, error, response);
					}
				});
		};

		router.all('*', (req, res) => {
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
