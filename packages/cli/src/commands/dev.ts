import path from 'path';

import { ParsedEnvironment } from '@ima/core';
import { logger } from '@ima/dev-utils/logger';
import open from 'better-opn';
import chalk from 'chalk';
import nodemon from 'nodemon';
import { CommandBuilder } from 'yargs';

import {
  handlerFactory,
  resolveCliPluginArgs,
  sharedArgsFactory,
} from '../lib/cli';
import { HandlerFn, ImaCliArgs } from '../types';
import { cleanup, resolveEnvironment } from '../vite/utils/utils';

/**
 * Starts ima server with nodemon to watch for server-side changes
 * (all changes in server/ folder), to automatically restart the application
 * server in case any change is detected.
 */
function startNodemon(args: ImaCliArgs, environment: ParsedEnvironment) {
  let serverHasStarted = false;

  nodemon({
    script: path.join(import.meta.dirname, '../dev-server/devServer.js'),
    watch: ['server'].map(p => path.join(args.rootDir, p)),
    nodeArgs: args.inspect ? ['--inspect'] : [],
    cwd: args.rootDir,
    env: {
      ...process.env,
      IMA_CLI_ARGS: JSON.stringify(args),
    },
  })
    .on('start', () => {
      logger.info(
        `${serverHasStarted ? 'Restarting' : 'Starting'} application server${
          !serverHasStarted && args.forceSPA
            ? ` in ${chalk.black.bgCyan('SPA mode')}`
            : args.forceSPAPrefetch
              ? ` in ${chalk.black.bgYellow('SPA prefetch mode')}`
              : ''
        }...`
      );

      if (
        process.env.IMA_CLI_OPEN !== 'false' &&
        args.open &&
        !serverHasStarted
      ) {
        serverHasStarted = true;

        const port = environment.$Server.port;
        const openUrl =
          args.openUrl ??
          process.env.IMA_CLI_OPEN_URL ??
          `http://localhost:${port}`;

        try {
          open(openUrl);
        } catch (error) {
          logger.error(`Could not open ${openUrl} inside a browser, ${error}`);
        }
      }
    })
    .on('crash', () => {
      logger.error('Application watcher crashed unexpectedly.');
    });
}

/**
 * Builds ima application in watch mode
 * while also starting the webserver itself.
 *
 * @param {ImaCliArgs} args
 * @returns {Promise<void>}
 */
const dev: HandlerFn = async args => {
  process.env.IMA_CLI_WATCH = 'true';

  // Set force SPA flag so server can react accordingly
  if (args.forceSPA) {
    process.env.IMA_CLI_FORCE_SPA = 'true';
  }

  // Set force SPA flag so server can react accordingly
  if (args.forceSPAPrefetch) {
    process.env.IMA_CLI_FORCE_SPA_PREFETCH = 'true';
  }

  // Set lazy server flag according to CLI args
  if (args.lazyServer) {
    process.env.IMA_CLI_LAZY_SERVER = 'true';
  }

  try {
    // Do cleanup
    await cleanup(args);

    const environment = resolveEnvironment(args.rootDir);

    // Start the application server (and Vite HMR server) via nodemon so that
    // any changes inside server/ automatically trigger a server restart.
    startNodemon(args, environment);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

const CMD = 'dev';
export const command = CMD;
export const describe = 'Run application in development watch mode';
export const handler = handlerFactory(dev);
export const builder: CommandBuilder = {
  ...sharedArgsFactory(CMD),
  open: {
    desc: 'Opens browser window after server has been started',
    type: 'boolean',
    default: true,
  },
  openUrl: {
    desc: 'Custom URL used when opening browser window ',
    type: 'string',
  },
  forceSPA: {
    desc: 'Forces application to run in SPA mode',
    type: 'boolean',
    default: false,
  },
  forceSPAPrefetch: {
    desc: 'Forces application to run in SPA prefetch mode',
    type: 'boolean',
    default: false,
  },
  reactRefresh: {
    desc: 'Enable/disable react fast refresh for React components',
    type: 'boolean',
    default: true,
  },
  lazyServer: {
    desc: 'Enable/disable lazy init of server app factory',
    type: 'boolean',
    default: true,
  },
  port: {
    desc: 'Dev server port (overrides ima.config.js settings)',
    type: 'number',
  },
  hostname: {
    desc: 'Dev server hostname (overrides ima.config.js settings)',
    type: 'string',
  },
  publicUrl: {
    desc: 'Dev server publicUrl (overrides ima.config.js settings)',
    type: 'string',
  },
  ...resolveCliPluginArgs(CMD),
};
