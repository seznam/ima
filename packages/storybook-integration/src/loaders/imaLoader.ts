import type * as imaCore from '@ima/core';
import { Loader } from '@storybook/react';
import merge from 'ts-deepmerge';

let app: ReturnType<typeof imaCore.createImaApp> | null = null;
let bootConfig: imaCore.BootConfig | null = null;

/**
 * Extend app boot config with parameter overrides.
 */
export function extendBootConfig(
  appConfigFunctions: imaCore.InitAppConfig,
  extendedConfig?: Partial<imaCore.InitAppConfig>
): imaCore.InitAppConfig {
  return {
    initBindApp: (...args) => {
      appConfigFunctions.initBindApp(...args);
      extendedConfig?.initBindApp?.(...args);
    },
    initRoutes: (...args) => {
      appConfigFunctions.initRoutes(...args);
      extendedConfig?.initRoutes?.(...args);
    },
    initServicesApp: (...args) => {
      appConfigFunctions.initServicesApp(...args);
      extendedConfig?.initServicesApp?.(...args);
    },
    initSettings: (...args) => {
      return merge(
        appConfigFunctions.initSettings(...args),
        extendedConfig?.initSettings?.(...args) ?? {}
      );
    },
  };
}

export const imaLoader: Loader = async ({ parameters }) => {
  // Return cached ima app
  if (app && bootConfig) {
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

  app = ima.createImaApp();
  bootConfig = ima.getClientBootConfig(
    extendBootConfig(getInitialAppConfigFunctions(), {
      initBindApp: parameters?.ima?.initBindApp,
      initRoutes: parameters?.ima?.initRoutes,
      initServicesApp: parameters?.ima?.initServicesApp,
      initSettings: parameters?.ima?.initSettings,
    })
  );

  // Init app
  ima.bootClientApp(app, bootConfig);

  return {
    app,
    bootConfig,
  };
};
