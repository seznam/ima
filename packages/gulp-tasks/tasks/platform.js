const fs = require('fs');

const gulp = require('gulp');
const concat = require('gulp-concat');
const insert = require('gulp-insert');
const sourcemaps = require('gulp-sourcemaps');
const mkdirp = require('mkdirp');
const builderBabelHeleprs = require('babel-core/lib/tools/build-external-helpers');

exports.__requiresConfig = true;

exports.default = gulpConfig => {
  let files = gulpConfig.files;

  function shimJs() {
    if (!gulpConfig.legacyCompactMode) {
      return Promise.resolve();
    }

    let babelHelpers = builderBabelHeleprs();

    return gulp
      .src(files.shim.js.src)
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(insert.wrap('(function(){', '})();'))
      .pipe(concat(files.shim.js.name))
      .pipe(insert.append(babelHelpers))
      .pipe(gulp.dest(files.shim.js.dest.client));
  }

  function shimEs() {
    if (files.shim.es.src.length === 0) {
      const content = '(function(){})();';

      mkdirp.sync(files.shim.es.dest.client);
      mkdirp.sync(files.shim.es.dest.server);

      fs.writeFileSync(files.shim.es.dest.client + files.shim.es.name, content);
      fs.writeFileSync(files.shim.es.dest.server + files.shim.es.name, content);

      return Promise.resolve();
    }

    return gulp
      .src(files.shim.es.src)
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(insert.wrap('(function(){', '})();'))
      .pipe(concat(files.shim.es.name))
      .pipe(gulp.dest(files.shim.es.dest.client))
      .pipe(gulp.dest(files.shim.es.dest.server));
  }

  function shim(done) {
    return gulp.series(gulp.parallel(shimJs, shimEs), subDone => {
      subDone();
      done();
    })();
  }

  function polyfill(done) {
    return gulp.series(
      gulp.parallel(
        ...Object.values(files.polyfill).map(polyfill => () => {
          if (polyfill.src.length === 0) {
            const content = '(function(){})();';

            mkdirp.sync(polyfill.dest.client);
            fs.writeFileSync(polyfill.dest.client + polyfill.name, content);

            return Promise.resolve();
          }

          return gulp
            .src(polyfill.src)
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(insert.wrap('(function(){', '})();'))
            .pipe(concat(polyfill.name))
            .pipe(gulp.dest(polyfill.dest.client));
        })
      ),
      subDone => {
        subDone();
        done();
      }
    )();
  }

  return {
    polyfill,
    shim
  };
};
