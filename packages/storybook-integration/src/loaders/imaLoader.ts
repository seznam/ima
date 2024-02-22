import type * as imaCore from '@ima/core';
import { Loader, Parameters, ReactRenderer } from '@storybook/react';
import { StoryContextForLoaders, StrictArgs } from '@storybook/types';
import merge from 'ts-deepmerge';

import { getImaInitializers } from '../utils/initializer.js';

let app: ReturnType<typeof imaCore.createImaApp> | null = null;
let bootConfig: imaCore.BootConfig | null = null;
let lastImaParams: Parameters = {};

/**
 * Utility to destroy old instance before creating a new one.
 */
async function destroyInstance(
  app: ReturnType<typeof imaCore.createImaApp> | null
): Promise<void> {
  if (!app) {
    return;
  }

  app.oc.get('$Dispatcher').clear();
  app.oc.get('$Router').unlisten();
  app.oc.get('$PageRenderer').unmount();
  await app.oc.get('$PageManager').destroy();
}

/**
 * Set revival settings to window.
 */
function initRevivalSettings(parameters: Parameters): void {
  window.$Debug = true;
  window.$IMA = merge(window.$IMA, parameters?.ima?.$IMA ?? {});
}

/**
 * Update ima state from parameters.ima.state.
 */
function updateState(
  app: ReturnType<typeof imaCore.createImaApp>,
  parameters: Parameters
): void {
  if (!app) {
    return;
  }

  const patchState = parameters?.ima?.state ?? {};
  const stateManager = app.oc.get('$PageStateManager');

  if (patchState === null) {
    return stateManager.clear();
  }

  return stateManager.setState(patchState);
}

/**
 * Extend app boot config with parameter overrides + custom initializers.
 */
export function extendBootConfig(
  storybookArgs: StoryContextForLoaders<ReactRenderer, StrictArgs>,
  appConfigFunctions: imaCore.InitAppConfig,
  extendedConfig?: Parameters['ima']
): imaCore.InitAppConfig {
  const initializers = getImaInitializers(storybookArgs);

  return {
    initBindApp: (...args) => {
      appConfigFunctions.initBindApp(...args);
      initializers.map(callback => callback?.initBindApp?.(...args));
      extendedConfig?.initBindApp?.(...args, storybookArgs);
    },
    initRoutes: (...args) => {
      appConfigFunctions.initRoutes(...args);
      initializers.map(callback => callback?.initRoutes?.(...args));
      extendedConfig?.initRoutes?.(...args, storybookArgs);
    },
    initServicesApp: (...args) => {
      appConfigFunctions.initServicesApp(...args);
      initializers.map(callback => callback?.initServicesApp?.(...args));
      extendedConfig?.initServicesApp?.(...args, storybookArgs);
    },
    initSettings: (...args) => {
      return merge(
        appConfigFunctions.initSettings(...args),
        initializers.reduce((acc, cur) => {
          return merge(acc, cur?.initSettings?.(...args) ?? {});
        }, {}),
        extendedConfig?.initSettings?.(...args, storybookArgs) ?? {}
      );
    },
  };
}

export const imaLoader: Loader = async args => {
  const parameters = args.parameters;
  initRevivalSettings(parameters);

  // Create new ima app if any of the params change
  if (
    [
      'initBindApp',
      'initRoutes',
      'initServicesApp',
      'initSettings',
      '$IMA',
      'args',
      // @ts-expect-error
    ].some(key => lastImaParams?.[key] !== parameters?.ima?.[key])
  ) {
    // Destroy old instance
    await destroyInstance(app);

    app = null;
    bootConfig = null;
  }

  // Return cached ima app
  if (app && bootConfig) {
    // Update page state
    updateState(app, parameters);

    return {
      app,
      bootConfig,
    };
  }

  // Get ima from app/main
  const {
    ima,
    getInitialAppConfigFunctions,
  }: {
    ima: typeof imaCore;
    getInitialAppConfigFunctions: () => imaCore.InitAppConfig;
    // @ts-expect-error this is handled in storybook context with aliases
    // eslint-disable-next-line import/no-unresolved
  } = await import('app/main');

  lastImaParams = { ...parameters?.ima };
  app = ima.createImaApp();
  bootConfig = ima.getClientBootConfig(
    extendBootConfig(args, getInitialAppConfigFunctions(), {
      initBindApp: parameters?.ima?.initBindApp,
      initRoutes: parameters?.ima?.initRoutes,
      initServicesApp: parameters?.ima?.initServicesApp,
      initSettings: parameters?.ima?.initSettings,
    })
  );

  // Init app
  ima.bootClientApp(app, bootConfig);

  // Update page state
  updateState(app, parameters);

  return {
    app,
    bootConfig,
  };
};
