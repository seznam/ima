import chalk from 'chalk';

/**
 * Print utility functions generator
 *
 * @param {string} prefix Logged prefix text.
 * @param {chalk} chalkFn Styling function.
 * @returns {(message: string, newLine: false) => void} Log function.
 */
function printFnFactory(
  prefix?: string,
  chalkFn?: {
    (input: string | number | null | undefined): string;
  }
) {
  return (message: string, newLine = true) => {
    if (chalkFn && prefix) {
      process.stdout.write(`${chalkFn(`${prefix}:`)} `);
    }

    process.stdout.write(message);
    newLine && process.stdout.write('\n');
  };
}

// Define logger factory functions
const write = printFnFactory();
const info = printFnFactory('info', chalk.bold.cyan);
const success = printFnFactory('success', chalk.bold.green);
const error = printFnFactory('error', chalk.bold.red);
const warn = printFnFactory('warn', chalk.bold.yellow);
const update = printFnFactory('update', chalk.bold.magenta);
const plugin = printFnFactory('plugin', chalk.bold.blue);

export { write, info, success, error, warn, update, plugin };
