import { strict as assert } from 'node:assert';
import path from 'node:path';

import * as imaFallback from '@ima/core';
import { assignRecursively } from '@ima/helpers';

import { bootImaApp, validateJsdomEnvironment } from '../boot';
import { unAopAll } from './aop';
import { initBindApp } from './bind';
import { setImaTestingLibraryClientConfig } from '../client/configuration';
import type { ImaApp } from '../types';
import { getIntegrationConfig } from './configuration';

const setIntervalNative = global.setInterval;
const setTimeoutNative = global.setTimeout;
const setImmediateNative = global.setImmediate;
const consoleAssertNative = global.console && global.console.assert;

let timers: Array<{
  timer:
    | ReturnType<typeof setInterval>
    | ReturnType<typeof setTimeout>
    | ReturnType<typeof setImmediate>;
  clear: () => void;
}> = [];

/**
 * Clears an IMA application instance from the environment.
 * Call this in afterEach/afterAll to clean up between tests.
 */
export function clearImaApp(app: ImaApp & Record<string, unknown>): void {
  global.setInterval = setIntervalNative;
  global.setTimeout = setTimeoutNative;
  global.setImmediate = setImmediateNative;

  if (global.console && consoleAssertNative) {
    global.console.assert = consoleAssertNative;
  }

  timers.forEach(({ clear }) => clear());
  timers = [];
  unAopAll();
  app.oc.clear();
}

/**
 * Initializes an IMA application for integration testing.
 *
 * Compared to the unit-testing initImaApp from @ima/testing-library, this variant:
 * - Dynamically imports the app's main module from a configurable path
 * - Wraps global timers so they can be cleaned up after each test
 * - Runs a prebootScript before booting
 * - Supports TestPageRenderer and boot config method overrides via setIntegrationConfig
 * - Calls $Router.listen() so IMA's route handler is active in jsdom
 *
 * @param bootConfigMethods - Optional boot config methods that extend the defaults from setIntegrationConfig.
 */
export async function initImaApp(
  bootConfigMethods: {
    initSettings?: (...args: unknown[]) => unknown;
    initBindApp?: (...args: unknown[]) => unknown;
    initServicesApp?: (...args: unknown[]) => unknown;
    initRoutes?: (...args: unknown[]) => unknown;
  } = {}
): Promise<ImaApp & Record<string, unknown>> {
  validateJsdomEnvironment();

  const config = getIntegrationConfig();
  const { TestPageRenderer } = config;
  const pageRendererResults: unknown[] = [];

  // Setup global assert for XPath selectors
  global.console.assert = assert;

  _installTimerWrappers();

  await config.prebootScript();

  // Configure @ima/testing-library with project root so generateDictionary
  // resolves language files relative to the correct rootDir.
  setImaTestingLibraryClientConfig({
    rootDir: config.rootDir,
  });

  const appMainPath = path.isAbsolute(config.appMainPath)
    ? config.appMainPath
    : path.resolve(config.rootDir, config.appMainPath);
  const mainModule = await import(appMainPath);
  const getInitialAppConfigFunctions =
    mainModule.getInitialAppConfigFunctions ||
    mainModule.default?.getInitialAppConfigFunctions;

  if (!getInitialAppConfigFunctions) {
    throw new Error(
      `Cannot find getInitialAppConfigFunctions in ${config.appMainPath}. ` +
        `Make sure the file exports getInitialAppConfigFunctions function.`
    );
  }

  // Prefer the project's @ima/core export to ensure we use the same pluginLoader
  // singleton. This is critical when the package is npm-linked, as the link would
  // otherwise resolve to a separate @ima/core instance.
  const ima = mainModule.ima || mainModule.default?.ima || imaFallback;

  const defaultBootConfigMethods =
    typeof getInitialAppConfigFunctions === 'function'
      ? await getInitialAppConfigFunctions()
      : getInitialAppConfigFunctions;

  const app = await bootImaApp({
    ima,
    appConfigFunctions: {
      initSettings: _mergeBootConfigMethod('initSettings'),
      initBindApp: _mergeBootConfigMethod('initBindApp'),
      initServicesApp: _mergeBootConfigMethod('initServicesApp'),
      initRoutes: _mergeBootConfigMethod('initRoutes'),
    },
    environment: config.environment,
    onLoad: true,
  });

  // To use IMA route handler in jsdom
  (app.oc.get('$Router') as any).listen();

  return Object.assign(
    {},
    app,
    ...pageRendererResults,
    config.extendAppObject(app)
  );

  /**
   * Wraps the global timer methods to collect their return values
   * so they can be cleared in clearImaApp.
   */
  function _installTimerWrappers(): void {
    global.setInterval = ((...args: Parameters<typeof setInterval>) => {
      const timer = setIntervalNative(...args);
      timers.push({ timer, clear: () => global.clearInterval(timer) });
      return timer;
    }) as typeof setInterval;

    global.setTimeout = ((...args: Parameters<typeof setTimeout>) => {
      const timer = setTimeoutNative(...args);
      timers.push({ timer, clear: () => global.clearTimeout(timer) });
      return timer;
    }) as typeof setTimeout;

    global.setImmediate = ((...args: Parameters<typeof setImmediate>) => {
      const timer = setImmediateNative(...args);
      timers.push({
        timer,
        clear: () => global.clearImmediate(timer),
      });
      return timer;
    }) as typeof setImmediate;
  }

  /**
   * Returns a merged boot config method combining default, TestPageRenderer,
   * router bind hook, config-level override, and per-call override.
   */
  function _mergeBootConfigMethod(
    method: 'initSettings' | 'initBindApp' | 'initServicesApp' | 'initRoutes'
  ) {
    return (...args: unknown[]) => {
      const results: unknown[] = [];

      if (typeof defaultBootConfigMethods[method] === 'function') {
        results.push(defaultBootConfigMethods[method](...args) || {});
      }

      if (method === 'initBindApp') {
        if (TestPageRenderer) {
          const rendererResult = TestPageRenderer.initTestPageRenderer(...args);
          pageRendererResults.push(rendererResult);
        }

        initBindApp(...(args as Parameters<typeof initBindApp>));
      }

      if (typeof config[method] === 'function') {
        results.push(
          (config[method] as (...a: unknown[]) => unknown)(...args) || {}
        );
      }

      if (typeof bootConfigMethods[method] === 'function') {
        results.push(
          (bootConfigMethods[method] as (...a: unknown[]) => unknown)(
            ...args
          ) || {}
        );
      }

      if (method === 'initSettings') {
        return assignRecursively({}, ...results);
      }

      return null;
    };
  }
}
