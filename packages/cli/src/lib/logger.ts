import pc from 'picocolors';

/**
 * Print utility functions generator
 *
 * @param {string} prefix Logged prefix text.
 * @param {picocolors} picoColorsFn Styling function.
 * @returns {(message: string, newLine: false) => void} Log function.
 */
function printFnFactory(
  prefix: string,
  picoColorsFn: {
    (input: string | number | null | undefined): string;
  }
) {
  return (message: string, newLine = false) => {
    newLine && console.log('');
    console.log(`${picoColorsFn(`${prefix}:`)} ${message}`);
  };
}

export default {
  info: printFnFactory('info', pc.cyan),
  success: printFnFactory('success', pc.green),
  error: printFnFactory('error', pc.red),
  warn: printFnFactory('warn', pc.yellow),
  hmr: printFnFactory('hmr', pc.magenta)
};
