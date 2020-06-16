const gulp = require('gulp');
const concat = require('gulp-concat');
const del = require('del');
const cssnano = require('cssnano');
const plumber = require('gulp-plumber');
const postCss = require('gulp-postcss');
const uglifyEs = require('gulp-uglify-es').default;

exports.__requiresConfig = true;

exports.default = gulpConfig => {
  let files = gulpConfig.files;
  let uglifyCompression = gulpConfig.uglifyCompression;

  function bundleJsApp() {
    if (!gulpConfig.legacyCompactMode) {
      return Promise.resolve();
    }

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
    let postCssPlugins = [
      cssnano(files.bundle.cssnanoSettings),
      ...files.bundle.postCssPlugins
    ];

    return gulp
      .src(files.bundle.css.src)
      .pipe(plumber())
      .pipe(concat(files.bundle.css.name))
      .pipe(postCss(postCssPlugins))
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
