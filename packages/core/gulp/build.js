const gulp = require('gulp');
let config;
let parentDir;

module.exports = gulpConfig => {
  config = gulpConfig;
  parentDir = config.parentDir;

  return copy;
};

function copyFiles() {
  return gulp
    .src([
      `${parentDir}/build.js`,
      `${parentDir}/LICENSE`,
      `${parentDir}/package.json`,
      `${parentDir}/.npmignore`,
      `${parentDir}/README.md`,
      `${parentDir}/test.js`
    ])
    .pipe(gulp.dest(`${parentDir}/dist`));
}

function copyPolyfill() {
  return gulp
    .src([`${parentDir}/polyfill/*.js`])
    .pipe(gulp.dest(`${parentDir}/dist/polyfill`));
}

function copyTransform() {
  return gulp
    .src([`${parentDir}/utils/transform/*.js`])
    .pipe(gulp.dest(`${parentDir}/dist/transform`));
}

function copy(done) {
  return gulp.parallel(copyFiles, copyPolyfill, copyTransform)(done);
}
