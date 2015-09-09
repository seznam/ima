
var gulp = require('gulp');
var runSequence = require('run-sequence');

require('gulp-command')(gulp);

var gulpConfig = require('../../../gulpConfig.js');
var uglifyCompression = gulpConfig.uglifyCompression;

gulp.task('dev', function (callback) {
	return runSequence(
		['copy:appStatic', 'copy:imajsServer', 'copy:environment', 'shim', 'polyfill'],
		['Es6ToEs5:app', 'Es6ToEs5:server', 'Es6ToEs5:vendor'],
		['less', 'doc', 'locale', 'Es6ToEs5:vendor:client', 'Es6ToEs5:vendor:server'],
		['server'],
		['devTest', 'watch'],
		callback
	);
});

gulp
	.option('build', '-e, --env', 'Build environment')
	.task('build', function (callback) {

		if (this.flags.env === 'prod') {
			uglifyCompression.global_defs.$Debug = false;
		}

		var tasks = [
			['copy:appStatic', 'copy:imajsServer', 'copy:environment', 'shim', 'polyfill'], // copy public folder, concat shim
			['Es6ToEs5:app', 'Es6ToEs5:server', 'Es6ToEs5:vendor'], // compile app and vendor script
			['less', 'doc', 'locale', 'Es6ToEs5:vendor:client', 'Es6ToEs5:vendor:server'] // adjust vendors, compile less, create doc
		];
		if (['prod', 'test'].indexOf(this.flags.env) > -1) {
			tasks.push(
				['bundle:js:app', 'bundle:js:server', 'bundle:css'],
				['bundle:clean', 'Es6ToEs5:vendor:clean'] // clean vendor
			);
		}
		tasks.push(callback);

		return runSequence.apply(null, tasks);
	});
