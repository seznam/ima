import path from 'node:path';

import * as imaCore from '@ima/core';
import { PageContext } from '@ima/react-page-renderer';
import { render, RenderOptions } from '@testing-library/react'; // eslint-disable-line import/named
import React, { ReactElement } from 'react';

import { getImaTestingLibraryConfig } from './configuration';
import { requireFromProject } from './helpers';
import { generateDictionary } from './localization';

export interface ContextValue {
  $Utils: imaCore.Utils;
}

export const FALLBACK_APP_MAIN_PATH = path.resolve(__dirname, 'app/main.js');

// Some operations take way too long to be executed with each render call,
// so we need to cache these values
const mainFile: Record<
  string,
  {
    ima: typeof imaCore;
    getInitialAppConfigFunctions: () => imaCore.InitAppConfig;
  }
> = {};
const dictionary: Record<string, imaCore.DictionaryConfig['dictionary']> = {};

export function initImaApp() {
  const config = getImaTestingLibraryConfig();

  if (!mainFile[config.appMainPath]) {
    mainFile[config.appMainPath] = requireFromProject(config.appMainPath);
  }

  if (!dictionary[config.locale]) {
    dictionary[config.locale] = generateDictionary(config.locale);
  }

  const { ima, getInitialAppConfigFunctions } = mainFile[config.appMainPath];

  // Init language files
  // This must be initialized before oc.get('$Dictionary').init() is called (usualy part of initServices)
  global.$IMA.i18n = dictionary[config.locale];

  const app = ima.createImaApp();
  const bootConfig = ima.getClientBootConfig(getInitialAppConfigFunctions());

  // Init app
  ima.bootClientApp(app, bootConfig);

  return app;
}

export function getContextValue(
  app?: ReturnType<typeof imaCore.createImaApp>
): ContextValue {
  if (!app) {
    app = initImaApp();
  }

  return { $Utils: app.oc.get('$ComponentUtils').getUtils() };
}

export function getContextWrapper(contextValue?: ContextValue) {
  if (!contextValue) {
    contextValue = getContextValue();
  }

  return function IMATestingLibraryContextWrapper({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <PageContext.Provider value={contextValue as ContextValue}>
        {children}
      </PageContext.Provider>
    );
  };
}

const customRender = (ui: ReactElement, options?: RenderOptions) => {
  let { wrapper, ...rest } = options ?? {}; // eslint-disable-line prefer-const

  if (!wrapper) {
    wrapper = getContextWrapper();
  }

  const result = render(ui, { wrapper, ...rest });

  return result;
};

export * from '@testing-library/react'; // eslint-disable-line import/export
export { customRender as render }; // eslint-disable-line import/export
