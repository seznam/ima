import type { AppEnvironment } from '@ima/core';

import type { ImaApp } from '../types';

export interface TestPageRenderer {
  initTestPageRenderer: (...args: unknown[]) => unknown;
}

export interface IntegrationConfiguration {
  /**
   * Path to the app main file. Can be absolute or relative to rootDir.
   */
  appMainPath: string;
  /**
   * Root directory of the project.
   */
  rootDir: string;
  /**
   * IMA environment override. Replaces the value baked into the JSDOM HTML by jest-preset.
   */
  environment: keyof AppEnvironment;
  /**
   * Optional TestPageRenderer class. When set, initTestPageRenderer is called during initBindApp.
   */
  TestPageRenderer: TestPageRenderer | null;
  /**
   * Custom initSettings boot config method.
   */
  initSettings: (...args: unknown[]) => unknown;
  /**
   * Custom initBindApp boot config method.
   */
  initBindApp: (...args: unknown[]) => unknown;
  /**
   * Custom initServicesApp boot config method.
   */
  initServicesApp: (...args: unknown[]) => unknown;
  /**
   * Custom initRoutes boot config method.
   */
  initRoutes: (...args: unknown[]) => unknown;
  /**
   * Extends the app object returned from initImaApp with additional properties.
   */
  extendAppObject: (app: ImaApp) => Record<string, unknown>;
  /**
   * Script to run before the IMA application is booted.
   */
  prebootScript: () => Promise<void>;
}

let configuration: IntegrationConfiguration = {
  appMainPath: 'app/main.js',
  rootDir: process.cwd(),
  environment: 'test' as keyof AppEnvironment,
  TestPageRenderer: null,
  initSettings: () => {},
  initBindApp: () => {},
  initServicesApp: () => {},
  initRoutes: () => {},
  extendAppObject: () => ({}),
  prebootScript: () => Promise.resolve(),
};

/**
 * Gets the current integration configuration.
 */
export function getIntegrationConfig(): IntegrationConfiguration {
  return configuration;
}

/**
 * Sets or updates integration configuration keys.
 */
export function setIntegrationConfig(
  config: Partial<IntegrationConfiguration>
): void {
  configuration = { ...configuration, ...config } as IntegrationConfiguration;
}
