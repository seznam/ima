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

if (process.argv.length < 2 || !process.argv[2]) {
  throw new Error(
    "Invalid argument provided, couldn't resolve path to destination test app."
  );
}

function createWatcher(baseDir, paths) {
  const destFolder = path.resolve(process.argv[2], 'node_modules/@ima');
  const pkgName = `@ima/${path.resolve(baseDir).split(path.sep).pop()}`;

  const watcher = chokidar.watch(path.join(baseDir, paths), {
    persistent: true,
    ignored: ['**/node_modules/**', '**/__tests__/**', '**/__mocks__/**'],
    cwd: path.resolve(baseDir, '..')
  });

  const actionCreator = actionName => filePath => {
    const startTime = Date.now();
    const src = path.resolve(baseDir, '..', filePath);
    const dest = path.resolve(destFolder, filePath);

    const callback = err => {
      if (err) {
        console.log(`${pc.magenta(`[${pkgName}]`)} ${pc.red('error')} ${err}`);
      } else {
        console.log(
          new Date().toLocaleString(),
          `${pc.magenta(`[${pkgName}]`)} ${pc[
            actionName === 'copy' ? 'green' : 'yellow'
          ](actionName === 'copy' ? 'copied' : 'unlinked')} /${path.relative(
            destFolder,
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
        }

        return fs.copyFile(src, dest, callback);

      case 'unlink':
        return fs.unlink(dest, callback);
    }
  };

  watcher
    .on('add', actionCreator('copy'))
    .on('change', actionCreator('copy'))
    .on('unlink', actionCreator('unlink'));
}

/**
 * Create watchers and init build tools
 */

// @ima/cli
const cliDir = path.resolve(__dirname, '../');

createWatcher(cliDir, '/dist/**/*.(js|cjs|mjs)');
child.spawn('npm', ['run', 'dev'], {
  stdio: 'ignore',
  cwd: cliDir
});

// @ima/core
const coreDir = path.resolve(__dirname, '../../core');

createWatcher(coreDir, '/**/*.(js|cjs|mjs)');
child.spawn('npm', ['run', 'build', '--', '--watch'], {
  stdio: 'ignore',
  cwd: coreDir
});

// @ima/server
createWatcher(path.resolve(__dirname, '../../server/'), '/**/*.(js|cjs|mjs)');
