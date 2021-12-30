import path from 'path';
import open from 'better-opn';
import chalk from 'chalk';
import nodemon from 'nodemon';
import { CommandBuilder } from 'yargs';

import { DevArgs, HandlerFn } from '../types';
import {
  handlerFactory,
  IMA_CLI_RUN_SERVER_MESSAGE,
  resolveCliPluginArgs
} from '../lib/cli';
import logger from '../lib/logger';
import { watchCompiler, handleError } from '../lib/compiler';
import { createWebpackConfig, resolveEnvironment } from '../webpack/utils';
import SharedArgs from '../lib/SharedArgs';
import webpack, { MultiCompiler } from 'webpack';

let serverHasStarted = false;

/**
 * Creates nodemon dev plugin to watch server-side changes
 * which triggers automatic server restarts.
 */
function initNodemon(compiler: MultiCompiler, args: DevArgs) {
  compiler.hooks.done.tap('RebootImaServerPlugin', stats => {
    if (stats.hasErrors()) {
      return;
    }

    // Start server with nodemon
    if (!serverHasStarted) {
      nodemon({
        script: path.join(args.rootDir, 'server/server.js'),
        watch: [`${path.join(args.rootDir, 'server')}`],
        args: [`--verbose=${args.verbose}`],
        cwd: args.rootDir
      });

      nodemon.on('start', () => {
        logger.info('Starting application server...');
      });

      if (args.open) {
        nodemon.on('message', message => {
          if (message === IMA_CLI_RUN_SERVER_MESSAGE) {
            const imaEnvironment = resolveEnvironment(args.rootDir);
            const port = imaEnvironment?.$Server?.port ?? 3001;

            try {
              open(`http://localhost:${port}`);
            } catch (error) {
              logger.error(
                `Could not open http://localhost:${port} inside a browser, ${error}`
              );
            }
          }
        });
      }

      serverHasStarted = true;
    }

    // Restart server when necessary (server-side changes)
    const emittedAssets = stats
      .toJson({
        all: false,
        assets: true,
        errors: true
      })
      .children?.find(({ name }) => name === 'server')
      ?.assets?.filter(
        ({ emitted, name }) => emitted && !name.includes('app.server.js')
      );

    if (emittedAssets?.length) {
      logger.info('Rebooting server due to configuration changes...');
      nodemon.restart();
    }
  });
}

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
    args.legacy = true; // SPA only supports es5 versions
    process.env.IMA_CLI_FORCE_SPA = 'true';
  }

  try {
    const { config, imaConfig } = await createWebpackConfig(
      ['client', 'server'],
      {
        ...args,
        isProduction: false,
        isWatch: true
      }
    );

    const compiler = webpack(config);

    // Init nodemon and start compiler
    initNodemon(compiler, args);
    await watchCompiler(compiler, args, imaConfig);

    if (args.forceSPA) {
      logger.info(
        `Starting application in ${chalk.black.bgCyan('SPA mode')}...`
      );
    }
  } catch (error) {
    handleError(error);
  }
};

const CMD = 'dev';
export const command = `${CMD} [rootDir]`;
export const describe = 'Run application in development watch mode';
export const handler = handlerFactory(dev);
export const builder: CommandBuilder = {
  ...SharedArgs,
  open: {
    desc: 'Opens browser window after server has been started',
    type: 'boolean',
    default: true
  },
  legacy: {
    desc: 'Runs application in legacy (es5-compatible) mode',
    type: 'boolean',
    default: false
  },
  forceSPA: {
    desc: 'Forces application to run in SPA mode',
    type: 'boolean',
    default: false
  },
  ...resolveCliPluginArgs(CMD)
};
