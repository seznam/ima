
var gulp = require('gulp');
var gls = require('gulp-live-server');

var sharedState = require('../gulpState.js');
var server = null;

gulp.task('server', function () {
	server = gls.new('./build/server.js');
	server.start();
});

gulp.task('server:restart', function () {
	server.start();
});

gulp.task('server:reload', function (callback) {
	setTimeout(function() {
		server.notify(sharedState.watchEvent);
		callback();
	}, 2000);
});
