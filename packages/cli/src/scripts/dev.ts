import path from 'path';

import open from 'better-opn';
import chalk from 'chalk';
import nodemon from 'nodemon';
import webpack from 'webpack';
import { CommandBuilder } from 'yargs';

import { createDevServer } from '..';
import {
  handlerFactory,
  resolveCliPluginArgs,
  sharedArgsFactory,
} from '../lib/cli';
import { watchCompiler, handleError } from '../lib/compiler';
import logger from '../lib/logger';
import { CliArgs, HandlerFn } from '../types';
import { createWebpackConfig, resolveEnvironment } from '../webpack/utils';

let nodemonInitialized = false;
const serverHasStarted = false;

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
      cwd: args.rootDir,
    });

    nodemon.on('start', () => {
      logger.info(
        `${serverHasStarted ? 'Restarting' : 'Starting'} application server${
          !serverHasStarted && (args.forceSPA || args.forceSPAWithHMR)
            ? ` in ${chalk.black.bgCyan(
                args.forceSPAWithHMR ? 'SPA mode with HMR' : 'SPA mode'
              )}`
            : ''
        }...`
      );

      if (args.open && !serverHasStarted) {
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

    nodemon.on('crash', error => {
      logger.error('Application watcher unexpectedly crashed.');
      logger.error(error);
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
  // Force NODE_ENV as development
  process.env.NODE_ENV = 'development';

  // Set force SPA flag so server can react accordingly
  if (args.forceSPA || args.forceSPAWithHMR) {
    args.legacy = true; // SPA only supports es5 versions
    process.env.IMA_CLI_FORCE_SPA = 'true';
  }

  try {
    const { config, imaConfig } = await createWebpackConfig(
      ['client', 'server'],
      args
    );

    const compiler = webpack(config);

    // Start watch compiler
    await watchCompiler(compiler, args, imaConfig);

    // Create dev server for HMR
    createDevServer(compiler, imaConfig.devServerPort);

    // Start nodemon and application server
    startNodemon(args);
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
};

const CMD = 'dev';
export const command = CMD;
export const describe = 'Run application in development watch mode';
export const handler = handlerFactory(dev);
export const builder: CommandBuilder = {
  ...sharedArgsFactory(CMD),
  clean: {
    desc: 'Clean build folder before building the application',
    type: 'boolean',
    default: false,
  },
  open: {
    desc: 'Opens browser window after server has been started',
    type: 'boolean',
    default: true,
  },
  legacy: {
    desc: 'Runs application in legacy (es5-compatible) mode',
    type: 'boolean',
    default: false,
  },
  forceSPA: {
    desc: 'Forces application to run in SPA mode',
    type: 'boolean',
    default: false,
  },
  forceSPAWithHMR: {
    desc: 'Forces application to run in SPA mode with HMR enabled',
    type: 'boolean',
    default: false,
  },
  ...resolveCliPluginArgs(CMD),
};
