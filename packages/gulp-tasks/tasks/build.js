
let gulp = require('gulp');

exports.server_build = () => {
	return gulp.series(
		'copy_environment',
		'Es6ToEs5_server',
		'server_restart',
		'server_reload'
	)();
};

exports.app_build = () => {
	return gulp.series(
		'Es6ToEs5_app',
		'server_hotreload'
	)();
};

exports.ima_build = () => {
	return gulp.series(
		'Es6ToEs5_ima',
		'server_hotreload'
	)();
};

exports.vendor_build = () => {
	gulp.series(
		'Es6ToEs5_vendor',
		gulp.parallel('Es6ToEs5_vendor_client', 'Es6ToEs5_vendor_client_test'),
		'server_restart',
		'server_reload'
	)();
};

exports.locale_build = () => {
	gulp.series(
		'locale',
		'server_restart',
		'server_reload'
	)();
};
