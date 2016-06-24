
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var messageFormat = require('gulp-messageformat');
var insert = require('gulp-insert');
var rename = require('gulp-rename');

module.exports = function (gulpConfig) {
	var files = gulpConfig.files;

	gulp.task('locale', function () {

		function parseLocale(language, selector) {
			return (
				gulp.src(selector)
					.pipe(plumber())
					.pipe(rename(function(path) {
						path.basename = path.basename.replace(new RegExp(language, 'gi'), '')
					}))
					.pipe(messageFormat({locale: language, global: 'that'}))
					.pipe(plumber.stop())
					.pipe(insert.wrap(
						'(function () {var $IMA = {}; if ((typeof window !== "undefined") && (window !== null)) { window.$IMA = window.$IMA || {}; $IMA = window.$IMA; } var that = $IMA || {};',
						' return that.i18n; })();'
					))
					.pipe(gulp.dest(files.locale.dest.client))
					.pipe(insert.wrap('module.exports =', ''))
					.pipe(gulp.dest(files.locale.dest.server))
			);
		}

		var locales = Object.keys(files.locale.src).map(function (language) {
			var selector = files.locale.src[language];

			return parseLocale(language, selector);
		});

		return locales[locales.length - 1];
	});
};
