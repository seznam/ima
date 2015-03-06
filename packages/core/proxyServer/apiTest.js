require('./module/shim.js');

var http = require('http');
var rsvp = require('rsvp');
var ApiHandler = require('./test/api/api.handler');
var urls = require('./test/api/api.urls')();
var ah = new ApiHandler(http, rsvp.Promise);

var mongoDb = require('./module/mongo.connection.js');
var requestModel = require('./model/model.request.js')(mongoDb);
requestModel.init();

var errorModel = require('./model/model.error.js')(mongoDb);
errorModel.init();

var cron = () => {

	var promises = {};
	for (var url of urls) {
		promises[url.method + ':'+ url.host + url.path] =
			ah.request(url)
				.then((respond) => {
					return respond;
				}, (e) => {
					return rsvp.Promise.reject(e);
				})
				.catch((e) => {
					return rsvp.Promise.reject(e);
				});
	}

	rsvp
		.hash(promises)
		.then((responds) => {
			console.log('API OK');
			for (var key of Object.keys(responds)) {
				var respond = responds[key];

				var request = {
					method: respond.options.method,
					status: respond.status,
					url: respond.options.host + respond.options.path,
					time: respond.time,
					headers: JSON.stringify(respond.options.headers || {}),
					test: true
				};
				requestModel.create(request);
				console.log(key, 'status: ' + respond.status, 'time: ' + respond.time);
			}
		}, (e) => {
			console.error('API ERROR', e.message);
			var error = {
				message: e.message
			};
			errorModel.create(error);
		})
		.catch((e) => {
			console.error('SERVER ERROR', e.message);
			var error = {
				message: e.message
			};
			errorModel.create(error);
		});

	setTimeout(cron, 60000);
};

cron();

http.createServer(function (req, res) {

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('API test working');
}).listen(3003);
