const gulp = require('gulp');
const plumber = require('gulp-plumber');
const messageFormat = require('gulp-messageformat');
const insert = require('gulp-insert');
const rename = require('gulp-rename');

exports.__requiresConfig = true;

exports.default = gulpConfig => {
  let files = gulpConfig.files;

  function locale() {
    function parseLocale(language, selector) {
      return gulp
        .src(selector)
        .pipe(plumber())
        .pipe(
          rename(path => {
            path.basename = path.basename.replace(
              new RegExp(language, 'gi'),
              ''
            );
          })
        )
        .pipe(messageFormat({ locale: language, global: 'that' }))
        .pipe(plumber.stop())
        .pipe(
          insert.wrap(
            '(function () {var $IMA = {}; if ((typeof window !== "undefined") && (window !== null)) { window.$IMA = window.$IMA || {}; $IMA = window.$IMA; } var that = $IMA || {};',
            ' return that.i18n; })();'
          )
        )
        .pipe(gulp.dest(files.locale.dest.client))
        .pipe(insert.wrap('module.exports =', ''))
        .pipe(gulp.dest(files.locale.dest.server));
    }

    let locales = Object.keys(files.locale.src).map(language => {
      let selector = files.locale.src[language];

      return parseLocale(language, selector);
    });

    return locales[locales.length - 1];
  }

  return {
    locale
  };
};
