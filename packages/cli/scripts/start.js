const path = require('path');
const childProcess = require('child_process');

const { handlerFactory } = require('../lib/cliUtils');

async function start({ options }) {
  childProcess.fork(path.join(options.rootDir, 'build/server'), {
    stdio: 'inherit'
  });
}

const startCommand = {
  command: 'start',
  desc: 'Run application in production',
  builder: {},
  handler: handlerFactory(start)
};

module.exports = startCommand;
