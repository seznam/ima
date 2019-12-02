const gls = require('gulp-live-server');
const { createServer } = require('@ima/plugin-websocket/lib');

const sharedState = require('../gulpState.js');

exports.__requiresConfig = true;

exports.default = gulpConfig => {
  let server = null;
  let webSocketServer = null;
  let runningServers = 0;

  function isServerRunning() {
    return runningServers > 0;
  }

  function startServer() {
    runningServers++;
    server.start().then(() => {
      runningServers--;
    });
  }

  function serverTask(done) {
    server = gls('./build/server.js', undefined, gulpConfig.liveServer.port);

    setTimeout(startServer);
    done();
  }

  function serverRestart(done) {
    setTimeout(startServer);
    done();
  }

  function serverReload(done) {
    if (isServerRunning()) {
      setTimeout(() => {
        server.notify(sharedState.watchEvent);
        done();
      }, 2000);
    } else {
      startServer();
      done();
    }
  }

  function serverHotreload(done) {
    if (isServerRunning()) {
      server.notify(sharedState.watchEvent);
    } else {
      startServer();
    }

    done();
  }

  function webSocketTask(done) {
    webSocketServer = createServer(gulpConfig.webSocketServerConfig);

    webSocketServer.on('connection', () => {
      done();
    });
  }

  return {
    server: serverTask,
    'server:websocket': webSocketTask,
    'server:restart': serverRestart,
    'server:reload': serverReload,
    'server:hotreload': serverHotreload
  };
};
