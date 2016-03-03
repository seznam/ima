
var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('server:build', function (callback) {
	return runSequence(
		'copy:environment',
		'Es6ToEs5:server',
		'server:restart',
		'server:reload',
		callback
	);
});

gulp.task('app:build', function (callback) {
	return runSequence(
		'Es6ToEs5:app',
		'server:hotreload',
		callback
	);
});

gulp.task('ima:build', function (callback) {
	return runSequence(
		'Es6ToEs5:ima',
		'server:hotreload',
		callback
	);
});

gulp.task('vendor:build', function (callback) {
	return runSequence(
		'Es6ToEs5:vendor',
		'Es6ToEs5:vendor:client',
		'server:restart',
		'server:reload',
		callback
	);
});

gulp.task('locale:build', function (callback) {
	return runSequence(
		'locale',
		'server:restart',
		'server:reload',
		callback
	);
});
