var fs = require('fs');
var stackTrace = require('stack-trace');
var asyncEach = require('async-each');
var hljs = require('highlight.js');
var sep = require('path').sep;
var errorView = require('./template/errorView.js');
var environment = require('./environment.js');
var instanceRecycler = require('./instanceRecycler.js');

var vendorScript = require('./vendor.server.js');
var appServerScript = require('./app.server.js');

var vendor = vendorScript();
var appServer = appServerScript();

hljs.configure({
	tabReplace: '  ',
	lineNodes: true
});

instanceRecycler.init(appServer.createIMAJsApp, environment.$Server.concurency);

module.exports = (() => {
	var _displayDetails = (err, req, res) => {
		var stack = stackTrace.parse(err);
		var fileIndex = 1;

		console.error('Stack: ',err.stack);
		console.error('Params: ', err._params);


		asyncEach(stack, function getContentInfo(item, cb) {
			// exclude core node modules and node modules
			if ((item.fileName.indexOf(sep) !== -1) && !/node_modules/.test(item.fileName)) {
				fs.readFile(item.fileName, 'utf-8', function(err, content) {
					if (err) { return cb(err); }

					content = hljs.highlight('javascript', content);

					// start a few lines before the error or at the beginning of the file
					var start = Math.max(item.lineNumber - 7, 0);
					var lines = content.value.split('\n').map((line) => {
						return '<span class="line">' + line + '</span>';
					});
					// end a few lines after the error or the last line of the file
					var end = Math.min(item.lineNumber + 6, lines.length);
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
			items = items.filter((item) => { return !!item; });

			// if something bad happened while processing the stacktrace
			// make sure to return something useful
			if (e) {
				console.error(e);
				return res.send(err.stack);
			}

			res.send(errorView(err,items));
		});
	};

	var _initApp = (req, res) => {
		var language = res.locals.language;
		var languagePartPath = res.locals.languagePartPath;
		var domain = res.locals.domain;
		var root = res.locals.root;
		var protocol = res.locals.protocol;

		var dictionary = require('./locale/' + language + '.js');

		//var app = appServer.createIMAJsApp();
		var app = instanceRecycler.getInstance();

		var bootConfig = {
			vendor: vendor,
			services: {
				request: req,
				response: res,
				dictionary: {
					$Language: language,
					dictionary: dictionary
				},
				router: {
					$Protocol: protocol,
					$Domain: domain,
					$Root: root,
					$LanguagePartPath: languagePartPath
				}
			},
			settings: {
				$Env: environment.$Env,
				$Protocol: protocol,
				$Language: language,
				$Domain: domain,
				$Root: root,
				$LanguagePartPath: languagePartPath
			}
		};

		Object.assign(bootConfig, appServer.getInit());
		app.bootstrap
			.run(bootConfig);

		return app;
	};

	var showStaticErrorPage = (err, req, res) => {
		console.log(err);

		fs.readFile('./build/static/html/error.html', 'utf-8', (error, content) => {
			res.status(500)

			if (error) {
				res.send('500');
			}
			res.send(content);
		});
	};

	var errorHandler = (err, req, res, app) => {

		if (environment.$Debug) {
			_displayDetails(err, req, res);
		} else {

			if (!app) {
				app = _initApp(req, res);
			}
			var router = app.oc
				.get('$Router');

			var applyError = (error) => {
				return (
					router
						.handleError(error)
						.then(() => {
							instanceRecycler.clearInstance(app);
						})
						.catch((fatalError) => {
							instanceRecycler.clearInstance(app);
							showStaticErrorPage(fatalError, req, res);
						})
				);
			};

			if (router.isClientError(err)) {
				router
					.handleNotFound(err)
					.then(() => {
						instanceRecycler.clearInstance(app);
					})
					.catch((error) => {
						applyError(error);
					});
			} else if (router.isRedirection(err)) {
				router
					.redirect(err.getParams().url)
					.then(() => {
						instanceRecycler.clearInstance(app);
					})
					.catch((error) => {
						applyError(error);
					})
			} else {
				applyError(err);
			}
		}
	};

	var response = (req, res) => {
		var app = _initApp(req, res);
		var router = app.oc
			.get('$Router');

		router
			.route(router.getPath())
			.then(() => {
				instanceRecycler.clearInstance(app);
			})
			.catch((error) => {
				errorHandler(error, req, res, app);
			});
	};

	return {errorHandler, response, showStaticErrorPage};
})();