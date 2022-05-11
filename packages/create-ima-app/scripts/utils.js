import chalk from 'chalk';

function createPrintFn(prefix, chalkFn) {
  return content => console.log(`${chalkFn(`${prefix}:`)} ${content}`);
}

const info = createPrintFn('info', chalk.bold.cyan);
const error = createPrintFn('error', chalk.bold.red);
const warn = createPrintFn('warn', chalk.bold.yellow);
const success = createPrintFn('success', chalk.bold.green);

export { info, error, warn, success };
