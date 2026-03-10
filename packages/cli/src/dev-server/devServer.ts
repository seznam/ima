import path from 'path';

import { logger } from '@ima/dev-utils/logger';
import { Event } from '@ima/server';

import { ImaCliArgs } from '../types';
import {
  createDevServerConfig,
  resolveEnvironment,
  resolveImaConfig,
  runImaPluginsHook,
} from '../vite/utils/utils';
import { createViteDevServer } from './createViteDevServer';
import 'extensionless/register'; // @TODO: tmp hotfix of invalid esm builds

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

  /**
   * Set public env variable which is used to load assets in the SSR error view.
   * CLI Args should always override the config values.
   */
  const devServerConfig = createDevServerConfig({ imaConfig, args });
  process.env.IMA_CLI_DEV_SERVER_PUBLIC_URL = devServerConfig.publicUrl;

  // Run preProcess hook on IMA CLI Plugins
  await runImaPluginsHook(args, imaConfig, 'preProcess');

  const { vite } = await createViteDevServer({
    args,
    config: imaConfig,
    hostname: devServerConfig.hostname,
    port: devServerConfig.port,
    publicUrl: devServerConfig.publicUrl,
    rootDir: args.rootDir,
    environment,
  });

  // Initialize application server with additional hooks for development
  const { createApp } = await import(
    path.resolve(args.rootDir, 'server/app.js')
  );
  const { app, imaServer } = createApp(vite);

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
      `The app is running at http://localhost:${environment.$Server.port}`
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
