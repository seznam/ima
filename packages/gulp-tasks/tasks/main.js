
let gulp = require('gulp');
let sharedTasksState = require('../gulpState');
let macroTasks = require('../macroTasks.js');

exports.__requiresConfig = true;

exports.default = (gulpConfig) => {
	let tasks = gulpConfig.tasks || {};

	let devTasks = tasks.dev || macroTasks.DEFAULT_DEV_SUBTASKS;
	let buildTasks = tasks.build || macroTasks.DEFAULT_BUILD_SUBTASKS;
	let buildSpaTasks = (tasks.spa || macroTasks.DEFAULT_SPA_SUBTASKS);

	if (gulpConfig.onTerminate) {
		process.on('SIGINT', gulpConfig.onTerminate.bind(null, 'SIGINT'));
		process.on('SIGTERM', gulpConfig.onTerminate.bind(null, 'SIGTERM'));
		process.on('SIGHUP', gulpConfig.onTerminate.bind(null, 'SIGHUP'));
	}

	function dev() {
		sharedTasksState.watchMode = true;

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
