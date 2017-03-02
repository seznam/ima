'use strict';

module.exports = environment => {

	function _getHost(req) {
		let forwardedHost = req.get('X-Forwarded-Host');
		let host = req.get('host');

		if (forwardedHost) {
			host = forwardedHost;
		}

		return host;
	}

	function _getUrlFromRequest(req) {
		return  '//' + _getHost(req) + req.originalUrl.replace(/\/$/, '');
	}

	function _isHostSame(currentHost, hostExpression) {
		return currentHost === hostExpression;
	}

	function _getRootRegExp(hostExpression, rootExpression, languageParam) {
		let rootReg = '\/\/' +
				hostExpression.replace(/[\\.+*?\^$\[\](){}\/\'#]/g, '\\$&') +
				rootExpression.replace('/','\/');

		if (languageParam) {
			let build = require('../../app/build.js');
			let languagesExpr = build.languages.join('|');
			rootReg += '(\/('+languagesExpr+'))?';
		}
		rootReg += '.*$';

		return new RegExp(rootReg);
	}

	function _getProtocolFromForwardedHeader(req) {
		let forwardedHeader = req.get('Forwarded');
		let protocol = null;

		if (forwardedHeader) {
			let parts = forwardedHeader.split(';');

			for (let part of parts) {
				if (part.startsWith('proto=')) {
					protocol = part.substring(6);
					break;
				}
			}
		}

		return protocol;
	}

	function _getProtocolFromXForwardedProtoHeader(req) {
		let forwardedProtocol = req.get('X-Forwarded-Proto');
		let protocol = null;

		if (forwardedProtocol) {
			protocol = forwardedProtocol;
		}

		return protocol;
	}

	function _getProtocolFromFrontEndHttpsHeader(req) {
		let httpsHeader = req.get('Front-End-Https');
		let protocol = null;

		if (httpsHeader) {
			protocol = (httpsHeader.toLowerCase() === 'on') ? 'https' : 'http';
		}

		return protocol;
	}

	function _getProtocol(req) {
		let protocol = _getProtocolFromForwardedHeader(req) ||
				_getProtocolFromXForwardedProtoHeader(req) ||
				_getProtocolFromFrontEndHttpsHeader(req) ||
				req.protocol;

		return protocol + ':';
	}

	function parseUrl(req, res, next) {
		let parseUrlReg = /^.*\/\/([^\/]*)((?:\/[^\/:]+)*)?(\/\:language)?$/;
		let currentUrl = _getUrlFromRequest(req);
		let parsedCurrentUrl = currentUrl.match(parseUrlReg);

		let currentLanguage = null;
		let currentLanguagePartPath = '';
		let currentHost = parsedCurrentUrl[1];
		let currentRoot = parsedCurrentUrl[2];
		let currentProtocol = _getProtocol(req);

		for (let expression of Object.keys(environment.$Language)) {
			let parsedDomainExpression = expression.match(parseUrlReg);

			let hostExpression = parsedDomainExpression[1] === '*:*' ?
				currentHost : parsedDomainExpression[1] || '';
			let rootExpression = parsedDomainExpression[2] || '';
			let languageInPath = parsedDomainExpression[3];

			if (_isHostSame(currentHost, hostExpression)) {

				let rootRegExp = _getRootRegExp(
					hostExpression,
					rootExpression,
					languageInPath
				);

				if (rootRegExp.test(currentUrl)) {
					currentRoot = rootExpression;

					if (languageInPath) {
						let matchedLanguage = currentUrl.match(rootRegExp);

						currentLanguagePartPath = matchedLanguage[1];
						currentLanguage = matchedLanguage[2];

						if (!currentLanguage) {
							currentLanguagePartPath =
									'/' + environment.$Language[expression];
							currentLanguage = environment.$Language[expression];

							// REDIRECT
							res.redirect(
								currentProtocol +
								'//' +
								currentHost +
								currentRoot +
								currentLanguagePartPath
							);
							return;
						}
					} else {
						currentLanguage = environment.$Language[expression];
					}

					break;
				}
			}
		}

		res.locals.language = currentLanguage;
		res.locals.languagePartPath = currentLanguagePartPath;
		res.locals.host = currentHost;
		res.locals.protocol = currentProtocol;
		res.locals.root = currentRoot;

		//res.send(`${currentUrl} : ${currentHost} : ${currentRoot} : ${currentLanguage} : ${currentLanguagePartPath} : ${req.get('origin')} : ${req.hostname}`);

		if (!currentLanguage) {
			throw new Error(`You have undefined language. Set current domain "//${currentHost}" or "//*:*" to attribute $Language in environment.js.`);
		}

		next();
	}

	return parseUrl;
};
