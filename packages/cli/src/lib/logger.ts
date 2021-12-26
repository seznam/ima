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

export default {
  write: printFnFactory(),
  info: printFnFactory('info', chalk.bold.cyan),
  success: printFnFactory('success', chalk.bold.green),
  error: printFnFactory('error', chalk.bold.red),
  warn: printFnFactory('warn', chalk.bold.yellow),
  hmr: printFnFactory('hmr', chalk.bold.magenta)
};
