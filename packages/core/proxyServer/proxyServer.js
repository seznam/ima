require('./module/shim.js');

var path = require('path');
global.appRoot = path.resolve(__dirname);
var express = require('express');
var favicon = require('serve-favicon');
var clientApp = require('./module/clientRequest.handler.js');
var apiRoute = require('./module/api.route.js');
var languageHandler = require('./module/language.handler.js');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');

var app = express();

process.on('uncaughtException', function(e) {
	console.log('uncaughtException caught the error', e);
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

var recordRequest = (req, res, next) => {

	if (req.query.name) {
		res.cookie('name', req.query.name, { maxAge: 90000000, httpOnly: true });
	}

	var timeStamp = Date.now();

	res.on('finish', () => {
		var request = {
			status: res.statusCode,
			url: req.hostname + req.originalUrl,
			method: req.method,
			headers: 'Cookie: ' + (req.query.name || req.cookies.name),
			time: Date.now() - timeStamp
		};

		requestModel.create(request);
	});

	next();
};

var renderReactApp = (req, res) => {
	clientApp().respond(req, res);
};

var errorHandler = (err, req, res, next) => {
	clientApp().errorHandler(err, req, res, next);
};

app.use(favicon(__dirname + '/static/img/favicon.ico'))
	.use('/static', express.static(path.join(__dirname, 'static')))
	.use(bodyParser.json()) // for parsing application/json
	.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
	.use(multer()) // for parsing multipart/form-data
	.use(cookieParser())
	.use(methodOverride())
	.use(allowCrossDomain)
	.use('/api/', apiRoute)
	.use(languageHandler)
	.use(renderReactApp)
	.use(errorHandler)
	.listen(3001, function() {
		return console.log('Point your browser at http://localhost:3001');
	});
