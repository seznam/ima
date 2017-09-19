
const isProductionBuild = ['prod', 'production', 'test'].includes(process.env.NODE_ENV);

const DEFAULT_DEV_SUBTASKS = [
	['copy:appStatic', 'copy:environment', 'shim', 'polyfill', 'extraPolyfills'],
	['Es6ToEs5:app', 'Es6ToEs5:server', 'Es6ToEs5:vendor'],
	['less', 'doc', 'locale', 'Es6ToEs5:vendor:client', 'Es6ToEs5:vendor:client:test'],
	'server',
	['test:unit:karma:dev', 'watch']
];

const DEFAULT_BUILD_SUBTASKS = [
	['copy:appStatic', 'copy:environment', 'shim', 'polyfill', 'extraPolyfills'],
	['Es6ToEs5:app', 'Es6ToEs5:server', 'Es6ToEs5:vendor'],
	['less', 'doc', 'locale', 'Es6ToEs5:vendor:client', 'Es6ToEs5:vendor:client:test'],
	['bundle:js:app', 'bundle:js:server', 'bundle:css']
];
if (isProductionBuild) {
	DEFAULT_BUILD_SUBTASKS.push(
		['bundle:clean', 'Es6ToEs5:vendor:clean']
	);
}

const DEFAULT_SPA_SUBTASKS = [
	['copy:appStatic', 'shim', 'polyfill', 'extraPolyfills'],
	['Es6ToEs5:app', 'Es6ToEs5:vendor'],
	['less', 'doc', 'locale', 'Es6ToEs5:vendor:client'],
	['bundle:js:app', 'bundle:css', 'spa:compile'],
	'spa:clean'
];
if (isProductionBuild) {
	DEFAULT_SPA_SUBTASKS.push(
		['bundle:clean', 'Es6ToEs5:vendor:clean']
	);
}

exports.DEFAULT_DEV_SUBTASKS = DEFAULT_DEV_SUBTASKS;
exports.DEFAULT_BUILD_SUBTASKS = DEFAULT_BUILD_SUBTASKS;
exports.DEFAULT_SPA_SUBTASKS = DEFAULT_SPA_SUBTASKS;
