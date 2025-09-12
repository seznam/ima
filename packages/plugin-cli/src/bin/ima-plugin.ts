#!/usr/bin/env node
import chalk from 'chalk';
import yargs from 'yargs';

import { build, watch } from '../utils/commands';

yargs
  .scriptName(chalk.green.bold('ima-plugin'))
  // .description('CLI helper to build ima plugins')
  .usage('Usage: $0 <command>')
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
  .option('clientServerConfig', {
    desc: 'Use client/server build configuration instead of the default one',
    type: 'boolean',
    default: false,
  })
  .option('nodeConfig', {
    desc: 'Use node build configuration instead of the default one',
    type: 'boolean',
    default: false,
  })
  .option('silent', {
    alias: 's',
    desc: 'Disable logging status messages',
    type: 'boolean',
    default: false,
  })
  .option('jsxRuntime', {
    alias: 'j',
    desc: 'Override JSX runtime option',
    type: 'string',
    choices: ['classic', 'automatic'],
    default: 'automatic',
  })
  .option('additionalWatchPaths', {
    alias: 'w',
    desc: 'Array of additional watch paths to use when linking package. Can be either directories or files (globs are not supported).',
    type: 'array',
  })
  .command('build', 'Build ima plugin at current directory', {}, build)
  .command('dev', 'Watch ima plugin at current directory', {}, watch)
  .command(
    'link <path>',
    'Link ima plugin at current directory to ima application at given path',
    {},
    watch
  )
  .wrap(null).argv;
