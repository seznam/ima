
var gulpConfig = require('./gulpConfig.js');

require('ima.js-gulp-task-loader')([
	'./node_modules/ima.js-gulp-tasks/tasks',
	'./app/gulp/tasks'
], gulpConfig);
