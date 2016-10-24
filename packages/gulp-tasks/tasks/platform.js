
var gulp = require('gulp');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var sourcemaps = require('gulp-sourcemaps');
var builderBabelHeleprs = require('babel-core/lib/tools/build-external-helpers');

module.exports = (gulpConfig) => {
	var files = gulpConfig.files;

	gulp.task('shim', () => {
		var babelHelpers = builderBabelHeleprs();

		return (
			gulp
				.src(files.shim.src)
				.pipe(sourcemaps.init({loadMaps: true}))
				.pipe(insert.wrap('(function(){', '})();'))
				.pipe(concat(files.shim.name))
				.pipe(insert.append(babelHelpers))
				.pipe(gulp.dest(files.shim.dest.client))
				.pipe(gulp.dest(files.shim.dest.server))
		);
	});

	gulp.task('polyfill', () =>
		gulp
			.src(files.polyfill.src)
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(insert.wrap('(function(){', '})();'))
			.pipe(concat(files.polyfill.name))
			.pipe(gulp.dest(files.shim.dest.client))
	);
};
