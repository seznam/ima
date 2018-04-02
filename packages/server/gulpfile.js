const gulp = require('gulp');
const jasmine = require('gulp-jasmine');

exports.test = test;
function test() {
  return gulp
    .src(['./__tests__/**/*.js', './__tests__/*.js'])
    .pipe(jasmine({ includeStackTrace: false }));
}

exports.dev = () =>
  gulp.watch(
    ['./lib/**/*.js', './lib/*.js', './__tests__/**/*.js', './__tests__/*.js'],
    test
  );
