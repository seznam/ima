import fs from 'node:fs';
import path from 'node:path';

import type { Environment } from '@ima/core';
import type { createIMAServer } from '@ima/server';

export interface ServerConfiguration {
  /**
   * The protocol of the application.
   */
  protocol: string;
  /**
   * The host of the application.
   */
  host: string;
  /**
   * The process environment configuration. This allows you to change the environment configuration that will be available in jsdom.
   */
  processEnvironment: (env: Environment) => Environment;
  /**
   * The path to the application folder.
   */
  applicationFolder: string | undefined;
  beforeCreateIMAServer: () => Promise<void> | void;
  afterCreateIMAServer: (
    imaServer: ReturnType<typeof createIMAServer>
  ) => Promise<void> | void;
}

const FALLBACK_APPLICATION_FOLDER = path.resolve(__dirname, '..');

export function resolveDefaultServerConfiguration(): ServerConfiguration {
  const config: ServerConfiguration = {
    protocol: 'https:',
    host: 'imajs.io',
    processEnvironment: env => env,
    applicationFolder: undefined,
    beforeCreateIMAServer: () => {},
    afterCreateIMAServer: () => {},
  };

  if (!fs.existsSync(path.resolve('.', 'server/config/environment.js'))) {
    config.applicationFolder = FALLBACK_APPLICATION_FOLDER;
  }

  return config;
}
