
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');

// load IMA.js gulp tasks
loadTasks('./imajs/gulp/tasks');
loadTasks('./app/gulp/tasks');

/**
 * Loads the gulp tasks defined in the JavaScript files within the specified
 * directory. The JavaScript files are executed in arbitrary order.
 *
 * @param {string} directory The directory containing the JavaScript files
 *        defining the gulp tasks.
 */
function loadTasks(directory) {
	directory = directory.split('/').join(path.sep); // normalize

	if (!fs.existsSync(directory)) {
		console.warn('The gulp tasks directory ' + directory + ' does not ' +
				'exist, skipping');
		return;
	}

	fs.readdirSync(directory).filter(function (file) {
		return file.match(/[.]js$/i);
	}).forEach(function (file) {
		require(directory + path.sep + file);
	});
}
