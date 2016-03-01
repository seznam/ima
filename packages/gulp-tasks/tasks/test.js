
var gulp = require('gulp');
var karma = require('karma');
var path = require('path');

var sharedState = require('../gulpState.js');

gulp.task('test:unit:karma', function (done) {
	sharedState.karmaServer = new karma.Server({
		configFile: path.resolve('./karma.conf.js'),
		singleRun: true
	}, done).start();
});

gulp.task('test:unit:karma:dev', function(done) {
	sharedState.karmaServer = new karma.Server({
		configFile: path.resolve('./karma.conf.js')
	}, done).start();
});
