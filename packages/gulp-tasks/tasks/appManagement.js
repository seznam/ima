
var gulp = require('gulp');
var del = require('del');

gulp.task('app:hello', () =>
	gulp.src('./node_modules/ima-examples/hello/**/*')
		.pipe(gulp.dest('./app'))
);

gulp.task('app:feed', () =>
	gulp.src('./node_modules/ima-examples/feed/**/*')
		.pipe(gulp.dest('./app'))
);

gulp.task('app:todos', () =>
	gulp.src('./node_modules/ima-examples/todos/**/*')
		.pipe(gulp.dest('./app'))
);

gulp.task('app:clean', () =>
	del(['./app/', './build/'])
);
