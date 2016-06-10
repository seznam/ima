
var gulp = require('gulp');
var runSequence = require('run-sequence');

const DEFAULT_DEV_SUBTASKS = [
	['copy:appStatic', 'copy:environment', 'shim', 'polyfill'],
	['Es6ToEs5:app', 'Es6ToEs5:ima', 'Es6ToEs5:server', 'Es6ToEs5:vendor'],
	['less', 'doc', 'locale', 'Es6ToEs5:vendor:client', 'Es6ToEs5:vendor:client:test'],
	['server'],
	['test:unit:karma:dev', 'watch']
];

const DEFAULT_BUILD_SUBTASKS = [
	['copy:appStatic', 'copy:environment', 'shim', 'polyfill'], // copy public folder, concat shim
	['Es6ToEs5:app', 'Es6ToEs5:ima', 'Es6ToEs5:server', 'Es6ToEs5:vendor'], // compile app and vendor script
	['less', 'doc', 'locale', 'Es6ToEs5:vendor:client', 'Es6ToEs5:vendor:client:test'], // adjust vendors, compile less, create doc
	['bundle:js:app', 'bundle:js:server', 'bundle:css']
];
if (['prod', 'production', 'test'].indexOf(process.env.NODE_ENV) > -1) {
	DEFAULT_BUILD_SUBTASKS.push(
		['bundle:clean', 'Es6ToEs5:vendor:clean'] // clean vendor
	);
}

const DEFAULT_SPA_SUBTASKS = [
	['copy:appStatic', 'shim', 'polyfill'], // copy public folder, concat shim
	['Es6ToEs5:app', 'Es6ToEs5:ima', 'Es6ToEs5:vendor'], // compile app and vendor script
	['less', 'doc', 'locale', 'Es6ToEs5:vendor:client'], // adjust vendors, compile less, create doc
	['bundle:js:app', 'bundle:css', 'compile:spa'],
	['clean:spa']
];
if (['prod', 'production', 'test'].indexOf(process.env.NODE_ENV) > -1) {
	DEFAULT_SPA_SUBTASKS.push(
		['bundle:clean', 'Es6ToEs5:vendor:clean'] // clean vendor
	);
}

module.exports = (gulpConfig) => {
	var tasks = gulpConfig.tasks || {};

	gulp.task('dev', (callback) => {
		var devTasks = tasks.dev || DEFAULT_DEV_SUBTASKS;
		return runSequence.apply(null, devTasks.concat([callback]));
	});


	gulp.task('build', (callback) => {
		var buildTasks = tasks.build || DEFAULT_BUILD_SUBTASKS;
		return runSequence.apply(null, buildTasks.concat([callback]));
	});

	gulp.task('build:spa', (callback) => {
		var buildTasks = tasks.spa || DEFAULT_SPA_SUBTASKS;
		return runSequence.apply(null, buildTasks.concat([callback]));
	});

	if (gulpConfig.onTerminate) {
		process.on('SIGINT', gulpConfig.onTerminate.bind(null, 'SIGINT'));
		process.on('SIGTERM', gulpConfig.onTerminate.bind(null, 'SIGTERM'));
		process.on('SIGHUP', gulpConfig.onTerminate.bind(null, 'SIGHUP'));
	}
};
