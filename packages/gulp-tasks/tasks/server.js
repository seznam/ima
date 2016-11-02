
let gulp = require('gulp');
let gls = require('gulp-live-server');

let sharedState = require('../gulpState.js');
let server = null;
let isServerRunning = false;

function startServer() {
	isServerRunning = true;
	server
		.start()
		.then(() => {
			isServerRunning = false;
		});
}

exports.server = serverTask;
function serverTask(done) {
	server = gls.new('./build/server.js');

	setTimeout(startServer);
	done()
}

exports.server_restart = server_restart;
function server_restart(done) {
	setTimeout(startServer);
	done();
}

exports.server_reload = server_reload;
function server_reload(done) {
	if (isServerRunning) {
		setTimeout(() => {
			server.notify(sharedState.watchEvent);
			done();
		}, 2000);
	} else {
		startServer();
		done();
	}
}

exports.server_hotreload = server_hotreload;
function server_hotreload(done) {
	if (isServerRunning) {
		server.notify(sharedState.watchEvent);
	} else {
		startServer();
	}

	done();
}
