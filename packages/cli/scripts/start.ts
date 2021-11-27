import path from 'path';
import childProcess from 'child_process';

import { handlerFactory, resolveCliPluginArgs } from '../lib/cli';
import { HandlerFn, StartArgs } from '../types';
import { CommandBuilder } from 'yargs';

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

const CMD = 'start';
export const command = `${CMD} [rootDir]`;
export const describe = 'Run application in production';
export const handler = handlerFactory(start);
export const builder: CommandBuilder = {
  ...resolveCliPluginArgs(CMD)
};
