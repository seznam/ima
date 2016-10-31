'use strict';

require('babel-polyfill');
require('./ima/shim.js');
require('./ima/vendor.server.js');

// Node
let cluster = require('cluster');
let path = require('path');
let os = require('os');
global.appRoot = path.resolve(__dirname);

// IMA server
let environmentConfig = require('./ima/config/environment.js');
function appFactory() {
	delete require.cache[require.resolve('./ima/app.server.js')];
	delete require.cache[require.resolve('./ima/ima.server.js')];

	require('./ima/ima.server.js')();
	require('./ima/app.server.js')();
}
let languageLoader = (language => require(`./ima/locale/${language}.js`));

let imaServer = require('ima-server')(
	environmentConfig,
	languageLoader,
	appFactory
);

let clientApp = imaServer.clientApp;
let proxy = imaServer.proxy;
let urlParser = imaServer.urlParser;
let environment = imaServer.environment;
let logger = imaServer.logger;
let cache = imaServer.cache;

// Middlewares
let favicon = require('serve-favicon');
let bodyParser = require('body-parser');
let multer = require('multer')({
	dest: path.resolve(__dirname) + '/static/uploads/'
});
let cookieParser = require('cookie-parser');
let methodOverride = require('method-override');
let compression = require('compression');
let helmet = require('helmet');

process.on('uncaughtException', (error) => {
	logger.error('Uncaught Exception:', { error });
});

process.on('unhandledRejection', (error) => {
	logger.error('Unhandled promise rejection:', { error });
});

function renderApp(req, res, next) {
	if (req.method === 'GET') {
		let cachedPage = cache.get(req);
		if (cachedPage) {
			res.status(200);
			res.send(cachedPage);

			return;
		}
	}

	clientApp
		.requestHandler(req, res)
		.then((response) => {
			// logger.info('Request handled successfully', { response: { status: number, content: string, SPA: boolean=, error: Error= } });

			if (response.error) {
				logger.error('App error', { error: response.error });
			}

			if (
				(req.method === 'GET') &&
				(response.status === 200) &&
				!response.SPA &&
				!response.error
			) {
				cache.set(req, response.content);
			}
		}, (error) => {
			// logger.error('REJECT', { error });
			next(error);
		})
		.catch((error) => {
			logger.error('Cache error', { error });
			next(error);
		});
}

function errorHandler(err, req, res, next) {
	clientApp.errorHandler(err, req, res);
}

function staticErrorPage(err, req, res, next) {
	clientApp.showStaticErrorPage(err, req, res);
}

function runNodeApp() {
	let express = require('express');
	let app = express();

	app.set('trust proxy', true);

	app.use(helmet())
		.use(compression())
		.use(favicon(path.resolve(__dirname) + '/static/img/favicon.ico'))
		.use(environment.$Server.staticFolder, express.static(path.join(__dirname, 'static')))
		.use(bodyParser.json()) // for parsing application/json
		.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
		.use(multer.fields([/*{ name: '<file input name>', maxCount: 1 }, ...*/])) // for parsing multipart/form-data
		.use(cookieParser())
		.use(methodOverride())
		.use(environment.$Proxy.path + '/', proxy)
		.use(urlParser)
		.use(renderApp)
		.use(errorHandler)
		.use(staticErrorPage)
		.listen(environment.$Server.port, () => {
			return logger.info(
				'Point your browser at http://localhost:' +
				environment.$Server.port
			);
		});
}

if (environment.$Env !== 'dev') {
	logger.level = 'warn';
}

if ((environment.$Env === 'dev') || (environment.$Server.clusters === 1)) {
	runNodeApp();
} else {
	if (cluster.isMaster) {
		let cpuCount = environment.$Server.clusters || os.cpus().length;

		// Create a worker for each CPU
		for (let i = 0; i < cpuCount; i += 1) {
			cluster.fork();
		}

		// Listen for dying workers
		cluster.on('exit', (worker) => {
			logger.warn(`Worker ${worker.id} died :(`);
			cluster.fork();
		});
	} else {
		runNodeApp();
	}
}
