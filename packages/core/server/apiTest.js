require('./module/shim.js');

var http = require('http');
var rsvp = require('rsvp');
var ApiHandler = require('./test/api/api.handler');
var urls = [];
var ah = new ApiHandler(http, rsvp.Promise);

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
				console.log(key, 'status: ' + respond.status, 'time: ' + respond.time);
			}
		}, (e) => {
			console.error('API ERROR', e.message);
			var error = {
				message: e.message
			};
		})
		.catch((e) => {
			console.error('SERVER ERROR', e.message);
			var error = {
				message: e.message
			};
		});

	setTimeout(cron, 60000);
};

cron();

http.createServer(function (req, res) {

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('API test working');
}).listen(3003);
