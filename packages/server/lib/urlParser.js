'use strict';

module.exports = (environment) => {

	var _getHost = (req) => {
		let forwardedHost = req.get('X-Forwarded-Host');
		let host = req.get('host');

		if (forwardedHost) {
			host = forwardedHost;
		}

		return host;
	};

	var _getUrlFromRequest = (req) => {
		return  '//' + _getHost(req) + req.originalUrl.replace(/\/$/, '');
	};

	var _isHostSame = (currentHost, hostExpression) => {
		return currentHost === hostExpression;
	};

	var _getRootRegExp = (hostExpression, rootExpression, languageParam) => {
		var rootReg = '\/\/' +
					hostExpression.replace(/[\\.+*?\^$\[\](){}\/\'#]/g, '\\$&') +
					rootExpression.replace('/','\/');

		if (languageParam) {
			let build = require('../../app/build.js');
			let languagesExpr = build.languages.join('|');
			rootReg += '(\/('+languagesExpr+'))?';
		}
		rootReg += '.*$';

		return new RegExp(rootReg);
	};

	var _getProtocolFromForwardedHeader = (req) => {
		let forwardedHeader = req.get('Forwarded');
		let protocol = null;

		if (forwardedHeader) {
			let parts = forwardedHeader.split(';');

			for (let part of parts) {

				if (part.substring(0, 6) === 'proto=') {
					protocol = part.substring(6);
					break;
				}
			}
		}

		return protocol;
	};

	var _getProtocolFromXForwardedProtoHeader = (req) => {
		let forwardedProtocol = req.get('X-Forwarded-Proto');
		let protocol = null;

		if (forwardedProtocol) {
			protocol = forwardedProtocol;
		}

		return protocol;
	};

	var _getProtocolFromFrontEndHttpsHeader = (req) => {
		let httpsHeader = req.get('Front-End-Https');
		let protocol = null;

		if (httpsHeader) {
			protocol = (httpsHeader.toLowerCase() === 'on') ? 'https' : 'http';
		}

		return protocol;
	};

	var _getProtocol = (req) => {
		let protocol = _getProtocolFromForwardedHeader(req) ||
				_getProtocolFromXForwardedProtoHeader(req) ||
				_getProtocolFromFrontEndHttpsHeader(req) ||
				req.protocol;

		return protocol + ':';
	};

	var parseUrl = (req, res, next) => {
		var parseUrlReg = /^.*\/\/([^\/]*)((?:\/[^\/:]+)*)?(\/\:language)?$/;
		var currentUrl = _getUrlFromRequest(req);
		var parsedCurrentUrl = currentUrl.match(parseUrlReg);

		var currentLanguage = null;
		var currentLanguagePartPath = '';
		var currentHost = parsedCurrentUrl[1];
		var currentRoot = parsedCurrentUrl[2];
		var currentProtocol = _getProtocol(req);

		for (var expression of Object.keys(environment.$Language)) {
			var parsedDomainExpression = expression.match(parseUrlReg);

			var hostExpression = parsedDomainExpression[1] === '*:*' ? currentHost : parsedDomainExpression[1] || '';
			var rootExpression = parsedDomainExpression[2] || '';
			var languageInPath = parsedDomainExpression[3];

			if (_isHostSame(currentHost, hostExpression)) {

				var rootRegExp = _getRootRegExp(hostExpression, rootExpression, languageInPath);

				if (rootRegExp.test(currentUrl)) {
					currentRoot = rootExpression;

					if (languageInPath) {
						var matchedLanguage = currentUrl.match(rootRegExp);

						currentLanguagePartPath = matchedLanguage[1];
						currentLanguage = matchedLanguage[2];

						if (!currentLanguage) {
							currentLanguagePartPath = '/'+environment.$Language[expression];
							currentLanguage = environment.$Language[expression];

							// REDIRECT
							res.redirect(currentProtocol + '//'+currentHost+currentRoot+currentLanguagePartPath);
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
