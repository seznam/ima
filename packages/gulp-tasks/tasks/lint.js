
let gulp = require('gulp');
let eslint = require('gulp-eslint');

exports.__requiresConfig = true;

exports.default = (gulpConfig) => {
    let files = gulpConfig.files;

    function lint() {
        return gulp
        .src(files.app.src)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
    }

    return {
        lint
    };
};
