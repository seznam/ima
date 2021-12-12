#!/usr/bin/env node

/**
 * Utility script to sync multiple ima packages into test application
 * used mainly for IMA cli debugging and development. Can't be deleted
 * when no longer needed.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const pc = require('picocolors');
const chokidar = require('chokidar');
const child = require('child_process');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

function shell(cmd, cwd = process.cwd()) {
  console.log(pc.cyan('Running:'), cmd);
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
        ...(options?.ignored ?? [])
      ]
    });

    const actionCreator = actionName => filePath => {
      const startTime = Date.now();
      const src = path.resolve(baseDir, filePath);
      const dest = path.resolve(destFolder, filePath);

      const callback = err => {
        if (err) {
          console.log(`${pc.magenta(`[${name}]`)} ${pc.red('error')} ${err}`);
        } else {
          console.log(
            `${pc.gray(timeNow())} - ${pc.magenta(`[${name}]`)} ${pc[
              actionName === 'copy' ? 'green' : 'yellow'
            ](actionName === 'copy' ? 'copied' : 'unlinked')} /${path.relative(
              path.join(destFolder, '..'),
              dest
            )} ${pc.gray(`[${Date.now() - startTime}ms]`)}`
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

function main() {
  yargs.boolean('force').argv;

  if (yargs.argv._.length === 0) {
    throw new Error(
      'Path to a destination app not provided in the first argument.'
    );
  }

  const destFolder = path.resolve(yargs.argv._[0]);
  const destNodeModules = path.join(destFolder, 'node_modules');
  const cliDir = path.resolve(__dirname, '..');
  const coreDir = path.resolve(__dirname, '../../core');
  const serverDir = path.resolve(__dirname, '../../server');
  const errorOverlayDir = path.resolve(__dirname, '../../error-overlay');

  // Init app
  if (!fs.existsSync(destFolder)) {
    shell(
      `${path.resolve(
        __dirname,
        '../../create-ima-app/bin/create-ima-app.js'
      )} ${destFolder} --example=hello`
    );

    // Build, pack and install current dependencies
    shell('npm pack', cliDir);
    shell('npm run build', cliDir);
    shell('npm pack', coreDir);
    shell('npm run build', coreDir);
    shell('npm pack', errorOverlayDir);
    shell('npm run build', errorOverlayDir);
    shell('npm pack', serverDir);

    const cliPack = path.resolve(
      cliDir,
      `ima-cli-${require(path.join(cliDir, 'package.json')).version}.tgz`
    );
    const corePack = path.resolve(
      coreDir,
      `ima-core-${require(path.join(coreDir, 'package.json')).version}.tgz`
    );
    const errorOverlayPack = path.resolve(
      errorOverlayDir,
      `ima-error-overlay-${
        require(path.join(errorOverlayDir, 'package.json')).version
      }.tgz`
    );
    const serverPack = path.resolve(
      serverDir,
      `ima-server-${require(path.join(serverDir, 'package.json')).version}.tgz`
    );

    // Install packages
    shell(`npm install ${cliPack}`, destFolder);
    shell(`npm install ${corePack}`, destFolder);
    shell(`npm install ${errorOverlayPack}`, destFolder);
    shell(`npm install ${serverPack}`, destFolder);

    // Clean pack files
    fs.rmSync(cliPack);
    fs.rmSync(corePack);
    fs.rmSync(errorOverlayPack);
    fs.rmSync(serverPack);
  } else {
    console.log(
      'The app destination folder already exists, skipping initialization...'
    );
  }

  const destCore = path.join(destNodeModules, '@ima/core');
  const destCli = path.join(destNodeModules, '@ima/cli');
  const destServer = path.join(destNodeModules, '@ima/server');
  const destErrorOverlay = path.join(destNodeModules, '@ima/error-overlay');

  // Start watchers to sync src and node_modules from packages
  // @ima/cli
  createWatcher(
    'cli',
    cliDir,
    '/dist/**/*.(js|cjs|mjs|json|ejs|map|wasm|css)',
    destCli
  );

  // Spawn ts compiler in watch mode
  child.spawn('npm', ['run', 'dev'], {
    stdio: 'ignore',
    cwd: cliDir
  });

  // @ima/core
  createWatcher(
    'core',
    coreDir,
    '/dist/**/*.(js|cjs|mjs|json|ejs|map|wasm|css)',
    destCore
  );

  // Spawn rollup in watch mode
  child.spawn('npm', ['run', 'build', '--', '--watch'], {
    stdio: 'ignore',
    cwd: coreDir
  });

  // @ima/error-overlay
  createWatcher(
    'errorOverlay',
    errorOverlayDir,
    '/dist/**/*.(js|cjs|mjs|json|ejs|map|wasm|css)',
    destErrorOverlay
  );

  // Spawn ts compiler in watch mode
  child.spawn('npm', ['run', 'dev'], {
    stdio: 'ignore',
    cwd: errorOverlayDir
  });

  // @ima/server
  createWatcher(
    'server',
    serverDir,
    '/**/*.(js|cjs|mjs|json|ejs|map|wasm|css)',
    destServer
  );
}

main();
