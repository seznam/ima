const fs = require('fs');
const path = require('path');

/**
 * Loads gulp tasks from defined directories or JS files in case of a single task.
 * The newest gulp tasks will * override the older tasks if the names match.
 *
 * @param {string[]} inputs Either directories from which the gulp tasks
 *        should be loaded or single tasks to be loaded.
 * @param {Object<string, *>} gulpConfig Configuration of the gulp tasks.
 */
module.exports = (inputs, gulpConfig) => {
  // eslint-disable-next-line no-console
  console.info('Loading gulp tasks...');
  let tasks = {};

  for (let input of inputs) {
    try {
      tasks = Object.assign(
        tasks,
        (fs.statSync(input).isDirectory() ? loadTasks : loadTask)(
          input,
          gulpConfig
        )
      );
    } catch (error) {
      console.warn(
        `Failed to load gulp task ${input}, skipping`,
        error.message
      );
    }
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
      `The gulp tasks directory ${directory} does not exist, skipping`,
      error.message
    );

    return;
  }

  let allTasks = {};
  directoryFiles
    .filter((file) => file.match(/[.]js$/i))
    .forEach((file) => {
      let modulePath = path.resolve(directory + path.sep + file);
      let tasks = require(modulePath);

      if (tasks.__requiresConfig && typeof tasks.default === 'function') {
        tasks = tasks.default(gulpConfig);
      }

      allTasks = Object.assign(allTasks, tasks);
    });

  return allTasks;
}

/**
 * Loads single gulp task defined in specified JavaScript file.
 *
 * @param {string} file The file containing desired gulp task.
 * @param {Object<string, *>} gulpConfig Configuration of the gulp tasks.
 */
function loadTask(file, gulpConfig) {
  let modulePath = path.resolve(file);
  let task = require(modulePath);

  if (task.__requiresConfig && typeof task.default === 'function') {
    task = task.default(gulpConfig);
  }

  return task;
}
