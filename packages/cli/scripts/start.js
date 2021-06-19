const path = require('path');
const childProcess = require('child_process');

const { handlerFactory, builderFactory } = require('./lib/cliUtils');

async function start({ rootDir }) {
  childProcess.fork(path.resolve(rootDir, './build/server'));
}

const startCommand = {
  command: 'start',
  desc: 'Run application in production',
  builder: builderFactory(),
  handler: handlerFactory(start)
};

module.exports = startCommand;
