require('./module/shim.js');

var path = require('path');
global.appRoot = path.resolve(__dirname);
var express = require('express');
var favicon = require('serve-favicon');
var clientApp = require('./module/clientRequest.handler.js');
var proxy = require('./module/proxy.handler.js');
var languageHandler = require('./module/language.handler.js');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var config = require('./config/environment.js');

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
	clientApp.respond(req, res);
};

var errorHandler = (err, req, res, next) => {
	clientApp.errorHandler(err, req, res);
};

app.use(favicon(__dirname + '/static/img/favicon.ico'))
	.use(config.$Server.staticFolder, express.static(path.join(__dirname, 'static')))
	.use(bodyParser.json()) // for parsing application/json
	.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
	.use(multer()) // for parsing multipart/form-data
	.use(cookieParser())
	.use(methodOverride())
	.use(allowCrossDomain)
	.use(config.$Server.apiUrl + '/', proxy)
	.use(languageHandler)
	.use(renderApp)
	.use(errorHandler)
	.listen(config.$Server.port, function() {
		return console.log('Point your browser at http://localhost:' + config.$Server.port);
	});
