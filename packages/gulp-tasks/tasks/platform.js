
let gulp = require('gulp');
let concat = require('gulp-concat');
let insert = require('gulp-insert');
let sourcemaps = require('gulp-sourcemaps');
let builderBabelHeleprs = require('babel-core/lib/tools/build-external-helpers');

exports.__requiresConfig = true;

exports.default = (gulpConfig) => {
    let files = gulpConfig.files;

    function shim() {
        let babelHelpers = builderBabelHeleprs();

        return gulp
        .src(files.shim.src)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(insert.wrap('(function(){', '})();'))
        .pipe(concat(files.shim.name))
        .pipe(insert.append(babelHelpers))
        .pipe(gulp.dest(files.shim.dest.client))
        .pipe(gulp.dest(files.shim.dest.server));
    }

    function polyfill(done) {
        return gulp.series(
            gulp.parallel(
                ...Object.values(files.polyfill).map(polyfill =>
                    () => gulp
                    .src(polyfill.src)
                    .pipe(sourcemaps.init({loadMaps: true}))
                    .pipe(insert.wrap('(function(){', '})();'))
                    .pipe(concat(polyfill.name))
                    .pipe(gulp.dest(polyfill.dest.client))
                )
            ),
            (subDone) => {
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
