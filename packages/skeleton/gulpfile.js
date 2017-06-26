
let gulpConfig = require('./gulpConfig.js');

module.exports = require('ima-gulp-task-loader')([
	'./node_modules/ima-gulp-tasks/tasks',
	'./app/gulp/tasks'
], gulpConfig);
