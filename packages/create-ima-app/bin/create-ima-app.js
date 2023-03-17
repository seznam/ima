#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';

import { create } from '../scripts/create.js';
import { error, warn } from '../scripts/utils.js';

const MIN_NODE_VERSION = 16;
const MAX_NODE_VERSION = 18;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.argv.length === 2) {
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

// Run create script
create(process.argv[2], process.argv.includes('--typescript'));
