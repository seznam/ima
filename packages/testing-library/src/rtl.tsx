import { PageContext } from '@ima/react-page-renderer';
import { render, renderHook } from '@testing-library/react';
import type { RenderOptions, RenderHookOptions } from '@testing-library/react';
import type { ReactElement } from 'react';

// import of app/main is resolved by the jest moduleNameMapper
import { ima, getInitialAppConfigFunctions } from 'app/main';

import { bootImaApp, validateJsdomEnvironment } from './boot';
import { getImaTestingLibraryClientConfig } from './client/configuration';
import type {
  ContextValue,
  ImaApp,
  ImaContextWrapper,
  ImaRenderHookResult,
  ImaRenderResult,
} from './types';

/**
 * Initialize the IMA application for testing.
 */
export async function initImaApp(): Promise<ImaApp> {
  validateJsdomEnvironment();

  const config = getImaTestingLibraryClientConfig();

  await config.beforeInitImaApp();

  const app = await bootImaApp({
    ima,
    // Init language files must happen before oc.get('$Dictionary').init() is called
    // (usually part of initServices), bootImaApp handles generateDictionary internally.
    appConfigFunctions: await getInitialAppConfigFunctions(),
  });

  await config.afterInitImaApp(app);

  return app;
}

/**
 * Get the context value for the IMA application.
 */
export async function getContextValue(app?: ImaApp): Promise<ContextValue> {
  const config = getImaTestingLibraryClientConfig();

  if (!app) {
    app = await initImaApp();
  }

  return config.getContextValue(app);
}

/**
 * Creates a context wrapper component from the provided context value.
 */
async function getContextWrapper(
  contextValue: ContextValue
): Promise<ImaContextWrapper> {
  return function IMATestingLibraryContextWrapper({ children }) {
    return (
      <PageContext.Provider value={contextValue}>
        {children}
      </PageContext.Provider>
    );
  };
}

/**
 * Renders the provided React element with the IMA context.
 */
async function renderWithContext(
  ui: ReactElement,
  options?: RenderOptions & { contextValue?: ContextValue; app?: ImaApp }
): Promise<ImaRenderResult> {
  let { app = null, contextValue, ...rest } = options ?? {}; // eslint-disable-line prefer-const

  if (!contextValue) {
    if (!app) {
      app = await initImaApp();
    }

    contextValue = await getContextValue(app);
  }

  const wrapper = await getContextWrapper(contextValue);

  const config = getImaTestingLibraryClientConfig();

  await config.beforeRenderWithContext({ app, contextValue });

  const result = render(ui, { ...rest, wrapper });

  await config.afterRenderWithContext({ app, contextValue, ...result });

  return {
    ...result,
    app,
    contextValue,
  };
}

async function renderHookWithContext<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps> & {
    contextValue?: ContextValue;
    app?: ImaApp;
  }
): Promise<ImaRenderHookResult<TResult, TProps>> {
  let { app = null, contextValue, ...rest } = options ?? {}; // eslint-disable-line prefer-const

  if (!contextValue) {
    if (!app) {
      app = await initImaApp();
    }

    contextValue = await getContextValue(app);
  }

  const wrapper = await getContextWrapper(contextValue);

  const config = getImaTestingLibraryClientConfig();

  await config.beforeRenderHookWithContext({ app, contextValue });

  const result = renderHook(hook, { ...rest, wrapper });

  await config.afterRenderHookWithContext({ app, contextValue, ...result });

  return {
    ...result,
    app,
    contextValue,
  };
}

export * from '@testing-library/react';
export { renderHookWithContext, renderWithContext };
