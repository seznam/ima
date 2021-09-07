import chalk from 'chalk';

/**
 * Print utility functions generator
 *
 * @param {string} prefix Logged prefix text.
 * @param {chalk.Chalk} chalkFn Styling chalk function.
 * @returns {(message: string, newLine: false) => void} Log function.
 */
function printFnFactory(prefix: string, chalkFn: chalk.Chalk) {
  return (message: string, newLine = false) => {
    newLine && console.log('');
    console.log(`${chalkFn(`${prefix}:`)} ${message}`);
  };
}

const info = printFnFactory('info', chalk.cyan.bold);
const success = printFnFactory('success', chalk.green.bold);
const error = printFnFactory('error', chalk.red.bold);
const warn = printFnFactory('warn', chalk.yellow.bold);
const update = printFnFactory('update', chalk.magenta.bold);

export { info, success, error, warn, update };
