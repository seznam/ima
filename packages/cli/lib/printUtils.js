const chalk = require('chalk');

function info(content, newLine = false) {
  newLine && console.log('');
  console.log(`${chalk.bold.cyan('info:')} ${content}`);
}

function success(content, newLine = false) {
  newLine && console.log('');
  console.log(`${chalk.bold.green('success:')} ${content}`);
}

function error(content, newLine = false) {
  newLine && console.log('');
  console.log(`${chalk.bold.red('error:')} ${content}`);
}

function warn(content, newLine = false) {
  newLine && console.log('');
  console.log(`${chalk.bold.yellow('warn:')} ${content}`);
}

module.exports = {
  info,
  success,
  error,
  warn
};
