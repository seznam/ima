import path from 'path';
import childProcess from 'child_process';
import { CommandModule } from 'yargs';

import { handlerFactory } from '../lib/cliUtils';
import { HandlerFunction, StartArgs } from '../types';

const start: HandlerFunction<StartArgs> = async args => {
  childProcess.fork(path.join(args.rootDir, 'build/server'), {
    stdio: 'inherit'
  });
};

const startCommand: CommandModule = {
  command: 'start',
  describe: 'Run application in production',
  builder: {},
  handler: handlerFactory(start)
};

export default startCommand;
