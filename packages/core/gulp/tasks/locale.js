
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var messageFormat = require('gulp-messageformat');
var insert = require('gulp-insert');

var gulpConfig = require('../../../gulpConfig.js');
var files = gulpConfig.files;

gulp.task('locale', function () {

	function parseLocale(language) {
		return (
			gulp.src(['./app/locale/' + language + '/*.json'])
				.pipe(plumber())
				.pipe(messageFormat({locale:language, global: 'that'}))
				.pipe(plumber.stop())
				.pipe(insert.wrap('(function () {var $IMA = {}; if ((typeof window !== "undefined") && (window !== null)) { window.$IMA = window.$IMA || {}; $IMA = window.$IMA; } var that = $IMA || {};', ' return that.i18n; })();'))
				.pipe(gulp.dest(files.locale.dest.client))
				.pipe(insert.wrap('module.exports =', ''))
				.pipe(gulp.dest(files.locale.dest.server))
		);
	}

	var locales = files.locale.src.map(function (language) {
		return parseLocale(language);
	});

	return locales[locales.length - 1];
});
