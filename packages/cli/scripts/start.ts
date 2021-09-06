import path from 'path';
import childProcess from 'child_process';
import { CommandModule } from 'yargs';

import { handlerFactory } from '../lib/cliUtils';

async function start(args) {
  childProcess.fork(path.join(args.rootDir, 'build/server'), {
    stdio: 'inherit'
  });
}

const startCommand: CommandModule = {
  command: 'start',
  describe: 'Run application in production',
  builder: {},
  handler: handlerFactory(start)
};

export default startCommand;
