const chalk = require('chalk');

function createPrintFn(prefix, chalkFn) {
  return content => console.log(`${chalkFn(`${prefix}:`)} ${content}`);
}

module.exports = {
  info: createPrintFn('info', chalk.bold.cyan),
  error: createPrintFn('error', chalk.bold.red),
  warn: createPrintFn('warn', chalk.bold.yellow),
  success: createPrintFn('success', chalk.bold.green),
};
