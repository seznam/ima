#!/usr/bin/env node
import path from 'path';
import yargs from 'yargs';

yargs
  .scriptName('ima')
  .usage('Usage: $0 <command>')
  .commandDir(path.resolve(__dirname, '../scripts'))
  .demandCommand(1, 'You need to run at least one command to move on')
  .help()
  .wrap(null).argv;

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
process.on('SIGUSR2', () => process.exit(0));
process.on('exit', () => process.exit(0));
