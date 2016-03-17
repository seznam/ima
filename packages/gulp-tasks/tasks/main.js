
var gulp = require('gulp');
var runSequence = require('run-sequence');

module.exports = function(gulpConfig) {
	var uglifyCompression = gulpConfig.uglifyCompression;

	gulp
		.task('dev', function(callback) {

			if (gulpConfig.tasks && gulpConfig.tasks.dev) {

				return runSequence.apply(null, gulpConfig.tasks.dev.concat([callback]));
			} else {

				return runSequence(
					['copy:appStatic', 'copy:environment', 'shim', 'polyfill'],
					['Es6ToEs5:app', 'Es6ToEs5:ima', 'Es6ToEs5:server', 'Es6ToEs5:vendor'],
					['less', 'doc', 'locale', 'Es6ToEs5:vendor:client'],
					['server'],
					['test:unit:karma:dev', 'watch'],
					callback
				);
			}
		});


	gulp
		.task('build', function(callback) {

			if (gulpConfig.tasks && gulpConfig.tasks.build) {

				return runSequence.apply(null, gulpConfig.tasks.build.concat([callback]));
			} else {
				var env = process.env.NODE_ENV;

				var tasks = [
					['copy:appStatic', 'copy:environment', 'shim', 'polyfill'], // copy public folder, concat shim
					['Es6ToEs5:app', 'Es6ToEs5:ima', 'Es6ToEs5:server', 'Es6ToEs5:vendor'], // compile app and vendor script
					['less', 'doc', 'locale', 'Es6ToEs5:vendor:client'], // adjust vendors, compile less, create doc
					['bundle:js:app', 'bundle:js:server', 'bundle:css']
				];

				if (['prod', 'production', 'test'].indexOf(env) > -1) {
					tasks.push(
						['bundle:clean', 'Es6ToEs5:vendor:clean'] // clean vendor
					);
				}
				tasks.push(callback);

				return runSequence.apply(null, tasks);
			}
		});


	if (gulpConfig.onTerminate) {
		process.on('SIGINT', gulpConfig.onTerminate.bind(null, 'SIGINT'));
		process.on('SIGTERM', gulpConfig.onTerminate.bind(null, 'SIGTERM'));
		process.on('SIGHUP', gulpConfig.onTerminate.bind(null, 'SIGHUP'));
	}
};
