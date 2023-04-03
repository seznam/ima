/* eslint-disable no-console */
const child = require('child_process');
const path = require('path');

const chalk = require('chalk');
const chokidar = require('chokidar');
const fs = require('fs-extra');

const IGNORED = [
  '.DS_Store',
  '.npmignore',
  'LICENSE',
  'README.md',
  'CHANGELOG.md',
  'tsconfig.json',
  'webpack.config.js',
  'rollup.config.mjs',
  'jest.config.js',
  'src',
  '**/*.tgz',
  '**/tsconfig.build.tsbuildinfo/**',
  '**/node_modules/**',
  '**/typings/**',
  '**/__mocks__/**',
  '**/__tests__/**',
];

let runningProcesses = [];

/**
 * Simple wrapper for shell command using child.execSync.
 */
function shell(cmd, cwd = process.cwd()) {
  console.log(chalk.bold.cyan('\nRunning:'), cmd);
  child.execSync(cmd, { stdio: 'inherit', cwd });
}

/**
 * Prints current time in HH:MM:SS format.
 */
function timeNow() {
  let d = new Date(),
    h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
    m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
    s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

  return chalk.gray(`[${h}:${m}:${s}]`);
}

function createWatcher(name, baseDir, paths, destFolder, options = {}) {
  try {
    const watcher = chokidar.watch(path.join(baseDir, paths), {
      persistent: true,
      cwd: baseDir,
      ignored: [...IGNORED],
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
            `${timeNow()} ${chalk[actionName === 'copy' ? 'green' : 'yellow'](
              actionName === 'copy' ? '✓' : '𐄂'
            )} ${chalk.cyan(`@ima/${name}`)} ./${path.relative(
              path.join(destFolder),
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

          // Ignore TS files
          if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
            return;
          }

          fs.copyFile(src, dest, err => {
            // Fix ima binary not being executable
            if (name === 'cli' && filePath.includes('bin/ima.js')) {
              fs.chmodSync(path.join(destFolder, '../../.bin/ima'), '755');
            }

            // Fix ima binary not being executable
            if (
              name === 'plugin-cli' &&
              filePath.includes('bin/ima-plugin.js')
            ) {
              fs.chmodSync(
                path.join(destFolder, '../../.bin/ima-plugin'),
                '755'
              );
            }

            callback(err);
          });

          break;

        case 'unlink':
          fs.unlink(dest, callback);
          break;
      }

      // Restart ima server in host application
      if (name === 'server') {
        let serverBuildDir = path.join(destFolder, '../../../server/server.js');
        const updatedDate = new Date();

        // Set new accessed and updated timestamps to trigger nodemon
        fs.utimesSync(serverBuildDir, updatedDate, updatedDate);
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

/**
 * Starts watch task on pkg (if exists) and creates watcher on the source files
 * and copies them after they're builded.
 */
function watchChanges(destFolder, pkgDirs) {
  const destNodeModules = path.join(destFolder, 'node_modules');

  pkgDirs.forEach(pkgDir => {
    const pkgJson = require(path.join(pkgDir, 'package.json'));
    const destPkgDir = path.join(destNodeModules, pkgJson.name);
    const name = pkgJson.name.split('/').pop();

    // Spawn watch
    if (pkgJson.scripts.dev) {
      const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      runningProcesses.push(
        child.spawn(
          npm,
          [
            'run',
            'dev',
            // Silent output since we provide our own
            ...(pkgJson.scripts.dev.includes('ima-plugin')
              ? ['--', '--silent']
              : []),
          ],
          {
            stdio: 'inherit',
            cwd: pkgDir,
          }
        )
      );
    }

    // Create file watcher
    createWatcher(name, pkgDir, '/**/*', destPkgDir);
  });
}

/**
 * Builds and copies selected pkgDirs into the destination directory.
 */
function copyChanges(destDir, pkgDirs) {
  const destNodeModules = path.join(destDir, 'node_modules');

  pkgDirs.forEach(async pkgDir => {
    const pkgJson = require(path.join(pkgDir, 'package.json'));
    const destPkgDir = path.join(destNodeModules, pkgJson.name);

    // Build package
    pkgJson.scripts.build && shell('npm run build', pkgDir);

    // Copy source files to app node_modules directory.
    fs.readdirSync(pkgDir)
      .filter(dir => !IGNORED.includes(dir))
      .forEach(file => {
        console.log(
          `${timeNow()} ${chalk.green('✓')} ${chalk.cyan(
            `${pkgJson.name}`
          )} ./${file}`
        );

        fs.copySync(path.join(pkgDir, file), path.join(destPkgDir, file), {
          overwrite: true,
        });
      });
  });
}

/**
 * Initializes application using create-ima-app script from the monorepo.
 * Overwrites existing folder if run with --force argument. Optionally
 * when run with --init argument, the script builds, packs and installs
 * the packages to the destination directory. This makes sure that any
 * new added dependencies are installed to the destination directory
 * correctly.
 */
function initApp(destDir, pkgDirs, cliArgs) {
  const exists = fs.existsSync(destDir);

  if (exists && !cliArgs.force) {
    console.log(
      chalk.yellow(
        'The app destination folder already exists, skipping CIA initialization...\n' +
          'Use --force cli argument to overwrite the destination folder.'
      )
    );
  }

  // Delete folder before init
  if (exists && cliArgs.force) {
    fs.rmSync(destDir, { recursive: true, force: true });

    console.log(
      chalk.yellow('The app destination folder already exists, overwriting...')
    );
  }

  if (cliArgs.init) {
    // Run create-ima-app script
    shell(
      `${path.resolve(
        __dirname,
        '../../../packages/create-ima-app/bin/create-ima-app.js'
      )} ${destDir}${cliArgs.typescript ? ' --typescript' : ''}`
    );

    // Build, pack and install packages in the target directory.
    let packFiles = [];

    pkgDirs.forEach(pkgDir => {
      const pkgJson = require(path.join(pkgDir, 'package.json'));

      pkgJson.scripts.build && shell('npm run build', pkgDir);
      shell('npm pack', pkgDir);

      // eslint-disable-next-line no-unused-vars
      const [prefix, name] = pkgJson.name.split('/');
      const packFileName = `ima-${name}-${pkgJson.version}.tgz`;
      const packFilePath = path.join(pkgDir, packFileName);

      shell(`npm install ${packFilePath} --force`, destDir);
      packFiles.push(packFilePath);
    });

    packFiles.forEach(packFilePath => fs.rmSync(packFilePath));

    // Copy "dev" ima config into the application, if it doesn't have any
    const imaConfigPath = path.join(destDir, 'ima.config.js');
    fs.copyFileSync(path.join(__dirname, './ima.config.js'), imaConfigPath);
  }
}

/**
 * Make sure that we kill or spanwed processes on exit.
 */
function killRunningProcesses() {
  runningProcesses.forEach(proc => proc && proc.kill('SIGINT'));
  process.exit(0);
}

// Make sure we exit gracefully.
process.on('SIGTERM', () => killRunningProcesses);
process.on('SIGINT', () => killRunningProcesses);
process.on('SIGUSR2', () => killRunningProcesses);
process.on('exit', () => killRunningProcesses);

module.exports = {
  shell,
  initApp,
  copyChanges,
  watchChanges,
};
