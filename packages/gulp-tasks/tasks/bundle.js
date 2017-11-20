let gulp = require('gulp');
let concat = require('gulp-concat');
let del = require('del');
let nano = require('gulp-cssnano');
let plumber = require('gulp-plumber');
let uglifyEs = require('gulp-uglify-es').default;

exports.__requiresConfig = true;

exports.default = gulpConfig => {
  let files = gulpConfig.files;
  let uglifyCompression = gulpConfig.uglifyCompression;

  function bundleJsApp() {
    return gulp
      .src(files.bundle.js.src)
      .pipe(plumber())
      .pipe(concat(files.bundle.js.name))
      .pipe(
        uglifyEs({
          mangle: true,
          compress: Object.assign({}, uglifyCompression, { ecma: 5 })
        })
      )
      .pipe(plumber.stop())
      .pipe(gulp.dest(files.bundle.js.dest));
  }

  function bundleEsApp() {
    return gulp
      .src(files.bundle.es.src)
      .pipe(plumber())
      .pipe(concat(files.bundle.es.name))
      .pipe(uglifyEs({ mangle: true, compress: uglifyCompression }))
      .pipe(plumber.stop())
      .pipe(gulp.dest(files.bundle.es.dest));
  }

  function bundleJsServer() {
    let file = files.app.dest.server + files.app.name.server;

    return gulp.src(file).pipe(gulp.dest(files.app.dest.server));
  }

  function bundleCss() {
    return gulp
      .src(files.bundle.css.src)
      .pipe(plumber())
      .pipe(concat(files.bundle.css.name))
      .pipe(nano())
      .pipe(plumber.stop())
      .pipe(gulp.dest(files.bundle.css.dest));
  }

  function bundleClean() {
    return del(
      files.bundle.css.src.concat(files.bundle.js.src, files.bundle.es.src)
    );
  }

  return {
    'bundle:js:app': bundleJsApp,
    'bundle:es:app': bundleEsApp,
    'bundle:js:server': bundleJsServer,
    'bundle:css': bundleCss,
    'bundle:clean': bundleClean
  };
};
