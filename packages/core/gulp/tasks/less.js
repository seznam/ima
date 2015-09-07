
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var less = require('gulp-less');
var path = require('path');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

var gulpConfig = require('../../../gulpConfig.js');
var files = gulpConfig.files;

gulp.task('less', function () {
	return (
		gulp.src(files.less.src)
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(concat({path: files.less.name, base: files.less.base, cwd: files.less.cwd}))
			.pipe(less({compress: true, paths: [ path.join(__dirname) ]}))
			.pipe(autoprefixer())
			.pipe(sourcemaps.write())
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.less.dest))
	);
});
