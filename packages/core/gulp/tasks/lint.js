
var gulp = require('gulp');
var eslint = require('gulp-eslint');

var gulpConfig = require('../../../gulpConfig.js');
var files = gulpConfig.files;

gulp.task('lint', function () {
	return gulp.src(files.app.src)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});
