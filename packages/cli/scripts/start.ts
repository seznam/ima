import path from 'path';
import childProcess from 'child_process';

import { handlerFactory } from '../lib/cli';
import { HandlerFn, StartArgs } from '../types';

/**
 * Starts ima application server.
 *
 * @param {Promise<void>} args
 * @returns {void}
 */
const start: HandlerFn<StartArgs> = async args => {
  childProcess.fork(path.join(args.rootDir, 'build/server'), {
    stdio: 'inherit'
  });
};

export const command = 'start';
export const describe = 'Run application in production';
export const handler = handlerFactory(start);
