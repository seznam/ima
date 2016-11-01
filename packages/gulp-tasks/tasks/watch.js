
var gulp = require('gulp');
var cache = require('gulp-cached');
var flo = require('fb-flo');
var fs = require('fs');
var gutil = require('gulp-util');
var remember = require('gulp-remember');
var watch = require('gulp-watch');

var sharedState = require('../gulpState.js');

module.exports = (gulpConfig) => {
	var files = gulpConfig.files;

	gulp.task('watch', () => {

		runOnChange(files.app.watch, 'app:build');
		runOnChange(files.ima.watch, 'ima:build');
		runOnChange(files.vendor.watch, 'vendor:build');
		runOnChange(files.less.watch, 'less');
		runOnChange(files.server.watch, 'server:build');
		runOnChange(files.locale.watch, 'locale:build');
		runOnChange('./app/assets/static/**/*', 'copy:appStatic');

		gulp.watch([
			'./ima/**/*.js',
			'./app/**/*.{js,jsx}',
			'./build/static/js/locale/*.js'
		]).on('change', (event) => {
			sharedState.watchEvent = event;

			if (event.type === 'deleted') {
				if (cache.caches['Es6ToEs5:app'][event.path]) {
					delete cache.caches['Es6ToEs5:app'][event.path];
					remember.forget('Es6ToEs5:app', event.path);
				}

				if (cache.caches['Es6ToEs5:ima'][event.path]) {
					delete cache.caches['Es6ToEs5:ima'][event.path];
					remember.forget('Es6ToEs5:ima', event.path);
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
			(filepath, callback) => {
				gutil.log('Reloading \'public/' + gutil.colors.cyan(filepath) +
					'\' with flo...');

				var fileContents = fs.readFileSync('./build/static/' + filepath);
				callback({
					resourceURL: 'static/' + filepath,
					contents: fileContents.toString()
				});
			}
		);

		function runOnChange(files, tasks) {
			watch(files, () => gulp.start(tasks));
		}
	});
};
