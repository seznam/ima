const path = require('path');
const childProcess = require('child_process');

async function start(args) {
  childProcess.fork(path.resolve(args.cwd, './build/server'));
}

const startCommand = {
  command: 'start',
  desc: 'Run application in production',
  builder: {
    'legacy-compat-mode': {
      desc: 'Runs application in ES5 compatible format'
    }
  },
  handler: async yargs => {
    await start({
      yargs: yargs,
      cwd: process.cwd()
    });
  }
};

module.exports = startCommand;
