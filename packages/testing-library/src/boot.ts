import type { AppEnvironment, InitAppConfig } from '@ima/core';
import * as imaFallback from '@ima/core';

import { generateDictionary } from './localization';
import type { ImaApp } from './types';

export interface BootImaAppOptions {
  /**
   * IMA.js core module. Defaults to @ima/core.
   * Pass the project's own @ima/core instance when npm-linked to ensure the same
   * pluginLoader singleton is used.
   */
  ima?: typeof imaFallback;
  /**
   * Boot config functions for the IMA application.
   */
  appConfigFunctions: InitAppConfig;
  /**
   * Override window.$IMA.$Env before booting. If not provided, the existing value is kept.
   */
  environment?: keyof AppEnvironment;
  /**
   * Whether to call ima.onLoad() before booting. Defaults to false.
   */
  onLoad?: boolean;
}

/**
 * Validates that the test is running in a jsdom environment.
 *
 * @throws {Error} When document or window is not available.
 */
export function validateJsdomEnvironment(): void {
  if (
    typeof globalThis.document === 'undefined' ||
    typeof globalThis.window === 'undefined'
  ) {
    throw new Error(
      'Missing document, or window. Are you running the test in the jsdom environment?'
    );
  }
}

/**
 * Boots an IMA application in a jsdom environment.
 * Handles dictionary initialization, environment override, app creation and boot.
 *
 * @returns The booted IMA application instance.
 */
export async function bootImaApp({
  ima = imaFallback,
  appConfigFunctions,
  environment,
  onLoad = false,
}: BootImaAppOptions): Promise<ImaApp> {
  if (environment !== undefined) {
    setImaEnvironment(environment);
  }

  await generateDictionary();

  const app = await ima.createImaApp();
  const bootConfig = await ima.getClientBootConfig(appConfigFunctions);

  if (onLoad) {
    await ima.onLoad();
  }

  await ima.bootClientApp(app, bootConfig);

  return app;
}

function setImaEnvironment(environment: keyof AppEnvironment): void {
  const windowIma =
    typeof window !== 'undefined' &&
    typeof window.$IMA === 'object' &&
    window.$IMA !== null
      ? window.$IMA
      : undefined;
  const globalIma =
    typeof globalThis.$IMA === 'object' && globalThis.$IMA !== null
      ? globalThis.$IMA
      : undefined;

  if (windowIma) {
    windowIma.$Env = environment;
  } else if (globalIma && typeof window !== 'undefined') {
    window.$IMA = globalIma;
  }

  if (globalIma) {
    globalIma.$Env = environment;
  } else if (windowIma) {
    globalThis.$IMA = windowIma;
  }
}
