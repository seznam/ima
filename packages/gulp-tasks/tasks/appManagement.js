
let gulp = require('gulp');
let del = require('del');

exports.app_hello = app_hello;
function app_hello() {
	return installExample('hello');
}

exports.app_feed = app_feed;
function app_feed() {
	return installExample('feed');
}

exports.app_todos = app_todos;
function app_todos() {
	return installExample('todos');
}

exports.app_clean = app_clean;
function app_clean() {
	return del(['./app/', './build/']);
}

function installExample(exampleName) {
	return gulp
		.src(`./node_modules/ima-examples/${exampleName}/**/*`)
		.pipe(gulp.dest('./app'));
}
