import { strict as assert } from 'node:assert';

import * as imaFallback from '@ima/core';
import type {
  ClientRouter,
  InitAppConfig,
  PageManager,
  PageRenderer,
} from '@ima/core';
import { assignRecursively } from '@ima/helpers';

import { bootImaApp, validateJsdomEnvironment } from '../boot';
import { unAopAll } from './aop';
import { initBindApp, initRouter } from './bind';
import { trackWindowEventListeners } from './events';
import { getImaTestingLibraryClientConfig } from '../client/configuration';
import type { ImaApp } from '../types';

const setIntervalNative = global.setInterval;
const setTimeoutNative = global.setTimeout;
const setImmediateNative = global.setImmediate;
const consoleAssertNative = global.console?.assert;
let windowScrollToNative: typeof window.scrollTo | undefined;

let timers: Array<{
  timer:
    | ReturnType<typeof setInterval>
    | ReturnType<typeof setTimeout>
    | ReturnType<typeof setImmediate>;
  clear: () => void;
}> = [];

// Kept so a not awaited clearImaApp still finishes before the next application boots.
let pendingCleanup: Promise<void> | undefined;
// Guards the module level environment shims against a second overlapping boot.
let bootInProgress = false;

type BootConfigMethodName =
  'initSettings' | 'initBindApp' | 'initServicesApp' | 'initRoutes';
type BootConfigMethod = (...args: unknown[]) => unknown;
type BootConfigMethods = Partial<InitAppConfig>;
type ImaAppExtended = ImaApp & Record<string, unknown>;
let clearWindowEventListeners: (() => void) | undefined;

/**
 * Returns the boot config method when the config actually provides one.
 */
function getBootConfigMethod(
  bootConfigMethods: BootConfigMethods,
  method: BootConfigMethodName
): BootConfigMethod | undefined {
  const bootConfigMethod = bootConfigMethods[method];

  return typeof bootConfigMethod === 'function'
    ? (bootConfigMethod as BootConfigMethod)
    : undefined;
}

/**
 * Clears an IMA application instance from the environment.
 * Call this in afterEach/afterAll to clean up between tests.
 */
export async function clearImaApp(app?: ImaApp | null): Promise<void> {
  const cleanup = pendingCleanup
    ? pendingCleanup.catch(() => undefined).then(() => clearImaAppInternal(app))
    : clearImaAppInternal(app);

  pendingCleanup = cleanup;
  void cleanup.then(clearPendingCleanup, clearPendingCleanup);

  return cleanup;

  function clearPendingCleanup(): void {
    if (pendingCleanup === cleanup) {
      pendingCleanup = undefined;
    }
  }
}

async function clearImaAppInternal(app?: ImaApp | null): Promise<void> {
  try {
    if (app) {
      const router = app.oc.get('$Router') as ClientRouter;
      const pageRenderer = app.oc.get('$PageRenderer') as PageRenderer;
      const pageManager = app.oc.get('$PageManager') as PageManager;

      router.unlistenAll();
      pageRenderer.unmount();
      await pageManager.destroy();
    }
  } finally {
    app?.oc.clear();
    restoreIntegrationEnvironment();
  }
}

function restoreIntegrationEnvironment(): void {
  global.setInterval = setIntervalNative;
  global.setTimeout = setTimeoutNative;
  global.setImmediate = setImmediateNative;

  if (global.console && consoleAssertNative) {
    global.console.assert = consoleAssertNative;
  }

  if (windowScrollToNative) {
    window.scrollTo = windowScrollToNative;
    windowScrollToNative = undefined;
  }

  timers.forEach(({ clear }) => clear());
  timers = [];
  clearWindowEventListeners?.();
  clearWindowEventListeners = undefined;
  unAopAll();
}

/**
 * Initializes an IMA application for integration testing.
 *
 * Compared to the unit-testing initImaApp from @ima/testing-library, this variant:
 * - Dynamically imports the app's main module through the app/main alias
 * - Wraps global timers so they can be cleaned up after each test
 * - Runs a prebootScript before booting
 * - Supports boot config method overrides through the client configuration
 * - Calls $Router.listen() so IMA's route handler is active in jsdom
 *
 * @param bootConfigMethods - Optional boot config methods that extend the configured defaults.
 */
