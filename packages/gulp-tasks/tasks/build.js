let gulp = require('gulp');

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

exports['ima:build'] = () => {
  return gulp.series('Es6ToEs5:ima', 'server:hotreload')();
};

exports['vendor:build'] = () => {
  gulp.series(
    'Es6ToEs5:vendor',
    gulp.parallel('Es6ToEs5:vendor:client'),
    'server:restart',
    'server:reload'
  )();
};

exports['locale:build'] = () => {
  gulp.series('locale', 'server:restart', 'server:reload')();
};
