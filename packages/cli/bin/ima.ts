#!/usr/bin/env node
import path from 'path';
import yargs from 'yargs';
import chalk from 'chalk';

yargs
  .scriptName('ima')
  .usage('Usage: $0 <command>')
  .commandDir(path.resolve(__dirname, '../scripts'))
  .demandCommand(1, 'You need to run at least one command to move on')
  .help()
  .updateStrings({
    'Examples:': chalk.cyan('Examples:'),
    'Options:': chalk.cyan('Options:'),
    'Commands:': chalk.cyan('Commands:')
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
    required: chalk.yellow('required')
  })
  .wrap(null).argv;

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
process.on('SIGUSR2', () => process.exit(0));
process.on('exit', () => process.exit(0));
