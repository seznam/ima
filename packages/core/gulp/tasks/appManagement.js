
var gulp = require('gulp');
var clean = require('gulp-clean');

gulp.task('app:hello', function () {
	return gulp.src('./imajs/examples/hello/**/*')
		.pipe(gulp.dest('./app'));
});

gulp.task('app:feed', function () {
	return gulp.src('./imajs/examples/feed/**/*')
		.pipe(gulp.dest('./app'));
});

gulp.task('app:todos', function () {
	return gulp.src('./imajs/examples/todos/**/*')
		.pipe(gulp.dest('./app'));
});

gulp.task('app:clean', function () {
	return gulp.src(['./app/', './build/'], {read: false})
		.pipe(clean());
});
