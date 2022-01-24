const chalk = require('chalk');

function info(content, newLine = false) {
  // eslint-disable-next-line no-console
  newLine && console.log('');
  // eslint-disable-next-line no-console
  console.log(`${chalk.bold.green('info:')} ${content}`);
}

function error(content, newLine = false) {
  // eslint-disable-next-line no-console
  newLine && console.log('');
  // eslint-disable-next-line no-console
  console.log(`${chalk.bold.red('error:')} ${content}`);
}

module.exports = {
  info,
  error,
};
