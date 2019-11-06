const gulp = require('gulp');
const gulpJasmine = require('gulp-jasmine');

exports.test = () => gulp.src('./*Spec.js').pipe(gulpJasmine());
