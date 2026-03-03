import path from 'path';

import chalk from 'chalk';
import { logger } from '@ima/dev-utils/logger';
import { Event } from '@ima/server';
import { createServer } from 'vite';

import { ImaCliArgs, ViteConfigWithEnvironments } from '../types';
import {
  createViteConfig,
  resolveEnvironment,
  resolveImaConfig,
  runImaPluginsHook,
} from '../vite/utils/utils';
import { createManifestForDev } from '../lib/manifest';
import { addDevServerMiddlewaresFactory } from './addDevServerMiddlewares';

/**
 * Standalone dev-server entry point started (and restarted) by nodemon.
 *
 * - Creates the Vite HMR server (middleware mode)
 * - Imports the application's server/app.js and starts the Express server
 * - Shuts everything down cleanly when nodemon sends SIGTERM before a restart
 *
 * All ImaCliArgs are passed in via the IMA_CLI_ARGS environment variable.
 */

const args: ImaCliArgs = JSON.parse(process.env.IMA_CLI_ARGS!);

async function main() {
  const imaConfig = await resolveImaConfig(args);
  const environment = resolveEnvironment(args.rootDir);
  const publicUrl = `http://localhost:${environment.$Server.port}`;
  process.env.IMA_CLI_DEV_SERVER_PUBLIC_URL = publicUrl;

  // Run preProcess hook on IMA CLI Plugins
  await runImaPluginsHook(args, imaConfig, 'preProcess');

  // Vite dev server requires us to use `client` and `ssr` environments
  const config = await createViteConfig(args, imaConfig);
  const configWithMappedEnvironments: ViteConfigWithEnvironments = {
    ...config,
    environments: {
      client: config.environments.modern,
      ssr: config.environments.server,
    },
    server: {
      middlewareMode: true,
    },
  };

  // Dev manifest is referencing the input files instead of output,
  // so we can create it before the dev server starts
  await createManifestForDev(imaConfig, configWithMappedEnvironments);

  // Start the Vite dev server
  const vite = await createServer({
    ...configWithMappedEnvironments,
    appType: 'custom',
  });

  vite.watcher.on('add', (filePath) => {
    logger.info(`${filePath} ${chalk.green('(new file)')}`);
  });

  vite.watcher.on('change', (filePath) => {
    logger.info(`${filePath} ${chalk.yellow('(changed)')}`);
  });

  vite.watcher.on('unlink', (filePath) => {
    logger.info(`${filePath} ${chalk.red('(deleted)')}`);
  });

  // Initialize application server with additional hooks for development
  const { createApp } = await import(
    path.resolve(args.rootDir, 'server/app.js')
  );
  const { app, imaServer } = createApp(vite, addDevServerMiddlewaresFactory({
    args,
    config: imaConfig,
    environment,
    vite,
  }));

  imaServer.emitter.prependListener(Event.Response, async (event: any) => {
    // Skip controllers with $responseType: 'json'
    if (event.res.getHeader('Content-Type') === 'application/json') {
      return;
    }

    event.context.response.content = await vite.transformIndexHtml(
      event.req.url,
      event.context.response.content
    );
  });


  const httpServer = app.listen(environment.$Server.port, () => {
    logger.info(
      'The app is running at ' + publicUrl
    );
  });

  // Graceful shutdown – nodemon sends SIGTERM before restarting the process
  process.once('SIGTERM', async () => {
    httpServer.close();
    await vite.close();
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
