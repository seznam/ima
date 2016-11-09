
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

exports['server:restart'] = serverRestart;
function serverRestart(done) {
	setTimeout(startServer);
	done();
}

exports['server:reload'] = serverReload;
function serverReload(done) {
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

exports['server:hotreload'] = serverHotreload;
function serverHotreload(done) {
	if (isServerRunning) {
		server.notify(sharedState.watchEvent);
	} else {
		startServer();
	}

	done();
}
