var fs = require('fs');
var stackTrace = require('stack-trace');
var asyncEach = require('async-each');
var hljs = require('highlight.js');
var sep = require('path').sep;
var errorView = require('./template/errorView.js');
var instanceRecycler = require('./instanceRecycler.js');
var helper = require('ima-helpers');
var templateProcessor = require('./templateProcessor.js');

var renderedSPAs = {};

hljs.configure({
	tabReplace: '  ',
	lineNodes: true
});

module.exports = ((environment, logger, languageLoader, appFactory) => {
	appFactory();

	var _displayDetails = (err, req, res) => {
		var stack = stackTrace.parse(err);
		var fileIndex = 1;

		logger.error('The application crashed due to an uncaught exception', { err });

		asyncEach(stack, function getContentInfo(item, cb) {
			// exclude core node modules and node modules
			if (
				(item.fileName) &&
				(item.fileName.indexOf(sep) !== -1) &&
				!/node_modules/.test(item.fileName) &&
				!/internal/.test(item.fileName)
			) {
				fs.readFile(item.fileName, 'utf-8', function(err, content) {
					if (err) {
						return cb(err);
					}

					content = hljs.highlight('javascript', content);

					// start a few lines before the error or at the beginning of the file
					var start = Math.max(item.lineNumber - 11, 0);
					var lines = content.value.split('\n').map((line) => {
						return '<span class="line">' + line + '</span>';
					});
					// end a few lines after the error or the last line of the file
					var end = Math.min(item.lineNumber + 10, lines.length);
					var snippet = lines.slice(start, end);
					// array starts at 0 but lines numbers begin with 1, so we have to
					// subtract 1 to get the error line position in the array
					var errLine = item.lineNumber - start - 1;

					snippet[errLine] = snippet[errLine].replace('<span class="line">', '<span class="line error-line">');

					item.content = snippet.join('\n');
					item.errLine = errLine;
					item.startLine = start;
					item.id = 'file-' + fileIndex;

					fileIndex++;

					cb(null, item);
				});
			} else {
				cb();
			}
		}, (e, items) => {
			if (!Array.isArray(items)) {
				items = [];
			}

			items = items.filter((item) => {
				return !!item;
			});

			// if something bad happened while processing the stacktrace
			// make sure to return something useful
			if (e) {
				logger.error('Failed to display error page', { e });
				res.send(err.stack);
			} else {
				res.send(errorView(err, items));
			}
		});
	};

	var _initApp = (req, res, appMain) => {
		var bootConfig = _getBootConfig(req, res);
		var app = instanceRecycler.getInstance();

		Object.assign(
			bootConfig,
			appMain.getInitialAppConfigFunctions(),
			appMain.ima.getInitialPluginConfig(),
			appMain.ima.getInitialImaConfigFunctions()
		);
		app.bootstrap
			.run(bootConfig);

		return app;
	};

	var showStaticErrorPage = (error, req, res) => {
		logger.error('Failed to display error page, displaying the static error page', { error });

		return new Promise((resolve, reject) => {
			fs.readFile('./build/static/html/error.html', 'utf-8', (e, content) => {
				var status = 500;
				res.status(status);

				if (e) {
					res.send('500');
					reject(e);
				}

				res.send(content);

				resolve({ content, status, error });
			});
		});
	};

	var showStaticSPAPage = (req, res) => {
		var bootConfig = _getBootConfig(req, res);
		var status = 200;

		var cacheKey = [
			bootConfig.settings.$Protocol,
			bootConfig.settings.$Language,
			bootConfig.settings.$Host,
			bootConfig.settings.$Root,
			bootConfig.settings.$LanguagePartPath
		].join('|');
		if (renderedSPAs[cacheKey]) {
			res.status(status);
			res.send(renderedSPAs[cacheKey]);

			return Promise.resolve({
				content: renderedSPAs[cacheKey],
				status,
				SPA: true
			});
		}

		return new Promise((resolve, reject) => {
			fs.readFile('./build/static/html/spa.html', 'utf-8', (error, content) => {
				if (error) {
					showStaticErrorPage(error, req, res);
					reject(error);
				} else {
					content = templateProcessor(content, bootConfig.settings);

					renderedSPAs[cacheKey] = content;

					res.status(status);
					res.send(content);

					resolve({ content, status, SPA: true, error: null });
				}
			});
		});
	};

	var _haveToServeSPA = (req, app) => {
		var userAgent = req.headers['user-agent'] || '';
		var isAllowedServeSPA = environment.$Server.serveSPA.allow;
		var isServerBusy = instanceRecycler.isReachToMaxConcurrencyRequests();
		var isAllowedUserAgent = !environment.$Server.serveSPA.blackListReg.test(userAgent);
		var canBeRouteServeAsSPA = true;
		var routeInfo = _getRouteInfo(app);

		if (routeInfo && routeInfo.route.getOptions().serveSPA === false) {
			canBeRouteServeAsSPA = false;
		}

		return isAllowedServeSPA && isServerBusy && isAllowedUserAgent && canBeRouteServeAsSPA;
	};

	var _getBootConfig = (req, res) => {
		var language = res.locals.language;
		var languagePartPath = res.locals.languagePartPath;
		var host = res.locals.host;
		var root = res.locals.root;
		var protocol = res.locals.protocol;

		var dictionary = languageLoader(language);

		var bootConfig = {
			services: {
				request: req,
				response: res,
				$IMA: {},
				dictionary: {
					$Language: language,
					dictionary: dictionary
				},
				router: {
					$Protocol: protocol,
					$Host: host,
					$Root: root,
					$LanguagePartPath: languagePartPath
				}
			},
			settings: {
				$Debug: environment.$Debug,
				$Env: environment.$Env,
				$Version: environment.$Version,
				$App: environment.$App || {},
				$Protocol: protocol,
				$Language: language,
				$Host: host,
				$Root: root,
				$LanguagePartPath: languagePartPath
			}
		};

		return bootConfig;
	};

	var _applyError = (error, req, res, app) => {
		var promise = Promise.reject(error);

		try {
			promise = app.oc.get('$Router')
				.handleError({ error })
				.then((response) => {
					instanceRecycler.clearInstance(app);

					return response;
				})
				.catch((fatalError) => {
					showStaticErrorPage(fatalError, req, res);
					instanceRecycler.clearInstance(app);

					return Promise.reject(fatalError);
				});
		} catch (e) {
			showStaticErrorPage(e, req, res);
			instanceRecycler.clearInstance(app);
			promise = Promise.reject(e);
		}

		return promise;
	};

	var _applyNotFound = (error, req, res, app) => {
		var promise = Promise.reject(error);

		try {
			promise = app.oc.get('$Router')
				.handleNotFound({ error })
				.then((response) => {
					instanceRecycler.clearInstance(app);

					return response;
				})
				.catch((error) => {
					return _applyError(error, req, res, app);
				});
		} catch (e) {
			promise = _applyError(e, req, res, app);
		}

		return promise;
	};

	var _applyRedirect = (error, req, res, app) => {
		var promise = Promise.reject(error);

		try {
			app.oc.get('$Router').redirect(error.getParams().url, { httpStatus: error.getHttpStatus() });
			instanceRecycler.clearInstance(app);
			promise = Promise.resolve({
				content: null,
				status: error.getHttpStatus(),
				error: error
			});
		} catch (e) {
			promise = _applyError(e, req, res, app);
		}

		return promise;
	};

	var _importAppMain = () => {
		return $IMA.Loader
			.import('app/main')
			.then((appMain) => {
				if (!instanceRecycler.isInitialized()) {
					instanceRecycler.init(appMain.ima.createImaApp, environment.$Server.concurrency);
				}

				return appMain;
			});
	};

	var errorHandler = (error, req, res, app) => {
		var returnPromise = Promise.reject(error);

		if (environment.$Debug) {

			if (app) {
				instanceRecycler.clearInstance(app);
			}

			_displayDetails(error, req, res);
		} else {
			var appPromise = Promise.resolve(app);

			if (!app) {
				appPromise = _importAppMain()
					.then((appMain) => {
						return _initApp(req, res, appMain);
					});
			}

			returnPromise = appPromise
				.then((app) => {
					var router = app.oc.get('$Router');
					app.oc.get('$Cache').clear();

					if (router.isClientError(error)) {
						return _applyNotFound(error, req, res, app);
					} else if (router.isRedirection(error)) {
						return _applyRedirect(error, req, res, app);
					} else {
						return _applyError(error, req, res, app);
					}
				})
				.catch((e) => {
					showStaticErrorPage(e, req, res);

					instanceRecycler.clearInstance(app);
					returnPromise = Promise.reject(e);
				});
		}

		return returnPromise;
	};

	var _getRouteInfo = (app) => {
		var router = app.oc.get('$Router');
		var routeInfo = null;

		try {
			routeInfo = router.getCurrentRouteInfo();
		} catch (e) {}

		return routeInfo;
	}

	var _addRouteInformationToResponse = (req, res, app) => {
		var routeName = 'other';
		var routeInfo = _getRouteInfo(app);

		if (routeInfo) {
			routeName = routeInfo.route.getName();
		}

		res.$IMA = res.$IMA || { routeName };
	};

	var _generateResponse = (req, res, app) => {
		var returnPromise = Promise.reject(new Error());
		var router = app.oc.get('$Router');

		try {
			returnPromise = router
				.route(router.getPath())
				.then((response) => {
					instanceRecycler.clearInstance(app);

					return response;
				})
				.catch((error) => {
					return errorHandler(error, req, res, app);
				});
		} catch (e) {
			returnPromise = errorHandler(e, req, res, app);
		}

		return returnPromise;
	};

	var requestHandler = (req, res) => {
		if (environment.$Env === 'dev') {
			appFactory();
			instanceRecycler.clear();
		}

		return _importAppMain()
			.then((appMain) => {
				var app = _initApp(req, res, appMain);
				_addRouteInformationToResponse(req, res, app);

				if (_haveToServeSPA(req, app)) {
					instanceRecycler.clearInstance(app);
					return showStaticSPAPage(req, res);
				}

				return _generateResponse(req, res, app);
			});
	};

	return {
		errorHandler,
		requestHandler,
		showStaticErrorPage,
		showStaticSPAPage
	};
});
