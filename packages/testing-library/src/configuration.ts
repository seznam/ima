import path from 'node:path';

import type { createImaApp, Environment } from '@ima/core';

import type { ContextValue } from './types';

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
}

export interface ClientConfiguration {
  /**
   * The path to the main application file. This file should be exporting getInitialAppConfigFunctions and ima keys.
   */
  appMainPath: string;
  /**
   * The path to the IMA configuration file. This can be only configured once before first `initImaApp` call and cannot be reconfigured later.
   */
  rootDir: string;
  /**
   * The function that will be called after the IMA application is initialized.
   */
  afterInitImaApp: (app: ReturnType<typeof createImaApp>) => void;
  /**
   * The function that will be called after the context value is created.
   */
  getContextValue: (app: ReturnType<typeof createImaApp>) => ContextValue;
}

const serverConfiguration: ServerConfiguration = {
  protocol: 'https:',
  host: 'imajs.io',
  processEnvironment: env => env,
  applicationFolder: undefined,
};

const clientConfiguration: ClientConfiguration = {
  appMainPath: 'app/main.js',
  rootDir: process.cwd(),
  afterInitImaApp: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getContextValue: app => ({
    $Utils: app.oc.get('$ComponentUtils').getUtils(),
  }),
};

export const FALLBACK_APP_MAIN_PATH = path.resolve(__dirname, 'app/main.js');
export const FALLBACK_APPLICATION_FOLDER = path.resolve(__dirname);

/**
 * Get the current serverConfiguration.
 */
export function getImaTestingLibraryServerConfig() {
  return serverConfiguration;
}

/**
 * Modify the current serverConfiguration.
 */
export function setImaTestingLibraryServerConfig(
  config: Partial<ServerConfiguration>
) {
  Object.assign(serverConfiguration, config);
}

/**
 * Get the current clientConfiguration.
 */
export function getImaTestingLibraryClientConfig() {
  return clientConfiguration;
}

/**
 * Modify the current clientConfiguration.
 */
export function setImaTestingLibraryClientConfig(
  config: Partial<ClientConfiguration>
) {
  Object.assign(clientConfiguration, config);
}
