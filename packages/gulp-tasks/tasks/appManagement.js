const gulp = require('gulp');
const del = require('del');

exports['app:hello'] = appHello;
function appHello() {
  return installExample('hello');
}

exports['app:feed'] = appFeed;
function appFeed() {
  return installExample('feed');
}

exports['app:todos'] = appTodos;
function appTodos() {
  return installExample('todos');
}

exports['app:clean'] = appClean;
function appClean() {
  return del(['./app/', './build/']);
}

function installExample(exampleName) {
  return gulp
    .src(`./node_modules/ima-examples/${exampleName}/**/*`)
    .pipe(gulp.dest('./app'));
}
