import path from 'path';
import open from 'better-opn';
import chalk from 'chalk';
import nodemon from 'nodemon';
import { CommandBuilder } from 'yargs';

import { CliArgs, HandlerFn } from '../types';
import {
  handlerFactory,
  IMA_CLI_RUN_SERVER_MESSAGE,
  resolveCliPluginArgs,
  sharedArgsFactory
} from '../lib/cli';
import logger from '../lib/logger';
import { watchCompiler, handleError } from '../lib/compiler';
import { createWebpackConfig, resolveEnvironment } from '../webpack/utils';
import webpack from 'webpack';

let nodemonInitialized = false;
let serverHasStarted = false;

/**
 * Starts ima server with nodemon to watch for server-side changes
 * (all changes in server/ folder), to automatically restart application.
 */
function startNodemon(args: CliArgs) {
  if (!nodemonInitialized) {
    nodemon({
      script: path.join(args.rootDir, 'server/server.js'),
      watch: [`${path.join(args.rootDir, 'server')}`],
      args: [`--verbose=${args.verbose}`],
      cwd: args.rootDir
    });

    nodemon.on('start', () => {
      logger.info(
        `${serverHasStarted ? 'Restarting' : 'Starting'} application server${
          !serverHasStarted && args.forceSPA
            ? ` in ${chalk.black.bgCyan('SPA mode')}`
            : ''
        }...`
      );
    });

    nodemon.once('message', message => {
      if (message === IMA_CLI_RUN_SERVER_MESSAGE) {
        serverHasStarted = true;

        if (args.open) {
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
      }
    });

    nodemonInitialized = true;
  }
}

/**
 * Builds ima application with provided config in watch mode
 * while also starting the webserver itself.
 *
 * @param {CliArgs} args
 * @returns {Promise<void>}
 */
const dev: HandlerFn = async args => {
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
        isProduction: false
      }
    );

    const compiler = webpack(config);

    // Start watch compiler
    await watchCompiler(compiler, args, imaConfig);

    // Start nodemon and application server
    startNodemon(args);
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
};

const CMD = 'dev';
export const command = `${CMD} [rootDir]`;
export const describe = 'Run application in development watch mode';
export const handler = handlerFactory(dev);
export const builder: CommandBuilder = {
  ...sharedArgsFactory(CMD),
  clean: {
    desc: 'Clean build folder before building the application',
    type: 'boolean',
    default: false
  },
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
