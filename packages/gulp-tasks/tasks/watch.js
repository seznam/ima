const gulp = require('gulp');
const cache = require('gulp-cached');
const color = require('ansi-colors');
const log = require('fancy-log');
const remember = require('gulp-remember');
const watch = require('gulp-watch');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const net = require('net');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const sharedState = require('../gulpState.js');

const { createClient } = require('@ima/plugin-websocket/server');

const dgram = require('dgram');
const notifyServer = dgram.createSocket('udp4');
let notifyServerMessageTimeout = null;
let notifyServerJobQueue = [];

exports.__requiresConfig = true;

exports.default = (gulpConfig) => {
  const {
    files,
    occupiedPorts,
    notifyServer: notifyServerConfig,
    hotReloadConfig
  } = gulpConfig;

  function watchTask() {
    const socket = createClient(hotReloadConfig.socket);
    let hotReloadedCacheKeys = [];

    runGulpTaskOnChange(files.app.watch, 'app:build');
    runGulpTaskOnChange(files.vendor.watch, 'vendor:build');
    runGulpTaskOnChange(files.less.watch, 'less:build');
    runGulpTaskOnChange(files.server.watch, 'server:build');
    runGulpTaskOnChange(files.locale.watch, 'locale:build');
    runGulpTaskOnChange('./app/assets/static/**/*', 'copy:appStatic');

    if (notifyServerConfig.enable) {
      notifyServer.bind({
        address: notifyServerConfig.server,
        port: notifyServerConfig.port,
        exclusive: true
      });

      notifyServer.on('listening', () => {
        log(
          `Notification server listening on ${notifyServerConfig.server}:${
            notifyServerConfig.port
          } for messages [ ${Object.keys(notifyServerConfig.messageJobs)} ]`
        );
      });

      notifyServer.on('message', (message) => {
        const changedSubject = message.toString();
        Object.keys(notifyServerConfig.messageJobs).map((testRegexp) => {
          const test = new RegExp(testRegexp, 'i');
          if (test.test(changedSubject)) {
            clearTimeout(notifyServerMessageTimeout);
            log(
              `Notify message [ '${color.cyan(
                changedSubject
              )}' ] queueing jobs:`,
              notifyServerConfig.messageJobs[testRegexp]
            );
            notifyServerJobQueue = notifyServerJobQueue.concat(
              notifyServerConfig.messageJobs[testRegexp].filter((job) => {
                return !notifyServerJobQueue.includes(job);
              })
            );
            notifyServerMessageTimeout = setTimeout(() => {
              log(
                `Starting queued jobs: ${color.cyan(
                  notifyServerJobQueue.join(',')
                )}`
              );
              gulp.parallel(notifyServerJobQueue)();
              notifyServerJobQueue = [];
            }, notifyServerConfig.jobRunTimeout);
          }
        });
      });
    }

    chokidar
      .watch(hotReloadConfig.watch, hotReloadConfig.options)
      .on('change', (filePath) => {
        log(
          `Reloading 'public/${color.cyan(filePath)}' with ` + 'websocket...'
        );

        let hotReloadedContents = '';

        if (path.parse(filePath).ext === '.css') {
          hotReloadedContents = fs.readFileSync(filePath).toString();
        } else {
          hotReloadedContents = hotReloadedCacheKeys
            .map((cacheKey) => {
              let file = remember.cacheFor('Es6ToEs5:server:app')[cacheKey];
              if (!file) {
                return '';
              }

              return file.contents
                .toString()
                .replace(/System.import/g, '$IMA.Loader.import')
                .replace(/System.register/g, '$IMA.Loader.replaceModule');
            })
            .join('');
          hotReloadedCacheKeys = [];
        }

        const message = {
          sentinel: '@ima/gulp-tasks/watch/hot-reload',
          payload: {
            filename: path.normalize(filePath).replace(/\\/g, '/'),
            contents: hotReloadedContents
          }
        };

        socket.send(JSON.stringify(message));
      });

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
  }

  function runGulpTaskOnChange(files, task) {
    watch(files, () => gulp.series(task)());
  }

  function checkAndReleasePorts() {
    const occupants = Object.keys(occupiedPorts);

    log(`Releasing ports occupied by ${occupants.join(', ')}`);

    return Promise.all(
      occupants.map((occupant) => {
        const port = occupiedPorts[occupant];

        return isPortOccupied(port)
          .then((occupied) => {
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
          .catch((error) => {
            log(error);
            throw Error(`Unable to determine if port ${port} is occupied.`);
          });
      })
    );
  }

  function isPortOccupied(port) {
    return new Promise((resolve, reject) => {
      const tester = net.createServer();

      tester.once('error', (error) => {
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
