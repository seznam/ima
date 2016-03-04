
var gulpConfig = require('./gulpConfig.js');

require('ima-gulp-task-loader')([
	'./node_modules/ima-gulp-tasks/tasks',
	'./app/gulp/tasks'
], gulpConfig);
