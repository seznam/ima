var config = require('../config/environment.js');

var getUrlFromRequest = (req) => {
	return  '//' + req.get('host') + req.originalUrl.replace(/\/$/, '');
};

var isDomainSame = (currentDomain, domainExpression) => {
	return currentDomain === domainExpression;
};

var getRootRegExp = (domainExpression, rootExpression, languageParam) => {
	var rootReg = '\/\/' + domainExpression.replace(':', '\:') + rootExpression.replace('/','\/');

	if (languageParam) {
		if (languageParam) {
			var build = require('../../app/build.js');
			var languagesExpr = build.languages.join('|');
			rootReg += '(\/('+languagesExpr+'))?';
		}
	}
	rootReg += '.*$';

	return new RegExp(rootReg);
};

module.exports = function(req, res, next) {
	var parseUrlReg = /^.*\/\/([^\/]*)((?:\/[^\/:]+)*)?(\/\:language)?$/;
	var currentUrl = getUrlFromRequest(req);
	var parsedCurrentUrl = currentUrl.match(parseUrlReg);

	var currentLanguage = null;
	var currentLanguagePartPath = '';
	var currentDomain = parsedCurrentUrl[1];
	var currentRoot = parsedCurrentUrl[2];

	for (var expression of Object.keys(config.$Language)) {
		var parsedDomainExpression = expression.match(parseUrlReg);
		var domainExpression = parsedDomainExpression[1] || '';
		var rootExpression = parsedDomainExpression[2] || '';
		var languageInPath = parsedDomainExpression[3];

		if (isDomainSame(currentDomain, domainExpression)) {

			var rootRegExp = getRootRegExp(domainExpression, rootExpression, languageInPath);

			if (rootRegExp.test(currentUrl)) {
				currentRoot = rootExpression;

				if (languageInPath) {
					var matchedLanguage = currentUrl.match(rootRegExp);

					currentLanguagePartPath = matchedLanguage[1];
					currentLanguage = matchedLanguage[2];

					if (!currentLanguage) {
		              	currentLanguagePartPath = '/'+config.$Language[expression];
		              	currentLanguage = config.$Language[expression];

		              	// REDIRECT
		              	res.redirect(req.protocol + '://'+currentDomain+currentRoot+currentLanguagePartPath);
		              	return;
		              }
				} else {
					currentLanguage = config.$Language[expression];
				}

				break;
			}
		}
	}

	res.locals.language = currentLanguage;
	res.locals.languagePartPath = currentLanguagePartPath;
	res.locals.domain = currentDomain;
	res.locals.protocol = req.protocol + ':';
	res.locals.root = currentRoot;

	//res.send(`${currentUrl} : ${currentDomain} : ${currentRoot} : ${currentLanguage} : ${currentLanguagePartPath} : ${req.get('origin')} : ${req.hostname}`);

	if (!currentLanguage && config.$Debug === true) {
		throw new Error(`You have undefined domain. Set current domain "${currentDomain}" to attribute $Language in environment.js.`);
	}

	next();
};