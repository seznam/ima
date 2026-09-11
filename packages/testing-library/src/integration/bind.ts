import { PageRenderer } from '@ima/core';
import type { ClientRouter, Namespace, ObjectContainer } from '@ima/core';

import { aop, hookName, createHook } from './aop';
import {
  createTestingLibraryClientPageRenderer,
  type PageRendererConstructor,
} from './TestingLibraryClientPageRenderer';

/**
 * Replaces the page renderer configured by the application with a subclass that
 * renders through React Testing Library.
 */
export function initBindApp(ns: Namespace, oc: ObjectContainer): void {
  // The dependencies are read from the existing entry so that applications binding a
  // custom page renderer keep their own constructor signature.
  const pageRendererEntry = oc._getEntry('$PageRenderer');
  const ClientPageRenderer = pageRendererEntry?.classConstructor;

  if (!ClientPageRenderer) {
    throw new Error(
      'Cannot find the configured IMA $PageRenderer. Make sure the application ' +
        'binds it before the integration initBindApp runs.'
    );
  }

  const TestingLibraryClientPageRenderer =
    createTestingLibraryClientPageRenderer(
      ClientPageRenderer as unknown as PageRendererConstructor
    );

  oc.provide(
    PageRenderer,
    TestingLibraryClientPageRenderer,
    pageRendererEntry.dependencies
  );
  oc.bind('$PageRenderer', PageRenderer);
}

/**
 * Initializes AOP hook for Router to update JSDOM URL on first navigation.
 * This simulates browser behavior where the URL is already set in the address bar.
 */
export function initRouter(oc: ObjectContainer): void {
  const router = oc.get('$Router') as ClientRouter;
  const Router = router.constructor as typeof ClientRouter;
  let isFirstNavigation = true;
  const routeHook = createHook<ClientRouter, Parameters<ClientRouter['route']>>(
    hookName.beforeMethod,
    'route',
    ({ args, context }) => {
      const [path] = args;

      // Set correct url in jsdom for first application navigation to simulate
      // browser behavior, where you already have correct url set in address bar.
      if (isFirstNavigation) {
        isFirstNavigation = false;
        const url = context.getBaseUrl() + path;

        // jest-environment-jsdom: use history API to update location
        window.history.replaceState(null, '', url);
      }
    }
  );

  aop(Router, routeHook);
}
