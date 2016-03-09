
var gulp = require('gulp');
var gls = require('gulp-live-server');

var sharedState = require('../gulpState.js');
var server = null;
var isServerRunning = false;

function startServer() {
	isServerRunning = true;
	server
		.start()
		.then(function(result) {
			isServerRunning = false;
		});
}

gulp.task('server', function () {
	server = gls.new('./build/server.js');

	startServer();
});

gulp.task('server:restart', function () {
	startServer();
});

gulp.task('server:reload', function (callback) {
	if (isServerRunning) {
		setTimeout(function() {
			server.notify(sharedState.watchEvent);
			callback();
		}, 2000);
	} else {
		startServer();
		callback();
	}
});

gulp.task('server:hotreload', function (callback) {
	if (isServerRunning) {
		server.notify(sharedState.watchEvent);
	} else {
		startServer();
	}
	callback();
});
