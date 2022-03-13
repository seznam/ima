import path from 'path';

import open from 'better-opn';
import chalk from 'chalk';
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
import { logger } from '../lib/logger';
import { ImaCliArgs, HandlerFn } from '../types';
import {
  cleanup,
  createDevServerConfig,
  createWebpackConfig,
  resolveEnvironment,
  resolveImaConfig,
  runImaPluginsHook,
} from '../webpack/utils';

/**
 * Starts ima server with nodemon to watch for server-side changes
 * (all changes in server/ folder), to automatically restart application.
 */
function startNodemon(args: ImaCliArgs) {
  let serverHasStarted = false;

  nodemon({
    script: path.join(args.rootDir, 'server/server.js'),
    watch: [`${path.join(args.rootDir, 'server')}`],
    args: [`--verbose=${args.verbose}`],
    cwd: args.rootDir,
  });

  nodemon.on('start', () => {
    logger.info(
      `${serverHasStarted ? 'Restarting' : 'Starting'} application server${
        !serverHasStarted && args.forceSPA
          ? ` in ${chalk.black.bgCyan('SPA mode')}`
          : ''
      }...`
    );

    if (args.open && !serverHasStarted) {
      const imaEnvironment = resolveEnvironment(args.rootDir);
      const port = imaEnvironment?.$Server?.port ?? 3001;
      serverHasStarted = true;

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
    process.exit(1);
  });
}

/**
 * Builds ima application with provided config in watch mode
 * while also starting the webserver itself.
 *
 * @param {ImaCliArgs} args
 * @returns {Promise<void>}
 */
const dev: HandlerFn = async args => {
  // Set force SPA flag so server can react accordingly
  if (args.forceSPA) {
    args.legacy = true; // SPA only supports es5 versions
    process.env.IMA_CLI_FORCE_SPA = 'true';
  }

  try {
    // Do cleanup
    await cleanup(args);

    // Load ima config
    const imaConfig = await resolveImaConfig(args);

    /**
     * Set public env variable which is used to load assets in the SSR error view correctly.
     * CLI Args should always override the config values.
     */
    const devServerConfig = createDevServerConfig({ imaConfig, args });
    process.env.IMA_CLI_DEV_SERVER_PUBLIC_URL = devServerConfig.publicUrl;

    // Run preProcess hook on imaPlugins
    await runImaPluginsHook(args, imaConfig, 'preProcess');

    // Generate webpack config
    const config = await createWebpackConfig(args, imaConfig);

    logger.info(
      `Running webpack watch compiler${
        args.legacy
          ? ` ${chalk.black.bgCyan('in legacy (es5 compatible) mode')}`
          : ''
      }...`
    );

    // Create compiler
    const compiler = webpack(config);

    // Start watch compiler & HMR dev server
    await Promise.all([
      watchCompiler(compiler, args, imaConfig),
      createDevServer({
        compiler: compiler.compilers.find(({ name }) =>
          args.forceSPA ? name === 'client' : name === 'client.es'
        ),
        hostname: devServerConfig.hostname,
        port: devServerConfig.port,
        rootDir: args.rootDir,
      }),
    ]);

    // Start nodemon and application server
    startNodemon(args);
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
