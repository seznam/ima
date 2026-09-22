import { strict as assert } from 'node:assert';
import {
  clearImmediate as clearImmediateFallback,
  setImmediate as setImmediateFallback,
} from 'node:timers';

import * as imaFallback from '@ima/core';
import { routeClientApp } from '@ima/core';
import type {
  ClientRouter,
  InitAppConfig,
  PageManager,
  PageRenderer,
} from '@ima/core';
import { assignRecursively } from '@ima/helpers';

import { bootImaApp, validateJsdomEnvironment } from '../boot';
import { initBindApp } from './bind';
import { trackWindowEventListeners } from './events';
import { getImaTestingLibraryClientConfig } from '../client/configuration';
import type { ImaApp } from '../types';

interface EnvironmentNatives {
  setInterval: typeof setInterval;
  setTimeout: typeof setTimeout;
  setImmediate: typeof setImmediate;
  clearImmediate: typeof clearImmediate;
  consoleAssert?: typeof console.assert;
  windowScrollTo?: typeof window.scrollTo;
  windowRequestAnimationFrame?: typeof window.requestAnimationFrame;
}

// Captured when the shims are installed so Jest fake timers installed by the test
// are wrapped instead of being replaced by the real implementations.
let environmentNatives: EnvironmentNatives | undefined;
let pendingTimerCleanups: Array<() => void> = [];

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
      try {
        await pageManager.destroy();
      } finally {
        pageRenderer.unmount();
      }
    }
  } finally {
    app?.oc.clear();
    restoreIntegrationEnvironment();
  }
}

function restoreIntegrationEnvironment(): void {
  if (environmentNatives) {
    global.setInterval = environmentNatives.setInterval;
    global.setTimeout = environmentNatives.setTimeout;
    global.setImmediate = environmentNatives.setImmediate;
    global.clearImmediate = environmentNatives.clearImmediate;

    if (global.console && environmentNatives.consoleAssert) {
      global.console.assert = environmentNatives.consoleAssert;
    }

    if (environmentNatives.windowScrollTo) {
      window.scrollTo = environmentNatives.windowScrollTo;
    }

    if (environmentNatives.windowRequestAnimationFrame) {
      window.requestAnimationFrame =
        environmentNatives.windowRequestAnimationFrame;
    }

    environmentNatives = undefined;
  }

  pendingTimerCleanups.forEach(clear => clear());
  pendingTimerCleanups = [];
  clearWindowEventListeners?.();
  clearWindowEventListeners = undefined;
}

/**
 * Initializes an IMA application for integration testing.
 *
 * Compared to the unit-testing initImaApp from @ima/testing-library, this variant:
 * - Dynamically imports the app's main module through the app/main alias
 * - Wraps global timers and animation frames so they can be cleaned up after each test
 * - Runs a prebootScript before booting
 * - Supports boot config method overrides through the client configuration
 *
 * The booted application is not routed, use routeImaApp for the initial navigation.
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
    _installEnvironmentShims();

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
   * Overrides the globals an IMA application relies on but jsdom does not provide,
   * and wraps the scheduling globals so pending work can be cleared in clearImaApp.
   */
  function _installEnvironmentShims(): void {
    const setIntervalNative = global.setInterval;
    const setTimeoutNative = global.setTimeout;
    const setImmediateNative = global.setImmediate;
    const clearImmediateNative = global.clearImmediate;
    const requestAnimationFrameNative = window.requestAnimationFrame;
    const cancelAnimationFrameNative = window.cancelAnimationFrame;

    environmentNatives = {
      setInterval: setIntervalNative,
      setTimeout: setTimeoutNative,
      setImmediate: setImmediateNative,
      clearImmediate: clearImmediateNative,
      consoleAssert: global.console?.assert,
      windowScrollTo: window.scrollTo,
      windowRequestAnimationFrame: requestAnimationFrameNative,
    };

    // node:assert reports the failing expression, which the XPath selectors rely on.
    global.console.assert = assert;
    window.scrollTo = () => {};

    global.setInterval = ((...args: Parameters<typeof setInterval>) => {
      const timer = setIntervalNative(...args);
      pendingTimerCleanups.push(() => global.clearInterval(timer));
      return timer;
    }) as typeof setInterval;

    global.setTimeout = ((...args: Parameters<typeof setTimeout>) => {
      const timer = setTimeoutNative(...args);
      pendingTimerCleanups.push(() => global.clearTimeout(timer));
      return timer;
    }) as typeof setTimeout;

    global.clearImmediate = clearImmediateNative ?? clearImmediateFallback;
    global.setImmediate = ((...args: Parameters<typeof setImmediate>) => {
      const timer = (setImmediateNative ?? setImmediateFallback)(...args);
      pendingTimerCleanups.push(() =>
        (clearImmediateNative ?? clearImmediateFallback)(timer)
      );
      return timer;
    }) as typeof setImmediate;

    // PageNavigationHandler scrolls through a double animation frame, which would
    // otherwise call the restored jsdom window.scrollTo after the test finished.
    if (typeof requestAnimationFrameNative === 'function') {
      window.requestAnimationFrame = (callback => {
        const handle = requestAnimationFrameNative.call(window, callback);
        pendingTimerCleanups.push(() =>
          cancelAnimationFrameNative?.call(window, handle)
        );
        return handle;
      }) as typeof window.requestAnimationFrame;
    }
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

      // Runs last so that the final $Window instance is the tracked one.
      if (isBindApp) {
        const [, oc] = args as Parameters<typeof initBindApp>;

        clearWindowEventListeners = trackWindowEventListeners(
          oc.get('$Window')
        );
      }

      if (method === 'initSettings') {
        return assignRecursively({}, ...results);
      }

      return null;
    };
  }
}

/**
 * Performs the initial navigation of a booted application through IMA's own
 * routeClientApp, which starts the router listeners and routes to the current path.
 *
 * The address bar is updated before routing because IMA expects the browser to have
 * navigated already - PageNavigationHandler deliberately ignores the first
 * pre-manage call and leaves the URL untouched.
 *
 * @param app - The application returned from initImaApp.
 * @param path - Path to navigate to. Defaults to the current jsdom location.
 * @param routerRoot - Optional additional event target the router listens on.
 */
export async function routeImaApp(
  app: ImaApp,
  path?: string,
  routerRoot?: EventTarget
): Promise<unknown> {
  if (path !== undefined) {
    window.history.replaceState(null, '', path);
  }

  return routeClientApp(app, routerRoot);
}
