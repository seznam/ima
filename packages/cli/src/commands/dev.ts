import path from 'path';

import { logger } from '@ima/dev-utils/logger';
import { Event } from '@ima/server';
import open from 'better-opn';
import chalk from 'chalk';
import kill from 'kill-port';
import { createServer } from 'vite';
import { CommandBuilder } from 'yargs';

import {
  handlerFactory,
  resolveCliPluginArgs,
  sharedArgsFactory,
} from '../lib/cli';
import { HandlerFn, ViteConfigWithEnvironments } from '../types';
import { createManifestForDev } from '../lib/manifest';
import {
  cleanup,
  createDevServerConfig,
  createViteConfig,
  resolveEnvironment,
  resolveImaConfig,
  runImaPluginsHook,
} from '../vite/utils/utils';
import 'extensionless/register'; // @TODO: tmp hotfix of invalid esm builds

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

    // Generate vite config
    const config = await createViteConfig(args, imaConfig);

    // Vite dev server requires us to use `client` and `ssr` environments
    const configWithMappedEnvironments: ViteConfigWithEnvironments = {
      ...config,
      environments: {
        client: config.environments.modern,
        ssr: config.environments.server,
      },
      server: {
        port: devServerConfig.port,
        host: devServerConfig.host,
        middlewareMode: true,
      },
    }

    // @TODO: This is a dev manifest, its pretty much static and does not change, but it feels a bit hacky so lets review this later
    logger.info(`Generating dev manifest...`);
    await createManifestForDev(imaConfig, configWithMappedEnvironments);

    // Start the Vite dev server
    logger.info('Starting vite dev HMR server...');
    const vite = await createServer({
      ...configWithMappedEnvironments,
      appType: 'custom',
    });

    // Initialize application server with additional hooks for development
    const {app, imaServer} = (await import(path.resolve(args.rootDir, 'server/app.js'))).createApp(vite);

    imaServer.emitter.prependListener(Event.Response, async (event: any) => {
      event.context.response.content = await vite.transformIndexHtml(event.req.url, event.context.response.content);
    });

    app.listen(environment.$Server.port, () => {
      logger.info(
        `Starting application server${
          args.forceSPA
            ? ` in ${chalk.black.bgCyan('SPA mode')}`
            : args.forceSPAPrefetch
              ? ` in ${chalk.black.bgYellow('SPA prefetch mode')}`
              : ''
        }...`
      );

      if (
        process.env.IMA_CLI_OPEN !== 'false' &&
        args.open
      ) {
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
      logger.info('The app is running at http://localhost:' + environment.$Server.port);
    })

    // @TODO: Review logging
    vite.watcher.on('all', (...args) => {
      console.log(...args)
    });

    vite.bindCLIShortcuts({ print: true })
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
