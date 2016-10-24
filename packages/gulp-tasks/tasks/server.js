
var gulp = require('gulp');
var gls = require('gulp-live-server');

var sharedState = require('../gulpState.js');
var server = null;
var isServerRunning = false;

function startServer() {
	isServerRunning = true;
	server
		.start()
		.then(() => {
			isServerRunning = false;
		});
}

gulp.task('server', () => {
	server = gls.new('./build/server.js');

	startServer();
});

gulp.task('server:restart', () => {
	startServer();
});

gulp.task('server:reload', (callback) => {
	if (isServerRunning) {
		setTimeout(() => {
			server.notify(sharedState.watchEvent);
			callback();
		}, 2000);
	} else {
		startServer();
		callback();
	}
});

gulp.task('server:hotreload', (callback) => {
	if (isServerRunning) {
		server.notify(sharedState.watchEvent);
	} else {
		startServer();
	}

	callback();
});
