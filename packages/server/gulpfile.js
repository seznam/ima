const gulp = require('gulp');
const plumber = require('gulp-plumber');
const jasmine = require('gulp-jasmine');

exports.test = test;
function test() {
	return gulp
		.src(['./tests/**/*.js', './tests/*.js'])
		.pipe(jasmine({ includeStackTrace: false }));
}

exports.dev = () => gulp
	.watch(['./lib/**/*.js', './lib/*.js', './tests/**/*.js', './tests/*.js'], test);
