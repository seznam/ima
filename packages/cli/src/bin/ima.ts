#!/usr/bin/env node
import path from 'path';
import yargs from 'yargs';
import pc from 'picocolors';

yargs
  .scriptName('ima')
  .usage('Usage: $0 <command>')
  .commandDir(path.resolve(__dirname, '../scripts'))
  .demandCommand(1, 'You need to run at least one command to move on')
  .help()
  .updateStrings({
    'Examples:': pc.cyan('Examples:'),
    'Options:': pc.cyan('Options:'),
    'Commands:': pc.cyan('Commands:')
  })
  .updateLocale({
    choices: pc.gray('choices'),
    count: pc.gray('count'),
    boolean: pc.gray('boolean'),
    number: pc.gray('number'),
    string: pc.gray('string'),
    aliases: pc.gray('aliases'),
    'generated-value': pc.gray('generated-value'),
    default: pc.magenta('default'),
    required: pc.yellow('required')
  })
  .wrap(null).argv;

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
process.on('SIGUSR2', () => process.exit(0));
process.on('exit', () => process.exit(0));
