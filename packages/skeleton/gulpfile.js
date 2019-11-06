let gulpConfig = require('./gulpConfig.js');

module.exports = require('ima-gulp-task-loader')(
  [
    './node_modules/ima-gulp-tasks/tasks',
    './node_modules/ima-examples/tasks',
    './app/gulp/tasks'
  ],
  gulpConfig
);
