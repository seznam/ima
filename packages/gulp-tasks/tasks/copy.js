
let gulp = require('gulp');

exports.__requiresConfig = true;

exports.default = (gulpConfig) => {
    let files = gulpConfig.files;

    function copyAppStatic() {
        return gulp
        .src([
            './app/assets/static/**/*.*',
            './app/assets/static/*.*'
        ])
        .pipe(gulp.dest(files.server.dest + 'static/'));
    }

    function copyEnvironment() {
        return gulp
        .src(['./app/environment.js'])
        .pipe(gulp.dest(files.server.base + 'ima/config/'));
    }

    return {
        'copy:appStatic': copyAppStatic,
        'copy:environment': copyEnvironment
    };
};
