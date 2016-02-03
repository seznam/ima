var gulp = require('gulp');
var plumber = require('gulp-plumber');
var jasmine = require('gulp-jasmine');

//run test
gulp.task('test', () => {
	return (
		gulp.src(['./tests/**/*.js', './tests/*.js'])
			.pipe(jasmine({ includeStackTrace: false }))
	);
});


// -------------------------------------PRIVATE HELPER TASKS
gulp.task('dev', function() {
	gulp.watch(['./lib/**/*.js', './lib/*.js', './tests/**/*.js', './tests/*.js'], ['test']);
});
