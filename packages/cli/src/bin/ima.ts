#!/usr/bin/env node
import path from 'path';

import chalk from 'chalk';
import yargs from 'yargs';

// Normalize NODE_ENV
if (process.env.NODE_ENV && process.env.NODE_ENV === 'dev') {
  process.env.NODE_ENV = 'development';
}

yargs
  .scriptName(chalk.green.bold('ima'))
  .usage('Usage: $0 <command>')
  .commandDir(path.resolve(__dirname, '../scripts'))
  .demandCommand(1, 'You need to run at least one command to move on')
  .help()
  .updateStrings({
    'Examples:': chalk.bold.cyan('Examples:'),
    'Options:': chalk.bold.cyan('Options:'),
    'Commands:': chalk.bold.cyan('Commands:'),
  })
  .updateLocale({
    choices: chalk.gray('choices'),
    count: chalk.gray('count'),
    boolean: chalk.gray('boolean'),
    number: chalk.gray('number'),
    string: chalk.gray('string'),
    aliases: chalk.gray('aliases'),
    'generated-value': chalk.gray('generated-value'),
    default: chalk.magenta('default'),
    required: chalk.yellow('required'),
  })
  .wrap(null).argv;

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
process.on('SIGUSR2', () => process.exit(0));
process.on('exit', () => process.exit(0));
