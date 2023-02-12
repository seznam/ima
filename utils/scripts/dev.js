#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const yargs = require('yargs');

const { initApp, copyChanges, watchChanges } = require('./utils/utils');

const IGNORED_PACKAGES = [
  'create-ima-app',
  'devtools',
  'devtools-scripts',
  'gulp-task-loader',
  'gulp-tasks',
];

const cliArgs = yargs
  .usage('Usage: npm run dev <destFolder>')
  .example([
    ['npm run dev ~/Desktop/ima-app'],
    ['npm run dev ~/Desktop/ima-app -- --watch=core cli hmr-client'],
    ['npm run dev ~/Desktop/ima-app -- --force --init'],
    ['npm run dev ~/Desktop/ima-app -- --force --init --watch=server core'],
    ['npm run dev ~/Desktop/ima-app -- --build'],
    ['npm run dev ~/Desktop/ima-app -- --watch'],
  ])
  .positional('destFolder', {
    type: 'string',
    description:
      'Destination folder for the app generated using create-ima-app script.',
  })
  .option('force', {
    alias: 'f',
    type: 'boolean',
    description:
      'Force reinstall of the application if the directory already exist.',
  })
  .option('init', {
    alias: 'i',
    type: 'boolean',
    description: 'Build, pack and reinstall packages after the app is created.',
  })
  .option('build', {
    alias: 'b',
    type: 'array',
    description: 'Package names, which should be built and copied once.',
  })
  .option('watch', {
    alias: 'w',
    type: 'array',
    description: 'Package names, which are watched and copied on changes.',
  })
  .version(false)
  .parse();

function pkgFilter(paths, needles) {
  if (!needles.length) {
    return paths;
  }

  // Filter pkg names
  return paths.filter(path =>
    needles.some(needle => needle === path.split('/').pop())
  );
}

(async () => {
  if (!cliArgs._.length) {
    console.error(
      chalk.red('Path to a destination app not provided in the first argument.')
    );

    return process.exit(1);
  }

  const [destDir] = cliArgs._;
  const rootDir = path.resolve(__dirname, '../..');
  const pkgDirs = fs
    .readdirSync(path.join(rootDir, 'packages'))
    .filter(dir => !['.', '..', '.DS_Store', ...IGNORED_PACKAGES].includes(dir))
    .map(dir => path.resolve(rootDir, 'packages', dir));

  // Init application
  initApp(destDir, pkgDirs, cliArgs);

  // Handle build command
  if (cliArgs.build) {
    copyChanges(destDir, pkgFilter(pkgDirs, cliArgs.build));
  }

  // Handle watch command
  if (cliArgs.watch) {
    watchChanges(destDir, pkgFilter(pkgDirs, cliArgs.watch));
  }

  const imaConfigPath = path.join(destDir, 'ima.config.js');

  // Copy "dev" ima config into the application, if it doesn't have any
  if (!fs.existsSync(imaConfigPath)) {
    fs.copyFileSync(
      path.join(__dirname, './utils/ima.config.js'),
      imaConfigPath
    );
  }
})();

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
process.on('SIGUSR2', () => process.exit(0));
process.on('exit', () => process.exit(0));
