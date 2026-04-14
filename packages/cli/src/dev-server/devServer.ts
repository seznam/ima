/**
 * Standalone dev-server entry point started (and restarted) by nodemon.
 *
 * - Creates the Vite HMR server
 * - Imports the application's server/server.js to start the server
 * - Shuts everything down cleanly when nodemon sends SIGTERM before a restart
 *
 * All ImaCliArgs are passed in via the IMA_CLI_ARGS environment variable.
 */

import path from 'path';

import kill from 'kill-port';

import { ImaCliArgs } from '../types';
import { createViteDevServer } from './createViteDevServer';
import {
  createDevServerConfig,
  resolveEnvironment,
  resolveImaConfig,
  runImaPluginsHook,
} from '../vite/utils/utils';

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

  // Kill processes running on the same port
  await Promise.all([
    kill(environment.$Server.port),
    kill(devServerConfig.port),
  ]);

  // Run preProcess hook on IMA CLI Plugins
  await runImaPluginsHook(args, imaConfig, 'preProcess');

  // Start the HMR server
  const { vite } = await createViteDevServer({
    args,
    config: imaConfig,
    hostname: devServerConfig.hostname,
    port: devServerConfig.port,
    publicUrl: devServerConfig.publicUrl,
    rootDir: args.rootDir,
    environment,
  });

  // Used by @ima/server
  global.$IMA_SERVER = {
    viteDevServer: vite,
  };

  // Start the application server
  await import(path.resolve(args.rootDir, 'server/server.js'));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
