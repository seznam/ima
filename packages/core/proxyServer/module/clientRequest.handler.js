var fs = require('fs');
var stackTrace = require('stack-trace');
var asyncEach = require('async-each');
var hljs = require('highlight.js');
var sep = require('path').sep;
var errorDetailsView = require('../template/error.detail.view');
var config = require('../config/environment.js');

var vendorScript = require('./vendor.server.js');
var appServerScript = require('./app.server.js');

hljs.configure({
	tabReplace: '  ',
	lineNodes: true
});

module.exports = () => {
	var _displayDetails = (err, req, res) => {
		var stack = stackTrace.parse(err);
		var fileIndex = 1;

		console.error(err.stack);

		asyncEach(stack, function getContentInfo(item, cb) {
			// exclude core node modules and node modules
			if ((item.fileName.indexOf(sep) !== -1) && !/node_modules/.test(item.fileName)) {
				fs.readFile(item.fileName, 'utf-8', function(err, content) {
					if (err) { return cb(err); }

					content = hljs.highlight('javascript', content);

					// start a few lines before the error or at the beginning of the file
					var start = Math.max(item.lineNumber - 5, 0);
					var lines = content.value.split('\n').map((line) => {
						return '<span class="line">' + line + '</span>';
					});
					// end a few lines after the error or the last line of the file
					var end = Math.min(item.lineNumber + 4, lines.length);
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
		}, function(e, items) {
			items = items.filter(function(item) { return !!item; });

			// if something bad happened while processing the stacktrace
			// make sure to return something useful
			if (e) {
				console.error(e);
				return res.send(err.stack);
			}

			res.send(errorDetailsView(err,items));
		});
	};

	var _initApp = (req, res) => {
		var language = res.locals.language;
		var dictionary = require('./locale/' + language + '.js');

		var vendor = vendorScript();
		var appServer = appServerScript();

		var ns = appServer.getNameSpace();
		var boot = ns.oc.get('$Boot');

		var bootConfig = {
			vendor: vendor,
			dictionary: {language, dictionary},
			variable: {request: req, respond: res},
			setting: {env: config.$Env, protocol: `${req.protocol}:`, language: language}
		};

		Object.assign(bootConfig, appServer.getInit());
		boot.run(bootConfig);

		return ns;
	};

	var errorHandler = (err, req, res) => {

		if (config.$Debug) {
			_displayDetails(err, req, res);
		} else {
			var ns = _initApp(req, res);
			var router = ns.oc.get('$Router');
			var params = {
				status: 500,
				error: err
			};
			router.handleError(params);
		}

	};

	var respond = (req, res) => {
		var ns = _initApp(req, res);
		var router = ns.oc.get('$Router');

		router.init({domain: res.locals.domain, mode: 'server'});

		router.route(req.url, req, res);
	};

	return {errorHandler, respond};
};