#!/usr/bin/env node

const path = require('path');
const execa = require('execa');
const chalk = require('chalk');
const argv = require('yargs').argv;

const { error, warn } = require('../utils');

const MIN_NODE_VERSION = 14;
const MAX_NODE_VERSION = 14;

if (argv._.length === 0) {
  console.log(`
Please specify your new project directory:
  ${chalk.blue('create-ima-app')} ${chalk.green('<project-directory>')}

For example:
  ${chalk.blue('create-ima-app')} ${chalk.green('my-ima-application')}`);

  process.exit(0);
}

const nodeMajorVersion = process.version.substring(1).split('.')[0];

// Hard cap min supported major version of NodeJS
if (nodeMajorVersion < MIN_NODE_VERSION) {
  error(
    `You are currently using ${chalk.bold.red(
      'unsupported version'
    )} of NodeJS (${chalk.bold(process.version)}).
       Please updated to the latest supported major version: ${chalk.bold.magenta(
         `v${MAX_NODE_VERSION}.x.x`
       )}.`
  );

  process.exit(0);
}

// Soft cap min supported major version of NodeJS
if (nodeMajorVersion > MAX_NODE_VERSION) {
  warn(
    `You are currently using newer version of NodeJS ${chalk.bold.yellow(
      process.version
    )}
      than the one currently supported (${chalk.bold.magenta(
        `v${MAX_NODE_VERSION}.x.x`
      )}). We will proceed with the installation
      but keep in mind, that this can cause some unknown issues with the application.\n`
  );
}

execa.sync(
  'node',
  [path.resolve(__dirname, '../scripts/create.js'), ...process.argv.slice(2)],
  {
    stdio: 'inherit',
  }
);
