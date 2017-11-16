const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const tap = require('gulp-tap');
let config;
let parentDir;

module.exports = gulpConfig => {
  config = gulpConfig;
  parentDir = config.parentDir;

  return gulp.series(clean, gulp.parallel(compile, copy));
};

function compile() {
  return gulp
    .src(config.files.js)
    .pipe(plumber())
    .pipe(
      babel({
        moduleIds: true,
        plugins: ['transform-es2015-modules-commonjs']
      })
    )
    .pipe(plumber.stop())
    .pipe(
      tap(file => {
        let moduleName = 'ima' + file.path.slice(parentDir.length, -3);
        let fileContents = file.contents.toString();

        let dependencyMatcher = /require\(['"]([^'"]+)['"]\)/g;
        let dependencies = [];
        let match = dependencyMatcher.exec(fileContents);
        while (match) {
          dependencies.push(match[1]);
          match = dependencyMatcher.exec(fileContents);
        }

        let exportMatcher = /\nexports\.([a-zA-Z_][a-zA-Z_1-9]*)\s*=\s*([^;]+);/g;
        let moduleExports = [];
        match = exportMatcher.exec(fileContents);
        while (match) {
          moduleExports.push({ symbol: match[1], value: match[2] });
          match = exportMatcher.exec(fileContents);
        }

        // Note: there is no point in specifying the dependencies in
        // the the IMA loader's register() method, as these will
        // already be resolved by browserify's require() function used
        // in the code before with the IMA loader.
        file.contents = new Buffer(
          fileContents +
            '\n\n' +
            `typeof $IMA !== 'undefined' && $IMA !== null && $IMA.Loader && ` +
            `$IMA.Loader.register('${
              moduleName
            }', [], function (_export, _context) {\n` +
            ` 'use strict';\n` +
            ` return {\n` +
            `   setters: [],\n` +
            `   execute: function () {\n` +
            moduleExports
              .map(
                ({ symbol, value }) =>
                  `     _export('${symbol}', exports.${symbol});\n`
              )
              .join('') +
            `   }\n` +
            ` };\n` +
            `});\n`
        );
      })
    )
    .pipe(gulp.dest(`${parentDir}/dist`));
}

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

function copy(done) {
  return gulp.parallel(copyFiles, copyPolyfill)(done);
}

function clean() {
  return del(`${parentDir}/dist`);
}
