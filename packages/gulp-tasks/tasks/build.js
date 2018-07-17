const gulp = require('gulp');
const del = require('del');

exports['server:build'] = () => {
  return gulp.series(
    'copy:environment',
    'Es6ToEs5:server',
    'server:restart',
    'server:reload'
  )();
};

exports['app:build'] = () => {
  return gulp.series('Es6ToEs5:app', 'server:hotreload')();
};

exports['clear:build'] = () => {
  return del(['./build']);
};

exports['ima:build'] = () => {
  return gulp.series('Es6ToEs5:ima', 'server:hotreload')();
};

exports['less:build'] = () => {
  return gulp.series('less', 'server:hotreload')();
};

exports['vendor:build'] = () => {
  return gulp.series(
    'Es6ToEs5:vendor',
    gulp.parallel('Es6ToEs5:vendor:client'),
    'server:restart',
    'server:reload'
  )();
};

exports['locale:build'] = () => {
  return gulp.series('locale', 'server:restart', 'server:reload')();
};
