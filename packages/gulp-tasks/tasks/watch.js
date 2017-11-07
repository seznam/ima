let gulp = require('gulp');
let cache = require('gulp-cached');
let flo = require('fb-flo');
let gutil = require('gulp-util');
let remember = require('gulp-remember');
let watch = require('gulp-watch');
let path = require('path');
let fs = require('fs');

let sharedState = require('../gulpState.js');

exports.__requiresConfig = true;

exports.default = (gulpConfig) => {
	let files = gulpConfig.files;

	function watchTask() {
		let hotReloadedCacheKeys = [];

		runOnChange(files.app.watch, 'app:build');
		runOnChange(files.vendor.watch, 'vendor:build');
		runOnChange(files.less.watch, 'less');
		runOnChange(files.server.watch, 'server:build');
		runOnChange(files.locale.watch, 'locale:build');
		runOnChange('./app/assets/static/**/*', 'copy:appStatic');

		gulp.watch([
			'./ima/**/*.js',
			'./app/**/*.{js,jsx}',
			'./build/static/js/locale/*.js'
		]).on('all', (event, filePath, stats) => {
			sharedState.watchEvent = { path: filePath };
			let absoluteFilePath = path.resolve('.', filePath);

			let cacheKey = absoluteFilePath.toLowerCase().replace('.jsx', '.js');
			hotReloadedCacheKeys.push(cacheKey);

			if (event === 'unlink') {
				if (cache.caches['Es6ToEs5:es:app'][absoluteFilePath]) {
					delete cache.caches['Es6ToEs5:es:app'][absoluteFilePath];
					remember.forget('Es6ToEs5:es:app', absoluteFilePath.replace('.jsx', '.js'));
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
				gutil.log(
					`Reloading 'public/${gutil.colors.cyan(filepath)}' with ` +
					'flo...'
				);

				let hotReloadedContents = '';

				if (path.parse(filepath).ext === '.css') {
					hotReloadedContents = fs.readFileSync('./build/static/' + filepath);
				} else {
					hotReloadedContents = hotReloadedCacheKeys.map((cacheKey) => {
						let file = remember.cacheFor('Es6ToEs5:es:app')[cacheKey];
						if (!file) {
							return '';
						}

						return file.contents
								.toString()
								.replace(/System.import/g, '$IMA.Loader.import')
								.replace(/System.register/g, '$IMA.Loader.replaceModule');
					});
					hotReloadedCacheKeys = [];
				}

				callback({
					resourceURL: 'static/' + filepath,
					contents: hotReloadedContents
				});
			}
		);

		function runOnChange(files, task) {
			watch(files, () => gulp.series(task)());
		}
	}

	return {
		watch: watchTask
	};
};
