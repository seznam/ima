import type { Environment } from '@ima/core';

export interface Configuration {
  /**
   * The path to the main application file. This file should be exporting getInitialAppConfigFunctions and ima keys.
   */
  appMainPath: string;
  /**
   * The path to the IMA configuration file. This can be only configured once before first `initImaApp` call and cannot be reconfigured later.
   */
  imaConfigPath: string;
  /**
   * The protocol of the application. This can be only configured in the jest config file and cannot be reconfigured later.
   */
  protocol: string;
  /**
   * The host of the application. This can be only configured in the jest config file and cannot be reconfigured later.
   */
  host: string;
  /**
   * The locale of the application. This will affect the language of the application.
   */
  locale: string;
  /**
   * The process environment configuration. This allows you to change the environment configuration that will be available in jsdom.
   * This can be only configured in the jest config file and cannot be reconfigured later.
   */
  processEnvironment: (env: Environment) => Environment;
  /**
   * The path to the application folder. This can be only configured in the jest config file and cannot be reconfigured later.
   */
  applicationFolder: string | undefined;
}

const configuration: Configuration = {
  appMainPath: 'app/main.js',
  imaConfigPath: 'ima.config.js',
  protocol: 'https:',
  host: 'imajs.io',
  locale: 'en',
  processEnvironment: env => env,
  applicationFolder: undefined,
};

/**
 * Get the current configuration.
 */
export function getImaTestingLibraryConfig() {
  return configuration;
}

/**
 * Modify the current configuration.
 */
export function setImaTestingLibraryConfig(config: Partial<Configuration>) {
  Object.assign(configuration, config);
}
