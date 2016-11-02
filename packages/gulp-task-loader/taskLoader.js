
let fs = require('fs');
let path = require('path');

/**
 * Loads gulp tasks from defined directories. The newest gulp tasks will
 * override the older tasks if the names match.
 *
 * @param {string[]} directories The directories from which the gulp tasks
 *        should be loaded.
 * @param {Object<string, *>} gulpConfig Configuration of the gulp tasks.
 */
module.exports = (directories, gulpConfig) => {
	console.log('Loading gulp tasks...');
	let tasks = {};

	for (let directory of directories) {
		tasks = Object.assign(tasks, loadTasks(directory, gulpConfig));
	}

	return tasks;
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
	let directoryFiles;
	try {
		directoryFiles = fs.readdirSync(directory);
	} catch (error) {
		console.warn(
			`The gulp tasks directory ${directory} does not exist, skipping`
		);
		return;
	}

	let allTasks = {};
	directoryFiles.filter(
		file => file.match(/[.]js$/i)
	).forEach((file) => {
		let modulePath = path.resolve(directory + path.sep + file);
		let tasks = require(modulePath);
		if (tasks.__requiresConfig && (typeof tasks.default === 'function')) {
			tasks = tasks(gulpConfig);
		}
		allTasks = Object.assign(allTasks, tasks);
	});

	return allTasks;
}
