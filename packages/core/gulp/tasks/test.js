
var gulp = require('gulp');
var karma = require('karma');

gulp.task('test', function (done) {
	new karma.Server({
		configFile: __dirname + '/../../../karma.conf.js',
		singleRun: true
	}, done).start();
});

gulp.task('devTest', function(done) {
	new karma.Server({
		configFile: __dirname + '/../../../karma.conf.js'
	}, done).start();
});
