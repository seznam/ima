
var gulp = require('gulp');
var del = require('del');

gulp.task('app:hello', function () {
	return gulp.src('./node_modules/ima.js-examples/hello/**/*')
		.pipe(gulp.dest('./app'));
});

gulp.task('app:feed', function () {
	return gulp.src('./node_modules/ima.js-examples/feed/**/*')
		.pipe(gulp.dest('./app'));
});

gulp.task('app:todos', function () {
	return gulp.src('./node_modules/ima.js-examples/todos/**/*')
		.pipe(gulp.dest('./app'));
});

gulp.task('app:clean', function () {
	return del(['./app/', './build/']);
});
