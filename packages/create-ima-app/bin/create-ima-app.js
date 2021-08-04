#!/usr/bin/env node

const path = require('path');
const execa = require('execa');
const chalk = require('chalk');
const argv = require('yargs').argv;

const { checkNodeVersion } = require('../utils/utils');
const { error } = require('../utils/printUtils');

const MIN_NODE_VERSION = 14;
const MAX_NODE_VERSION = 16;

if (argv._.length === 0) {
  // eslint-disable-next-line no-console
  console.log(`
Please specify your new project directory: 
  ${chalk.blue('create-ima-app')} ${chalk.green('<project-directory>')}

For example:
  ${chalk.blue('create-ima-app')} ${chalk.green('my-ima-application')}`);

  process.exit(0);
}

if (!checkNodeVersion(MIN_NODE_VERSION, MAX_NODE_VERSION)) {
  // eslint-disable-next-line no-console
  error(
    `You are currently using ${chalk.bold(
      'unsupported version'
    )} of NodeJS (${chalk.bold(process.version)}).
       Please updated NodeJS to the latest supported major version: ${chalk.bold(
         `v${MAX_NODE_VERSION}.x.x`
       )}.`
  );

  process.exit(0);
}

execa.sync(
  'node',
  [path.resolve(__dirname, '../scripts/create.js'), ...process.argv.slice(2)],
  {
    stdio: 'inherit'
  }
);
