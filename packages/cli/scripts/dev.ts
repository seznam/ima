import path from 'path';
import open from 'better-opn';
import chalk from 'chalk';
import nodemon from 'nodemon';
import { CommandBuilder } from 'yargs';

import { DevArgs, HandlerFn } from '../types';
import { handlerFactory, IMA_CLI_RUN_SERVER_MESSAGE, info } from '../lib/cli';
import { watchCompiler, handleError } from '../lib/compiler';
import { createWebpackConfig, resolveEnvironment } from '../webpack/utils';
import SharedArgs from '../lib/SharedArgs';

/**
 * Builds ima application with provided config in watch mode
 * while also starting the webserver itself.
 *
 * @param {DevArgs} args
 * @returns {Promise<void>}
 */
const dev: HandlerFn<DevArgs> = async args => {
  // Set force SPA flag so server can react accordingly
  if (args.forceSPA) {
    process.env.IMA_CLI_FORCE_SPA = 'true';
  }

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

    const compiler = await watchCompiler(config, args);

    // Start ima server with nodemon
    nodemon({
      script: path.join(args.rootDir, 'build/server'),
      watch: [`!${path.join(args.rootDir, 'build/server')}`],
      args: [`--verbose=${args.verbose}`],
      cwd: args.rootDir
    });

    // Trigger nodemon reload only when new assets are emitted
    compiler.hooks.done.tap('testPlugin', stats => {
      const emittedAssets = stats
        .toJson()
        .children?.find(({ name }) => name === 'server')
        ?.assets?.filter(
          ({ emitted, name }) => emitted && !name.includes('app.server.js')
        );

      if (emittedAssets?.length) {
        info('Rebooting server due to configuration changes...');
        nodemon.restart();
      }
    });

    // Open browser at localhost
    if (args.open) {
      nodemon.on('message', message => {
        if (message === IMA_CLI_RUN_SERVER_MESSAGE) {
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
    }
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
  },
  forceSPA: {
    alias: 'm',
    desc: 'Forces application to run in SPA mode',
    type: 'boolean',
    default: false
  }
};
