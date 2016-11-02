
let gulp = require('gulp');

const DEFAULT_DEV_SUBTASKS = [
	['copy_appStatic', 'copy_environment', 'shim', 'polyfill'],
	['Es6ToEs5_app', 'Es6ToEs5_ima', 'Es6ToEs5_server', 'Es6ToEs5_vendor'],
	['less', 'doc', 'locale', 'Es6ToEs5_vendor_client', 'Es6ToEs5_vendor_client_test'],
	'server',
	['test_unit_karma_dev', 'watch']
];

const DEFAULT_BUILD_SUBTASKS = [
	['copy_appStatic', 'copy_environment', 'shim', 'polyfill'], // copy public folder, concat shim
	['Es6ToEs5_app', 'Es6ToEs5_ima', 'Es6ToEs5_server', 'Es6ToEs5_vendor'], // compile app and vendor script
	['less', 'doc', 'locale', 'Es6ToEs5_vendor_client', 'Es6ToEs5_vendor_client_test'], // adjust vendors, compile less, create doc
	['bundle_js_app', 'bundle_js_server', 'bundle_css']
];
if (['prod', 'production', 'test'].includes(process.env.NODE_ENV)) {
	DEFAULT_BUILD_SUBTASKS.push(
		['bundle_clean', 'Es6ToEs5_vendor_clean'] // clean vendor
	);
}

const DEFAULT_SPA_SUBTASKS = [
	['copy_appStatic', 'shim', 'polyfill'], // copy public folder, concat shim
	['Es6ToEs5_app', 'Es6ToEs5_ima', 'Es6ToEs5_vendor'], // compile app and vendor script
	['less', 'doc', 'locale', 'Es6ToEs5_vendor_client'], // adjust vendors, compile less, create doc
	['bundle_js_app', 'bundle_css', 'compile_spa'],
	'clean_spa'
];
if (['prod', 'production', 'test'].includes(process.env.NODE_ENV)) {
	DEFAULT_SPA_SUBTASKS.push(
		['bundle_clean', 'Es6ToEs5_vendor_clean'] // clean vendor
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
	
	return {
		dev: gulp.series(...prepareTasks(devTasks)),
		build: gulp.series(...prepareTasks(buildTasks)),
		build_spa: gulp.series(...prepareTasks(buildSpaTasks))
	};

	function prepareTasks(groupedTasks) {
		return groupedTasks.map(
			tasks => tasks instanceof Array ? gulp.parallel(...tasks) : tasks
		);
	}
};
