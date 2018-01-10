const gulp = require('gulp');
const cache = require('gulp-cached');
const flo = require('fb-flo');
const gutil = require('gulp-util');
const remember = require('gulp-remember');
const watch = require('gulp-watch');
const path = require('path');
const fs = require('fs');

const sharedState = require('../gulpState.js');

exports.__requiresConfig = true;

exports.default = gulpConfig => {
  let files = gulpConfig.files;

  function watchTask() {
    let hotReloadedCacheKeys = [];

    runOnChange(files.app.watch, 'app:build');
    runOnChange(files.vendor.watch, 'vendor:build');
    runOnChange(files.less.watch, 'less');
    runOnChange(files.server.watch, 'server:build');
    runOnChange(files.locale.watch, 'locale:build');
    runOnChange('./app/assets/static/**/*', 'copy:appStatic');

    gulp
      .watch([
        './ima/**/*.js',
        './app/**/*.{js,jsx}',
        './build/static/js/locale/*.js'
      ])
      .on('all', (event, filePath) => {
        sharedState.watchEvent = { path: filePath };
        let absoluteFilePath = path.resolve('.', filePath);

        let cacheKey = absoluteFilePath.toLowerCase().replace('.jsx', '.js');
        hotReloadedCacheKeys.push(cacheKey);

        if (event === 'unlink') {
          if (cache.caches['Es6ToEs5:server:app'][absoluteFilePath]) {
            delete cache.caches['Es6ToEs5:server:app'][absoluteFilePath];
            remember.forget(
              'Es6ToEs5:server:app',
              absoluteFilePath.replace('.jsx', '.js')
            );
          }
        }
      });

    flo(
      './build/static/',
      {
        port: 5888,
        host: 'localhost',
        glob: ['**/*.css', '**/*.js']
      },
      (filepath, callback) => {
        gutil.log(
          `Reloading 'public/${gutil.colors.cyan(filepath)}' with ` + 'flo...'
        );

        let hotReloadedContents = '';

        if (path.parse(filepath).ext === '.css') {
          hotReloadedContents = fs.readFileSync('./build/static/' + filepath);
        } else {
          hotReloadedContents = hotReloadedCacheKeys.map(cacheKey => {
            let file = remember.cacheFor('Es6ToEs5:server:app')[cacheKey];
            if (!file) {
              return '';
            }

            return file.contents
              .toString()
              .replace(/System.import/g, '$IMA.Loader.import')
              .replace(/System.register/g, '$IMA.Loader.replaceModule');
          });
          hotReloadedCacheKeys = [];
        }

        callback({
          resourceURL: 'static/' + filepath,
          contents: hotReloadedContents
        });
      }
    );

    function runOnChange(files, task) {
      watch(files, () => gulp.series(task)());
    }
  }

  return {
    watch: watchTask
  };
};
