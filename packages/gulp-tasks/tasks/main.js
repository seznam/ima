
let gulp = require('gulp');

const DEFAULT_DEV_SUBTASKS = [
	['copy:appStatic', 'copy:environment', 'shim', 'polyfill'],
	['Es6ToEs5:app', 'Es6ToEs5:ima', 'Es6ToEs5:server', 'Es6ToEs5:vendor'],
	['less', 'doc', 'locale', 'Es6ToEs5:vendor:client', 'Es6ToEs5:vendor:client:test'],
	'server',
	['test:unit:karma:dev', 'watch']
];

const DEFAULT_BUILD_SUBTASKS = [
	['copy:appStatic', 'copy:environment', 'shim', 'polyfill'], // copy public folder, concat shim
	['Es6ToEs5:app', 'Es6ToEs5:ima', 'Es6ToEs5:server', 'Es6ToEs5:vendor'], // compile app and vendor script
	['less', 'doc', 'locale', 'Es6ToEs5:vendor:client', 'Es6ToEs5:vendor:client:test'], // adjust vendors, compile less, create doc
	['bundle:js:app', 'bundle:js:server', 'bundle:css']
];
if (['prod', 'production', 'test'].includes(process.env.NODE_ENV)) {
	DEFAULT_BUILD_SUBTASKS.push(
		['bundle:clean', 'Es6ToEs5:vendor:clean'] // clean vendor
	);
}

const DEFAULT_SPA_SUBTASKS = [
	['copy:appStatic', 'shim', 'polyfill'], // copy public folder, concat shim
	['Es6ToEs5:app', 'Es6ToEs5:ima', 'Es6ToEs5:vendor'], // compile app and vendor script
	['less', 'doc', 'locale', 'Es6ToEs5:vendor:client'], // adjust vendors, compile less, create doc
	['bundle:js:app', 'bundle:css', 'spa:compile'],
	'spa:clean'
];
if (['prod', 'production', 'test'].includes(process.env.NODE_ENV)) {
	DEFAULT_SPA_SUBTASKS.push(
		['bundle:clean', 'Es6ToEs5:vendor:clean'] // clean vendor
	);
}

exports.__requiresConfig = true;

exports.default = (gulpConfig) => {
	let tasks = gulpConfig.tasks || {};

	let devTasks = tasks.dev || DEFAULT_DEV_SUBTASKS;
	let buildTasks = tasks.build || DEFAULT_BUILD_SUBTASKS;
	let buildSpaTasks = (tasks.spa || DEFAULT_SPA_SUBTASKS);

	if (gulpConfig.onTerminate) {
		process.on('SIGINT', gulpConfig.onTerminate.bind(null, 'SIGINT'));
		process.on('SIGTERM', gulpConfig.onTerminate.bind(null, 'SIGTERM'));
		process.on('SIGHUP', gulpConfig.onTerminate.bind(null, 'SIGHUP'));
	}

	function dev() {
		return gulp.series(...prepareTasks(devTasks))();
	}

	function build() {
		return gulp.series(...prepareTasks(buildTasks))();
	}

	function buildSpa() {
		return gulp.series(...prepareTasks(buildSpaTasks))();
	}
	
	return {
		dev: dev,
		build: build,
		'build:spa': buildSpa
	};

	function prepareTasks(groupedTasks) {
		return groupedTasks.map(
			tasks => tasks instanceof Array ? gulp.parallel(...tasks) : tasks
		);
	}
};
