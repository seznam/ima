
var gulp = require('gulp');
var del = require('del');

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
	return del(['./app/', './build/']);
});
