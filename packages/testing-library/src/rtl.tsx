import * as imaCore from '@ima/core';
import { PageContext } from '@ima/react-page-renderer';
import { render, RenderOptions } from '@testing-library/react'; // eslint-disable-line import/named
import React, { ReactElement } from 'react';

import { getImaTestingLibraryClientConfig } from './configuration';
import { requireFromProject } from './helpers';
import { generateDictionary } from './localization';
import type { ContextValue } from './types';

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
  const config = getImaTestingLibraryClientConfig();

  if (!document || !window) {
    throw new Error(
      'Missing document, or window. Are you running the test in the jsdom environment?'
    );
  }

  if (!mainFile[config.appMainPath]) {
    mainFile[config.appMainPath] = requireFromProject(config.appMainPath);
  }

  if (!dictionary[$IMA.$Language]) {
    if (!$IMA.$Language) {
      throw new Error(
        'Variable $IMA.$Language is not defined. The variable should be defined in the jsdom html template, but it is missing. Maybe your SPA template is not setting this variable?'
      );
    }

    dictionary[$IMA.$Language] = generateDictionary($IMA.$Language);
  }

  const { ima, getInitialAppConfigFunctions } = mainFile[config.appMainPath];

  // Init language files
  // This must be initialized before oc.get('$Dictionary').init() is called (usualy part of initServices)
  $IMA.i18n = dictionary[$IMA.$Language];

  const app = ima.createImaApp();
  const bootConfig = ima.getClientBootConfig(getInitialAppConfigFunctions());

  // Init app
  ima.bootClientApp(app, bootConfig);

  config.afterInitImaApp(app);

  return app;
}

export function getContextValue(
  app?: ReturnType<typeof imaCore.createImaApp>
): ContextValue {
  const config = getImaTestingLibraryClientConfig();

  if (!app) {
    app = initImaApp();
  }

  return config.getContextValue(app);
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
