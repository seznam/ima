import * as imaFallback from '@ima/core';
import { routeClientApp } from '@ima/core';

import { bootImaApp, validateJsdomEnvironment } from '../boot';
import {
  getBootConfigMethod,
  mergeBootConfigMethods,
  type BootConfigMethods,
} from './bootConfig';
import {
  installIntegrationEnvironment,
  isIntegrationEnvironmentInstalled,
  restoreIntegrationEnvironment,
} from './environment';
import { getImaTestingLibraryClientConfig } from '../client/configuration';
import type { ImaApp } from '../types';

type ImaAppExtended = ImaApp & Record<string, unknown>;

// Kept so a not awaited clearImaApp still finishes before the next application boots.
let pendingCleanup: Promise<void> | undefined;
// Guards the module level environment shims against a second overlapping boot.
let bootInProgress = false;
const clearedApps = new WeakSet<ImaApp>();

/**
 * Tears down an application booted by initImaApp and restores the globals wrapped
 * during its boot. Always await it. Clearing an already cleared application does
 * nothing.
 *
 * @param app - The application returned from initImaApp.
 * @throws When a teardown step fails, with an AggregateError for multiple failures.
 *         The remaining steps still run.
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
  if (app && clearedApps.has(app)) {
    return;
  }

  const errors: unknown[] = [];
  const attempt = async (step: () => unknown) => {
    try {
      await step();
    } catch (error) {
      errors.push(error);
    }
  };

  if (app) {
    clearedApps.add(app);

    await attempt(() => app.oc.get('$Router').unlistenAll());
    // Destroyed before unmounting, the page handlers can still render during teardown.
    await attempt(() => app.oc.get('$PageManager').destroy());
    await attempt(() => app.oc.get('$PageRenderer').unmount());
    await attempt(() => app.oc.clear());
  }

  await attempt(restoreIntegrationEnvironment);

  if (errors.length > 1) {
    throw new AggregateError(errors, 'Clearing the IMA application failed.');
  }

  if (errors.length === 1) {
    throw errors[0];
  }
}

/**
 * Initializes an IMA application for integration testing.
 *
 * Compared to the unit-testing initImaApp from @ima/testing-library, this variant:
 * - Dynamically imports the app's main module through the app/main alias
 * - Wraps global timers and animation frames so they can be cleared with the application
 * - Runs a prebootScript before booting
 * - Supports boot config method overrides through the client configuration
 *
 * The booted application is not routed, use routeImaApp for the initial navigation.
 *
 * @param bootConfigMethods - Optional boot config methods that extend the configured defaults.
 * @returns The booted application extended by the configured extendAppObject.
 * @throws {Error} When another application is booting or was not cleared yet, and
 *         when app/main resolves to the fallback application without initRoutes.
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

  if (isIntegrationEnvironmentInstalled()) {
    throw new Error(
      'Another integration application is still active. Await ' +
        'clearImaApp(app) before calling initImaApp again.'
    );
  }

  const clientConfig = getImaTestingLibraryClientConfig();
  const integrationConfig = clientConfig.integration;
  let environmentRestored = false;

  bootInProgress = true;

  try {
    installIntegrationEnvironment();

    await integrationConfig.prebootScript();

    await clientConfig.beforeInitImaApp();

    // Imported dynamically, not as a top level import like in rtl.tsx, so that the
    // module evaluation of app/main happens after prebootScript.
    const mainModule = await import('app/main');
    const getInitialAppConfigFunctions =
      mainModule.getInitialAppConfigFunctions ??
      mainModule.default?.getInitialAppConfigFunctions;

    if (!getInitialAppConfigFunctions) {
      throw new Error(
        'Cannot find getInitialAppConfigFunctions in app/main. ' +
          'Make sure the module exports getInitialAppConfigFunctions.'
      );
    }

    if (
      (mainModule.isFallbackApplication ??
        mainModule.default?.isFallbackApplication) &&
      !getBootConfigMethod(integrationConfig, 'initRoutes') &&
      !getBootConfigMethod(bootConfigMethods, 'initRoutes')
    ) {
      throw new Error(
        'The app/main module resolved to the @ima/testing-library fallback ' +
          'application, which has no routes. Map ^app/main$ to the application ' +
          'entry point in the Jest moduleNameMapper, or provide initRoutes.'
      );
    }

    // Prefer the project's @ima/core export to ensure we use the same pluginLoader
    // singleton. This is critical when the package is npm-linked, as the link would
    // otherwise resolve to a separate @ima/core instance.
    const ima = mainModule.ima ?? mainModule.default?.ima ?? imaFallback;

    const defaultBootConfigMethods =
      typeof getInitialAppConfigFunctions === 'function'
        ? ((await getInitialAppConfigFunctions()) as BootConfigMethods)
        : (getInitialAppConfigFunctions as BootConfigMethods);

    // reviveClientApp derives the global from $IMA before creating the application,
    // so tests can opt out of the debug-only code paths of the framework.
    globalThis.$Debug = !!globalThis.$IMA?.$Debug;

    const app = await bootImaApp({
      ima,
      appConfigFunctions: mergeBootConfigMethods(
        defaultBootConfigMethods,
        integrationConfig,
        bootConfigMethods
      ),
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

      try {
        await clearImaApp(app);
      } catch (cleanupError) {
        throw new AggregateError(
          [error, cleanupError],
          'IMA application initialization and cleanup both failed.'
        );
      }

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
 * @param routerRoot - Event target the router listens on instead of window.
 * @returns The result of the initial route.
 * @throws {Error} The fatal routing error when the application defines no
 *         $IMA.fatalErrorHandler, since IMA would only log a warning.
 */
export async function routeImaApp(
  app: ImaApp,
  path?: string,
  routerRoot?: EventTarget
): Promise<unknown> {
  if (path !== undefined) {
    window.history.replaceState(null, '', path);
  }

  const { fatalErrorHandler } = $IMA;

  if (typeof fatalErrorHandler === 'function') {
    return routeClientApp(app, routerRoot);
  }

  const fatalErrors: Error[] = [];

  $IMA.fatalErrorHandler = error => {
    fatalErrors.push(error);
  };

  try {
    const result = await routeClientApp(app, routerRoot);

    if (fatalErrors.length) {
      throw fatalErrors[0];
    }

    return result;
  } finally {
    $IMA.fatalErrorHandler = fatalErrorHandler;
  }
}
