const path = require('path');
const childProcess = require('child_process');

const { handlerFactory } = require('../lib/cliUtils');

async function start({ options }) {
  childProcess.fork(path.resolve(options.rootDir, './build/server'));
}

const startCommand = {
  command: 'start',
  desc: 'Run application in production',
  builder: {},
  handler: handlerFactory(start)
};

module.exports = startCommand;
