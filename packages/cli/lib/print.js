const chalk = require('chalk');

function printFactory(printFunctions) {
  return printFunctions.reduce((acc, [name, chalkFn]) => {
    acc[name] = (content, newLine = false) => {
      newLine && console.log('');
      console.log(`${chalkFn(`${name}:`)} ${content}`);
    };

    return acc;
  }, {});
}

module.exports = printFactory([
  ['info', chalk.bold.cyan],
  ['success', chalk.bold.green],
  ['error', chalk.bold.red],
  ['warn', chalk.bold.yellow],
  ['update', chalk.bold.magenta]
]);
