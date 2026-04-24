import type { Namespace, ObjectContainer } from '@ima/core';

import { aop, hookName, createHook } from './aop';

/**
 * Initializes AOP hook for Router to update JSDOM URL on first navigation.
 * This simulates browser behavior where the URL is already set in the address bar.
 */
export function initBindApp(ns: Namespace, oc: ObjectContainer): void {
  const Router = (oc.get('$Router') as any).constructor;
  const routeHook = createHook(
    hookName.beforeMethod,
    'route',
    ({ args, context }: { args: any[]; context: any }) => {
      const pageManager = oc.get('$PageManager') as any;
      const isFirstNavigation = !pageManager._managedPage.controller;
      const path = args[0];

      // Set correct url in jsdom for first application navigation to simulate
      // browser behavior, where you already have correct url set in address bar.
      if (isFirstNavigation) {
        const url = context.getBaseUrl() + path;

        // jest-environment-jsdom: use history API to update location
        window.history.replaceState(null, '', url);
      }
    }
  );

  aop(Router, routeHook);
}
