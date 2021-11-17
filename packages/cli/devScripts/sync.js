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

function createWatcher(baseDir, paths, destFolder, options = {}) {
  const pkgName = baseDir.match(/ima\/packages\/(\w+)/i)[1];
  const watcher = chokidar.watch(path.join(baseDir, paths), {
    persistent: true,
    cwd: baseDir,
    ignored: ['**/__tests__/**', '**/__mocks__/**', ...(options?.ignored ?? [])]
  });

  const timeNow = () => {
    let d = new Date(),
      h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
      m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
      s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

    return `${h}:${m}:${s}`;
  };

  const actionCreator = actionName => filePath => {
    const startTime = Date.now();
    const src = path.resolve(baseDir, filePath);
    const dest = path.resolve(destFolder, filePath);

    const callback = err => {
      if (err) {
        console.log(`${pc.magenta(`[${pkgName}]`)} ${pc.red('error')} ${err}`);
      } else {
        console.log(
          `${pc.gray(timeNow())} - ${pc.magenta(`[${pkgName}]`)} ${pc[
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

const destFolder = path.resolve(process.argv[2], 'node_modules');
const destImaFolder = path.join(destFolder, '@ima');

// @ima/cli
const cliDir = path.resolve(__dirname, '../');

createWatcher(path.join(cliDir, 'node_modules'), '**/*', destFolder, {
  skipExisting: true
});

createWatcher(
  cliDir,
  '/dist/**/*.(js|cjs|mjs)',
  path.join(destImaFolder, 'cli'),
  {
    ignored: ['**/node_modules/**']
  }
);

child.spawn('npm', ['run', 'dev'], {
  stdio: 'ignore',
  cwd: cliDir
});

// @ima/core
const coreDir = path.resolve(__dirname, '../../core');

createWatcher(coreDir, '/**/*.(js|cjs|mjs)', path.join(destImaFolder, 'core'), {
  ignored: ['**/node_modules/**']
});

child.spawn('npm', ['run', 'build', '--', '--watch'], {
  stdio: 'ignore',
  cwd: coreDir
});

// @ima/server
const serverDir = path.resolve(__dirname, '../../server');

createWatcher(path.join(serverDir, 'node_modules'), '**/*', destFolder, {
  skipExisting: true
});

createWatcher(
  serverDir,
  '/**/*.(js|cjs|mjs)',
  path.join(destImaFolder, 'server'),
  {
    ignored: ['**/node_modules/**']
  }
);
