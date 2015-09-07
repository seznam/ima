
var gulp = require('gulp');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var sourcemaps = require('gulp-sourcemaps');

var gulpConfig = require('../../../gulpConfig.js');
var files = gulpConfig.files;

gulp.task('shim', function () {
	return (
		gulp
			.src(files.shim.src)
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(insert.wrap('(function(){', '})();'))
			.pipe(concat(files.shim.name))
			.pipe(gulp.dest(files.shim.dest.client))
			.pipe(gulp.dest(files.shim.dest.server))
	);
});

gulp.task('polyfill', function() {
	return (
		gulp
			.src(files.polyfill.src)
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(insert.wrap('(function(){', '})();'))
			.pipe(concat(files.polyfill.name))
			.pipe(gulp.dest(files.shim.dest.client))
	);
});
