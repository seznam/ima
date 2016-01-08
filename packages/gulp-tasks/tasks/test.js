
var gulp = require('gulp');
var karma = require('karma');
var path = require('path');

gulp.task('test:unit:karma', function (done) {
	new karma.Server({
		configFile: path.resolve('./karma.conf.js'),
		singleRun: true
	}, done).start();
});

gulp.task('test:unit:karma:dev', function(done) {
	new karma.Server({
		configFile: path.resolve('./karma.conf.js')
	}, done).start();
});
