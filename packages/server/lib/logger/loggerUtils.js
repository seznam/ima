const chalk = require('chalk');

function colorizeLevel(level) {
  switch (level) {
    case 'error':
      return chalk.bold.red(`${level}: `);
    case 'warn':
      return chalk.bold.yellow(`${level}: `);
    case 'info':
      return chalk.bold.cyan(`${level}: `);
    case 'http':
      return chalk.bold.magenta(`${level}: `);
    case 'verbose':
      return chalk.bold.underline.white(`${level}: `);
    case 'debug':
      return chalk.bold.green(`${level}: `);
    case 'silly':
    default:
      return chalk.bold.gray(`${level}: `);
  }
}

module.exports = { colorizeLevel };
