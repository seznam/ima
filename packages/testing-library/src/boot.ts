import type { InitAppConfig } from '@ima/core';
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
 * Handles dictionary initialization, app creation, and boot.
 *
 * @returns The booted IMA application instance.
 */
export async function bootImaApp({
  ima = imaFallback,
  appConfigFunctions,
  onLoad = false,
}: BootImaAppOptions): Promise<ImaApp> {
  await generateDictionary();

  if (onLoad) {
    await ima.onLoad();
  }

  // reviveClientApp derives the global from $IMA before anything reads it, so
  // tests can opt out of the debug-only code paths of the framework.
  globalThis.$Debug = !!globalThis.$IMA?.$Debug;

  const app = await ima.createImaApp();

  try {
    const bootConfig = await ima.getClientBootConfig(appConfigFunctions);

    await ima.bootClientApp(app, bootConfig);

    return app;
  } catch (error) {
    try {
      app.oc.clear();
    } catch (cleanupError) {
      throw new AggregateError(
        [error, cleanupError],
        'IMA application boot and cleanup both failed.'
      );
    }

    throw error;
  }
}
