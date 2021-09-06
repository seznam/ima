import chalk from 'chalk';

function printFnFactory(name: string, chalkFn: chalk.Chalk) {
  return (message: string, newLine = false) => {
    newLine && console.log('');
    console.log(`${chalkFn(`${name}:`)} ${message}`);
  };
}

const info = printFnFactory('info', chalk.cyan.bold);
const success = printFnFactory('success', chalk.green.bold);
const error = printFnFactory('error', chalk.red.bold);
const warn = printFnFactory('warn', chalk.yellow.bold);
const update = printFnFactory('update', chalk.magenta.bold);

export { info, success, error, warn, update };
