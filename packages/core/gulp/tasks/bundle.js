
var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');

var gulpConfig = require('../../../gulpConfig.js');
var files = gulpConfig.files;
var uglifyCompression = gulpConfig.uglifyCompression;

gulp.task('bundle:js:app', function () {
	return (
		gulp.src(files.bundle.js.src)
			.pipe(plumber())
			.pipe(concat(files.bundle.js.name))
			.pipe(uglify({mangle: true, compress: uglifyCompression}))
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.bundle.js.dest))
	);
});

gulp.task('bundle:js:server', function () {
	var file = files.app.dest.server + files.app.name.server;

	return (
		gulp.src(file)
			.pipe(plumber())
			.pipe(uglify({mangle: false, output: {beautify: true}, compress: uglifyCompression}))
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.app.dest.server))
	);
});

gulp.task('bundle:css', function () {
	return (
		gulp.src(files.bundle.css.src)
			.pipe(plumber())
			.pipe(concat(files.bundle.css.name))
			.pipe(minifyCSS())
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.bundle.css.dest))
	);
});

gulp.task('bundle:clean', function () {
	return (
		gulp.src(files.bundle.css.src.concat(files.bundle.js.src), {read: false})
			.pipe(clean())
	);
});
