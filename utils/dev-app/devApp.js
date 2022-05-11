#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

/**
 * Utility script which generates `hello` ima application template
 * from current version of source files (local) using locally build
 * and packed npm packages (e.g. all packages are manually packed and installed).
 * This is usefull during development if you want to generate new ima app
 * with the current package versions and optionally watch and sync them
 * to the destination app directory.
 *
 * @example
 * ./utils/dev-app/devApp.js [path to ima hello template]
 * ./utils/dev-app/devApp.js [path to ima hello template] --watch=cli hmr-client server
 * ./utils/dev-app/devApp.js [path to ima hello template] --build=cli hmr-client server
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const child = require('child_process');
const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const chokidar = require('chokidar');
const fsExtra = require('fs-extra');

function shell(cmd, cwd = process.cwd()) {
  console.log(chalk.bold.cyan('Running:'), cmd);
  child.execSync(cmd, { stdio: 'inherit', cwd });
}

function timeNow() {
  let d = new Date(),
    h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
    m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
    s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

  return `${h}:${m}:${s}`;
}

function createWatcher(name, baseDir, paths, destFolder, options = {}) {
  try {
    const watcher = chokidar.watch(path.join(baseDir, paths), {
      persistent: true,
      cwd: baseDir,
      ignored: [
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/.bin/**',
        '**/node_modules/**',
        ...(options?.ignored ?? []),
      ],
    });

    const actionCreator = actionName => filePath => {
      const startTime = Date.now();
      const src = path.resolve(baseDir, filePath);
      const dest = path.resolve(destFolder, filePath);

      const callback = err => {
        if (err) {
          console.log(
            `${chalk.magenta(`[${name}]`)} ${chalk.red('error')} ${err}`
          );
        } else {
          console.log(
            `${chalk.gray(timeNow())} - ${chalk.magenta(`[${name}]`)} ${chalk[
              actionName === 'copy' ? 'green' : 'yellow'
            ](actionName === 'copy' ? 'copied' : 'unlinked')} /${path.relative(
              path.join(destFolder, '..'),
              dest
            )} ${chalk.gray(`[${Date.now() - startTime}ms]`)}`
          );
        }
      };

      switch (actionName) {
        case 'copy':
          if (!fs.existsSync(dest)) {
            let destDir = dest.split(path.sep);
            destDir.pop();
            destDir = destDir.join(path.sep);

            fs.mkdirSync(destDir, { recursive: true });
          } else if (options?.skipExisting) {
            return;
          }

          fs.copyFile(src, dest, err => {
            // Fix ima binary not being executable
            if (name === 'cli' && filePath.includes('bin/ima.js')) {
              fs.chmodSync(path.join(destFolder, '../../.bin/ima'), '755');
            }

            callback(err);
          });

          break;

        case 'unlink':
          fs.unlink(dest, callback);
          break;
      }
    };

    watcher
      .on('add', actionCreator('copy'))
      .on('change', actionCreator('copy'))
      .on('unlink', actionCreator('unlink'));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

// Builds and packs each npm packages and installs it into the app directory
function initApp(destFolder, pkgDirs) {
  if (!fs.existsSync(destFolder)) {
    shell(
      `${path.resolve(
        __dirname,
        '../../packages/create-ima-app/bin/create-ima-app.js'
      )} ${destFolder}`
    );

    // Build, pack and install as current dependencies
    pkgDirs.forEach(pkgDir => {
      const pkgJson = require(path.join(pkgDir, 'package.json'));

      pkgJson.scripts.build && shell('npm run build', pkgDir);
      shell('npm pack', pkgDir);

      const [prefix, name] = pkgJson.name.split('/');
      const packFileName = `ima-${name}-${pkgJson.version}.tgz`;
      const packFilePath = path.join(pkgDir, packFileName);

      shell(`npm install ${packFilePath}`, destFolder);
      fs.rmSync(packFilePath);
    });
  } else {
    console.log(
      'The app destination folder already exists, skipping initialization...'
    );
  }
}

// Builds and copies current pacakges into the destination
function watchChanges(destFolder, pkgDirs) {
  const destNodeModules = path.join(destFolder, 'node_modules');

  pkgDirs.forEach(pkgDir => {
    const pkgJson = require(path.join(pkgDir, 'package.json'));
    const destPkgDir = path.join(destNodeModules, pkgJson.name);
    const [prefix, name] = pkgJson.name.split('/');

    // Spawn watch
    if (pkgJson.scripts.dev) {
      child.spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        cwd: pkgDir,
      });
    } else if (pkgJson.scripts.build) {
      child.spawn('npm', ['run', 'build', '--', '--watch'], {
        stdio: 'inherit',
        cwd: pkgDir,
      });
    }

    // Create file watcher
    createWatcher(
      name,
      pkgDir,
      pkgJson.name === '@ima/server'
        ? '/**/*.(js|cjs|mjs|json|ejs|map|wasm|d.ts|gz|br|css)'
        : '/dist/**/*.(js|cjs|mjs|json|ejs|map|wasm|d.ts|gz|br|css)',
      destPkgDir
    );
  });
}

// Builds and copies current pacakges into the destination
function copyChanges(destFolder, pkgDirs) {
  const destNodeModules = path.join(destFolder, 'node_modules');

  pkgDirs.forEach(pkgDir => {
    const pkgJson = require(path.join(pkgDir, 'package.json'));
    const destPkgDir = path.join(destNodeModules, pkgJson.name);

    if (pkgJson.name === '@ima/server') {
      fs.rmSync(destPkgDir, {
        force: true,
        recursive: true,
      });

      // Copy new dist
      fsExtra.copySync(pkgDir, destPkgDir);
    } else {
      // Build
      pkgJson.scripts.build && shell('npm run build', pkgDir);

      // Remove old dist
      fs.rmSync(path.join(destPkgDir, 'dist'), {
        force: true,
        recursive: true,
      });

      // Copy new dist
      fsExtra.copySync(
        path.join(pkgDir, 'dist'),
        path.join(destPkgDir, 'dist')
      );
    }
  });
}

function main() {
  if (process.argv.length <= 2) {
    throw new Error(
      'Path to a destination app not provided in the first argument.'
    );
  }

  const destFolder = path.resolve(process.argv[2]);
  const pkgDirs = [
    path.resolve(__dirname, '../../packages/cli/'),
    path.resolve(__dirname, '../../packages/core'),
    path.resolve(__dirname, '../../packages/server'),
    path.resolve(__dirname, '../../packages/error-overlay'),
    path.resolve(__dirname, '../../packages/hmr-client'),
    path.resolve(__dirname, '../../packages/dev-utils'),
  ];

  // Init app
  initApp(destFolder, pkgDirs);

  const pkgFilter = (paths, needles) => {
    if (!needles.length) {
      return paths;
    }

    // Filter pkg names
    return paths.filter(path =>
      needles.some(needle => needle === path.split('/').pop())
    );
  };

  // Parse watch and build params
  const pkgFilters = process.argv
    .slice(3)
    .filter(v => v !== '--')
    .map(arg => arg.replace(/--(watch|build)=/, ''));

  // Copy and watch changes
  if (process.argv.find(arg => arg.startsWith('--watch'))) {
    watchChanges(destFolder, pkgFilter(pkgDirs, pkgFilters));
  }

  // Build and copy changes only
  if (process.argv.find(arg => arg.startsWith('--build'))) {
    copyChanges(destFolder, pkgFilter(pkgDirs, pkgFilters));
  }
}

main();
