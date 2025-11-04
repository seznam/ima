import path from 'path';

import { Environment } from '@ima/core';
import { logger } from '@ima/dev-utils/logger';
import open from 'better-opn';
import chalk from 'chalk';
import kill from 'kill-port';
import nodemon from 'nodemon';
import webpack from 'webpack';
import { CommandBuilder } from 'yargs';

import { createDevServer } from '../dev-server/devServer';
import {
  handlerFactory,
  resolveCliPluginArgs,
  sharedArgsFactory,
} from '../lib/cli';
import { watchCompiler, handleError } from '../lib/compiler';
import { ImaCliArgs, HandlerFn } from '../types';
import { compileLanguages } from '../webpack/languages';
import {
  cleanup,
  createDevServerConfig,
  createWebpackConfig,
  resolveEnvironment,
  resolveImaConfig,
  runImaPluginsHook,
} from '../webpack/utils/utils';

/**
 * Starts ima server with nodemon to watch for server-side changes
 * (all changes in server/ folder), to automatically restart the application
 * server in case any change is detected.
 */
function startNodemon(args: ImaCliArgs, environment: Environment) {
  let serverHasStarted = false;

  nodemon({
    script: path.join(args.rootDir, 'server/server.js'),
    watch: ['server', 'build/static/public/spa.html'].map(p =>
      path.join(args.rootDir, p)
    ),
    args: args.verbose ? [`--verbose=${args.verbose}`] : [],
    nodeArgs: args.inspect ? [`--inspect`] : [],
    cwd: args.rootDir,
  })
    .on('start', () => {
      logger.info(
        `${serverHasStarted ? 'Restarting' : 'Starting'} application server${
          !serverHasStarted && args.forceSPA
            ? ` in ${chalk.black.bgCyan('SPA mode')}`
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

  // Set write to disk flag, so we can disable static proxy in the application
  if (args.writeToDisk) {
    process.env.IMA_CLI_WRITE_TO_DISK = 'true';
  }

  // Set force SPA flag so server can react accordingly
  if (args.forceSPA) {
    process.env.IMA_CLI_FORCE_SPA = 'true';
  }

  // Set lazy server flag according to CLI args
  if (args.lazyServer) {
    process.env.IMA_CLI_LAZY_SERVER = 'true';
  }

  // Set legacy argument to true by default when we're forcing legacy
  if (args.forceLegacy) {
    args.legacy = true;
  }

  try {
    // Do cleanup
    await cleanup(args);

    // Load ima config & env
    const imaConfig = await resolveImaConfig(args);
    const environment = resolveEnvironment(args.rootDir);

    /**
     * Set public env variable which is used to load assets in the SSR error view.
     * CLI Args should always override the config values.
     */
    const devServerConfig = createDevServerConfig({ imaConfig, args });
    process.env.IMA_CLI_DEV_SERVER_PUBLIC_URL = devServerConfig.publicUrl;

    // Kill processes running on the same port
    await Promise.all([
      kill(environment.$Server.port),
      kill(devServerConfig.port),
    ]);

    // Run preProcess hook on IMA CLI Plugins
    await runImaPluginsHook(args, imaConfig, 'preProcess');

    // Compile language files
    logger.info(`Compiling language files...`, { trackTime: true });
    await compileLanguages(imaConfig, args.rootDir, true);
    logger.endTracking();

    // Generate webpack config
    const config = await createWebpackConfig(args, imaConfig);

    logger.info(
      `Running webpack watch compiler${
        args.legacy
          ? ` ${chalk.black.bgCyan(
              `in${args.forceLegacy ? ' forced' : ''} legacy mode`
            )}`
          : ''
      }...`
    );

    // Create compiler
    const compiler = webpack(config);

    // Start watch compiler & HMR dev server
    await Promise.all([
      watchCompiler(compiler, args, imaConfig),
      createDevServer({
        args,
        config: imaConfig,
        compiler: compiler.compilers.find(
          ({ name }) =>
            // Run dev server only for client compiler with HMR enabled
            name === 'client.es'
        ),
        hostname: devServerConfig.hostname,
        port: devServerConfig.port,
        publicUrl: devServerConfig.publicUrl,
        rootDir: args.rootDir,
        environment,
      }),
    ]);

    // Start nodemon and application server
    startNodemon(args, environment);
  } catch (error) {
    if (args.verbose) {
      console.error(error);
    } else {
      handleError(error);
    }

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
  legacy: {
    desc: 'Runs application in legacy mode',
    type: 'boolean',
    default: false,
  },
  forceLegacy: {
    desc: 'Forces runner.js to execute legacy client code',
    type: 'boolean',
    default: false,
  },
  forceSPA: {
    desc: 'Forces application to run in SPA mode',
    type: 'boolean',
    default: false,
  },
  writeToDisk: {
    desc: 'Write static files to disk, instead of serving it from memory',
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
