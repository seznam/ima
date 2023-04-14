import type * as imaCore from '@ima/core';
import { Loader, Parameters } from '@storybook/react';
import merge from 'ts-deepmerge';

let app: ReturnType<typeof imaCore.createImaApp> | null = null;
let bootConfig: imaCore.BootConfig | null = null;
let lastImaParams: Parameters = {};

declare global {
  interface Window {
    $Debug: boolean;
  }
}

/**
 * Set revival settings to window.
 */
function initRevivalSettings(parameters: Parameters): void {
  window.$Debug = true;
  window.$IMA = merge(
    window.$IMA,
    {
      $Debug: true,
      Test: true,
      SPA: true,
      $PublicPath: '',
      $RequestID: 'storybook-request-id',
      $Language: 'en',
      $Env: 'regression',
      $Version: '1.0.0',
      $App: {},
      $Protocol: 'http:',
      $Host: 'localhost:6006',
      $Path: '',
      $Root: '',
      $LanguagePartPath: '',
    } as imaCore.GlobalImaObject,
    (parameters?.ima?.$IMA ?? {}) as imaCore.GlobalImaObject
  );
}

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

export const imaLoader: Loader = async args => {
  const { parameters } = args;
  initRevivalSettings(parameters);

  // Create new ima app if any of the params change
  if (
    ['initBindApp', 'initRoutes', 'initServicesApp', 'initSettings'].some(
      key => lastImaParams?.[key] !== parameters?.ima?.[key]
    )
  ) {
    app = null;
    bootConfig = null;
  }

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

  lastImaParams = { ...parameters?.ima };
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
