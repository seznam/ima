const path = require('path');
const childProcess = require('child_process');

const { handlerFactory, builderFactory } = require('../build/utils');

async function start(args) {
  childProcess.fork(path.resolve(args.cwd, './build/server'));
}

const startCommand = {
  command: 'start',
  desc: 'Run application in production',
  builder: builderFactory(),
  handler: handlerFactory(start)
};

module.exports = startCommand;
