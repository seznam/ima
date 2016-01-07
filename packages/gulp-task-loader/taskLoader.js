
var fs = require('fs');
var path = require('path');

/**
 * Loads gulp tasks from defined directories. The
 * newest gulp tasks will override the older tasks if the names
 * match.
 *
 * @param {Array<string>} directories
 * @param {Object<string, *>} gulpConfig Configuration of the gulp tasks.
 */
 module.exports = function (directories, gulpConfig) {
 	console.log('Loading gulp tasks...');

 	for (var i = 0; i < directories.length; i++) {
 		var directory = directories[i];

 		loadTasks(directory, gulpConfig);
 	}
 };

/**
 * Loads the gulp tasks defined in the JavaScript files within the specified
 * directory. The JavaScript files are executed in arbitrary order.
 *
 * @param {string} directory The directory containing the JavaScript files
 *        defining the gulp tasks.
 * @param {Object<string, *>} gulpConfig Configuration of the gulp tasks.
 */
function loadTasks(directory, gulpConfig) {
	if (!fs.existsSync(directory)) {
		console.warn('The gulp tasks directory ' + directory + ' does not ' +
				'exist, skipping');
		return;
	}

	fs.readdirSync(directory).filter(function (file) {
		return file.match(/[.]js$/i);
	}).forEach(function (file) {
		var modulePath = path.resolve(directory + path.sep + file);
		var factory = require(modulePath);
		if (factory instanceof Function) {
			factory(gulpConfig);
		}
	});
}
