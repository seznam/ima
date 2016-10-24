
var gulp = require('gulp');
var eslint = require('gulp-eslint');

module.exports = (gulpConfig) => {
	var files = gulpConfig.files;

	gulp.task('lint', () =>
		gulp.src(files.app.src)
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failOnError())
	);
};
