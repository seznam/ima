const gulp = require('gulp');
const sharedTasksState = require('../gulpState');
const macroTasks = require('../macroTasks.js');

exports.__requiresConfig = true;

exports.default = gulpConfig => {
  let tasks = gulpConfig.tasks || {};

  let devTasks = tasks.dev || macroTasks.DEFAULT_DEV_SUBTASKS;
  let buildTasks = tasks.build || macroTasks.DEFAULT_BUILD_SUBTASKS;
  let buildSpaTasks = tasks.spa || macroTasks.DEFAULT_SPA_SUBTASKS;

  if (gulpConfig.onTerminate) {
    process.on('SIGINT', gulpConfig.onTerminate.bind(null, 'SIGINT'));
    process.on('SIGTERM', gulpConfig.onTerminate.bind(null, 'SIGTERM'));
    process.on('SIGHUP', gulpConfig.onTerminate.bind(null, 'SIGHUP'));
  }

  function dev(done) {
    return gulp.series(...prepareTasks(devTasks))(done);
  }

  function build(done) {
    return gulp.series(...prepareTasks(buildTasks))(done);
  }

  function buildSpa(done) {
    return gulp.series(...prepareTasks(buildSpaTasks))(done);
  }

  return {
    dev: dev,
    build: build,
    'build:spa': buildSpa
  };

  function prepareTasks(groupedTasks) {
    return groupedTasks.map(
      tasks => (tasks instanceof Array ? gulp.parallel(...tasks) : tasks)
    );
  }
};
