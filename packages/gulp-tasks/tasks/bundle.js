
var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var nano = require('gulp-cssnano');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');

module.exports = (gulpConfig) => {
	var files = gulpConfig.files;
	var uglifyCompression = gulpConfig.uglifyCompression;

	gulp.task('bundle:js:app', () =>
		gulp.src(files.bundle.js.src)
			.pipe(plumber())
			.pipe(concat(files.bundle.js.name))
			.pipe(uglify({mangle: true, compress: uglifyCompression}))
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.bundle.js.dest))
	);

	gulp.task('bundle:js:server', () => {
		var file = files.app.dest.server + files.app.name.server;

		return (
			gulp.src(file)
				.pipe(plumber())
				.pipe(uglify({
					mangle: false,
					output: {beautify: true},
					compress: uglifyCompression
				}))
				.pipe(plumber.stop())
				.pipe(gulp.dest(files.app.dest.server))
		);
	});

	gulp.task('bundle:css', () =>
		gulp.src(files.bundle.css.src)
			.pipe(plumber())
			.pipe(concat(files.bundle.css.name))
			.pipe(nano())
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.bundle.css.dest))
	);

	gulp.task('bundle:clean', () =>
		del(files.bundle.css.src.concat(files.bundle.js.src))
	);
};
