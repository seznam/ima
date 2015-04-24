require('./imajs/shim.js');

var path = require('path');
global.appRoot = path.resolve(__dirname);
var express = require('express');
var favicon = require('serve-favicon');
var clientApp = require('./imajs/clientApp.js');
var proxy = require('./imajs/proxy.js');
var urlParser = require('./imajs/urlParser.js');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var environment = require('./imajs/environment.js');

var app = express();

process.on('uncaughtException', function(error) {
	console.error('Uncaught Exception:', error.message, error.stack);
});

var allowCrossDomain = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

	if (req.method === 'OPTIONS') {
		res.send();
	} else {
		next();
	}
};

var renderApp = (req, res) => {
	clientApp.response(req, res);
};

var errorHandler = (err, req, res, next) => {
	clientApp.errorHandler(err, req, res);
};

var staticErrorPage = (err, req, res, next) => {
	clientApp.showStaticErrorPage(err, req, res);
};

app.use(favicon(__dirname + '/static/img/favicon.ico'))
	.use(environment.$Server.staticFolder, express.static(path.join(__dirname, 'static')))
	.use(bodyParser.json()) // for parsing application/json
	.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
	.use(multer()) // for parsing multipart/form-data
	.use(cookieParser())
	.use(methodOverride())
	.use(allowCrossDomain)
	.use(environment.$Server.apiUrl + '/', proxy)
	.use(urlParser)
	.use(renderApp)
	.use(errorHandler)
	.use(staticErrorPage)
	.listen(environment.$Server.port, function() {
		return console.log('Point your browser at http://localhost:' + environment.$Server.port);
	});
