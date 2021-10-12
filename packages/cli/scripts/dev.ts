import path from 'path';
import open from 'better-opn';
import childProcess from 'child_process';
import { CommandBuilder } from 'yargs';

import { DevArgs, HandlerFn } from '../types';
import { handlerFactory, IMA_CLI_RUN_SERVER_MESSAGE, info } from '../lib/cli';
import { watchCompiler, handleError } from '../lib/compiler';
import { createWebpackConfig, resolveEnvironment } from '../webpack/utils';
import SharedArgs from '../lib/SharedArgs';
import chalk from 'chalk';

/**
 * Builds ima application with provided config in watch mode
 * while also starting the webserver itself.
 *
 * @param {DevArgs} args
 * @returns {Promise<void>}
 */
const dev: HandlerFn<DevArgs> = async args => {
  try {
    info('Parsing webpack configuration file...');
    const config = await createWebpackConfig(['client', 'server'], {
      ...args,
      isProduction: false,
      isWatch: true
    });

    info(
      `Starting webpack compiler${
        args.legacy
          ? chalk.bold.redBright(' in legacy (es-5 compatible) mode')
          : ''
      }...`
    );

    await watchCompiler(config, args);

    // Start ima server
    info('Starting webserver...');
    const webServer = childProcess.fork(
      path.join(args.rootDir, 'build/server'),
      [`--verbose=${args.verbose}`],
      {
        stdio: 'inherit'
      }
    );

    // Open browser at localhost
    webServer.on('message', message => {
      if (message === IMA_CLI_RUN_SERVER_MESSAGE && args.open) {
        const imaEnvironment = resolveEnvironment(args.rootDir);
        const port = imaEnvironment?.$Server?.port ?? 3001;

        try {
          open(`http://localhost:${port}`);
        } catch (error) {
          console.error(
            `Could not open http://localhost:${port} inside a browser.`
          );
        }
      }
    });
  } catch (err) {
    handleError(err);
  }
};

export const command = 'dev';
export const describe = 'Run application in development watch mode';
export const handler = handlerFactory(dev);
export const builder: CommandBuilder = {
  ...SharedArgs,
  open: {
    alias: 'o',
    desc: 'Opens browser window after server has been started',
    type: 'boolean',
    default: true
  },
  legacy: {
    alias: 'l',
    desc: 'Runs application in legacy (es5-compatible) mode',
    type: 'boolean',
    default: false
  }
};
