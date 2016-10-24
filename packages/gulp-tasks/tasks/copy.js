
var gulp = require('gulp');

module.exports = (gulpConfig) => {
	var files = gulpConfig.files;

	gulp.task('copy:appStatic', () =>
		gulp.src([
				'./app/assets/static/**/*.*',
				'./app/assets/static/*.*'
			])
			.pipe(gulp.dest(files.server.dest + 'static/'))
	);

	gulp.task('copy:environment', () =>
		gulp
			.src(['./app/environment.js'])
			.pipe(gulp.dest(files.server.base + 'ima/config/'))
	);
};