export async function initImaApp(
  bootConfigMethods: BootConfigMethods = {}
): Promise<ImaAppExtended> {
  validateJsdomEnvironment();

  // A rejected cleanup must not mask the boot, clearImaApp already reported it.
  await pendingCleanup?.catch(() => undefined);

  if (bootInProgress) {
    throw new Error(
      'Another integration application is already booting. Await the previous ' +
        'initImaApp call before starting a new one.'
    );
  }

  const clientConfig = getImaTestingLibraryClientConfig();
  const integrationConfig = clientConfig.integration;
  let environmentRestored = false;

  bootInProgress = true;

  try {
    // Setup global assert for XPath selectors
    global.console.assert = assert;

    _installTimerWrappers();
    windowScrollToNative = window.scrollTo;
    window.scrollTo = () => {};

    await integrationConfig.prebootScript();

    await clientConfig.beforeInitImaApp();

    // Imported dynamically, not as a top level import like in rtl.tsx, so that the
    // module evaluation of app/main happens after prebootScript.
    const mainModule = await import('app/main');
    const getInitialAppConfigFunctions =
      mainModule.getInitialAppConfigFunctions ||
      mainModule.default?.getInitialAppConfigFunctions;

    if (!getInitialAppConfigFunctions) {
      throw new Error(
        'Cannot find getInitialAppConfigFunctions in app/main. ' +
          'Make sure the module exports getInitialAppConfigFunctions.'
      );
    }

    // Prefer the project's @ima/core export to ensure we use the same pluginLoader
    // singleton. This is critical when the package is npm-linked, as the link would
    // otherwise resolve to a separate @ima/core instance.
    const ima = mainModule.ima || mainModule.default?.ima || imaFallback;

    const defaultBootConfigMethods =
      typeof getInitialAppConfigFunctions === 'function'
        ? ((await getInitialAppConfigFunctions()) as BootConfigMethods)
        : (getInitialAppConfigFunctions as BootConfigMethods);

    const app = await bootImaApp({
      ima,
      appConfigFunctions: {
        initSettings: _mergeBootConfigMethod(
          'initSettings',
          defaultBootConfigMethods
        ),
        initBindApp: _mergeBootConfigMethod(
          'initBindApp',
          defaultBootConfigMethods
        ),
        initServicesApp: _mergeBootConfigMethod(
          'initServicesApp',
          defaultBootConfigMethods
        ),
        initRoutes: _mergeBootConfigMethod(
          'initRoutes',
          defaultBootConfigMethods
        ),
      },
      onLoad: true,
    });

    try {
      (app.oc.get('$Router') as ClientRouter).listen();

      const result = Object.assign(
        app,
        integrationConfig.extendAppObject(app)
      ) as ImaAppExtended;

      await clientConfig.afterInitImaApp(result);

      return result;
    } catch (error) {
      // The application is already booted, so it needs the full teardown, which
      // restores the environment as well.
      environmentRestored = true;
      await clearImaApp(app);
      throw error;
    }
  } catch (error) {
    if (!environmentRestored) {
      restoreIntegrationEnvironment();
    }

    throw error;
  } finally {
    bootInProgress = false;
  }

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
   * Returns a merged boot config method combining defaults, the integration
   * bindings, client configuration, and the per-call override.
   */
  function _mergeBootConfigMethod(
    method: BootConfigMethodName,
    defaultBootConfigMethods: BootConfigMethods
  ) {
    return (...args: unknown[]) => {
      const results: unknown[] = [];
      const isBindApp = method === 'initBindApp';

      function invoke(methods: BootConfigMethods): void {
        const bootConfigMethod = getBootConfigMethod(methods, method);

        if (bootConfigMethod) {
          results.push(bootConfigMethod(...args) ?? {});
        }
      }

      invoke(defaultBootConfigMethods);

      // Runs after the application bindings so that the configured $PageRenderer
      // is the one wrapped for React Testing Library.
      if (isBindApp) {
        initBindApp(...(args as Parameters<typeof initBindApp>));
      }

      invoke(integrationConfig);
      invoke(bootConfigMethods);

      // Runs last so that the hook is applied to the final $Router implementation.
      if (isBindApp) {
        const [, oc] = args as Parameters<typeof initBindApp>;

        clearWindowEventListeners = trackWindowEventListeners(
          oc.get('$Window')
        );
        initRouter(oc);
      }

      if (method === 'initSettings') {
        return assignRecursively({}, ...results);
      }

      return null;
    };
  }
}
