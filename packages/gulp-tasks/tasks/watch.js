const gulp = require('gulp');
const cache = require('gulp-cached');
const flo = require('fb-flo');
const color = require('ansi-colors');
const log = require('fancy-log');
const remember = require('gulp-remember');
const watch = require('gulp-watch');
const path = require('path');
const fs = require('fs');
const net = require('net');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const sharedState = require('../gulpState.js');

exports.__requiresConfig = true;

exports.default = gulpConfig => {
  const { files, occupiedPorts } = gulpConfig;

  function watchTask() {
    let hotReloadedCacheKeys = [];

    runOnChange(files.app.watch, 'app:build');
    runOnChange(files.vendor.watch, 'vendor:build');
    runOnChange(files.less.watch, 'less:build');
    runOnChange(files.server.watch, 'server:build');
    runOnChange(files.locale.watch, 'locale:build');
    runOnChange('./app/assets/static/**/*', 'copy:appStatic');

    gulp
      .watch([
        './ima/**/*.js',
        './app/**/*.{js,jsx}',
        './build/static/js/locale/*.js'
      ])
      .on('all', (event, filePath) => {
        sharedState.watchEvent = { path: filePath };
        let absoluteFilePath = path.resolve('.', filePath);

        let cacheKey = absoluteFilePath.toLowerCase().replace('.jsx', '.js');
        hotReloadedCacheKeys.push(cacheKey);

        if (event === 'unlink') {
          if (cache.caches['Es6ToEs5:server:app'][absoluteFilePath]) {
            delete cache.caches['Es6ToEs5:server:app'][absoluteFilePath];
            remember.forget(
              'Es6ToEs5:server:app',
              absoluteFilePath.replace('.jsx', '.js')
            );
          }
        }
      });

    flo(
      './build/static/',
      {
        port: occupiedPorts['fb-flo'],
        host: 'localhost',
        glob: ['**/*.css', '**/*.js']
      },
      (filepath, callback) => {
        log(`Reloading 'public/${color.cyan(filepath)}' with ` + 'flo...');

        let hotReloadedContents = '';

        if (path.parse(filepath).ext === '.css') {
          hotReloadedContents = fs.readFileSync('./build/static/' + filepath);
        } else {
          hotReloadedContents = hotReloadedCacheKeys.map(cacheKey => {
            let file = remember.cacheFor('Es6ToEs5:server:app')[cacheKey];
            if (!file) {
              return '';
            }

            return file.contents
              .toString()
              .replace(/System.import/g, '$IMA.Loader.import')
              .replace(/System.register/g, '$IMA.Loader.replaceModule');
          });
          hotReloadedCacheKeys = [];
        }

        callback({
          resourceURL: 'static/' + filepath,
          contents: hotReloadedContents
        });
      }
    );

    function runOnChange(files, task) {
      watch(files, () => gulp.series(task)());
    }
  }

  function checkAndReleasePorts() {
    const occupants = Object.keys(occupiedPorts);

    log(`Releasing ports occupied by ${occupants.join(', ')}`);

    return Promise.all(
      occupants.map(occupant => {
        const port = occupiedPorts[occupant];

        return isPortOccupied(port)
          .then(occupied => {
            if (!occupied) {
              return;
            }

            log(`Releasing port occupied by ${occupant}.`);

            const command =
              process.platform === 'win32'
                ? `Stop-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess -Force`
                : `lsof -i:${port} | grep LISTEN | awk '{print $2}' | xargs kill -9`;

            return exec(command).catch(() => null);
          })
          .catch(error => {
            log(error);
            throw Error(`Unable to determine if port ${port} is occupied.`);
          });
      })
    );
  }

  function isPortOccupied(port) {
    return new Promise((resolve, reject) => {
      const tester = net.createServer();

      tester.once('error', error => {
        if (error.code !== 'EADDRINUSE') {
          return reject(error);
        }
        resolve(true);
      });

      tester.once('listening', () => {
        tester.once('close', () => resolve(false)).close();
      });

      tester.listen(port);
    });
  }

  return {
    watch: watchTask,
    'watch:releasePorts': checkAndReleasePorts
  };
};
