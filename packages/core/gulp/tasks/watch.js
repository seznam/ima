
var gulp = require('gulp');
var cache = require('gulp-cached');
var flo = require('fb-flo');
var fs = require('fs');
var gutil = require('gulp-util');
var remember = require('gulp-remember');

var sharedState = require('../gulpState.js');

var gulpConfig = require('../../../gulpConfig.js');
var files = gulpConfig.files;

gulp.task('watch', function() {

	gulp.watch(files.app.watch, ['app:build']);
	gulp.watch(files.vendor.watch, ['vendor:build']);
	gulp.watch(files.less.watch, ['less']);
	gulp.watch(files.server.watch, ['server:build']);
	gulp.watch(files.locale.watch, ['locale:build']);
	gulp.watch('./app/assets/static/**/*', ['copy:appStatic']);

	gulp.watch([
		'./imajs/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./build/static/js/locale/*.js'
	]).on('change', function (e) {
		sharedState.watchEvent = e;

		if (e.type === 'deleted') {
			if (cache.caches['Es6ToEs5:app'][e.path]) {
				delete cache.caches['Es6ToEs5:app'][e.path];
				remember.forget('Es6ToEs5:app', e.path);
			}
		}
	});

	flo(
		'./build/static/',
		{
			port: 5888,
			host: 'localhost',
			glob: [
				'**/*.css',
				'**/*.js'
			]
		},
		function (filepath, callback) {
			gutil.log('Reloading \'public/' + gutil.colors.cyan(filepath) +
					'\' with flo...');

			var fileContents = fs.readFileSync('./build/static/' + filepath);
			callback({
				resourceURL: 'static/' + filepath,
				contents: fileContents.toString()
			});
		}
	);
});
