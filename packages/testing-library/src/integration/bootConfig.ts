import type { InitAppConfig } from '@ima/core';
import { assignRecursively } from '@ima/helpers';

import { initBindApp } from './bind';
import { trackApplicationWindow } from './environment';

export type BootConfigMethods = Partial<InitAppConfig>;
type BootConfigMethodName = keyof InitAppConfig;
type BootConfigMethod = (...args: unknown[]) => unknown;

const bootConfigMethodNames: BootConfigMethodName[] = [
  'initSettings',
  'initBindApp',
  'initServicesApp',
  'initRoutes',
];

/**
 * Returns the boot config method when the config actually provides one.
 */
export function getBootConfigMethod(
  bootConfigMethods: BootConfigMethods,
  method: BootConfigMethodName
): BootConfigMethod | undefined {
  const bootConfigMethod = bootConfigMethods[method];

  return typeof bootConfigMethod === 'function'
    ? (bootConfigMethod as BootConfigMethod)
    : undefined;
}

/**
 * Returns boot config methods combining the application defaults, the integration
 * bindings, the shared integration configuration, and the per-call overrides.
 */
export function mergeBootConfigMethods(
  defaultBootConfigMethods: BootConfigMethods,
  integrationBootConfigMethods: BootConfigMethods,
  bootConfigMethods: BootConfigMethods
): InitAppConfig {
  return Object.fromEntries(
    bootConfigMethodNames.map(method => [
      method,
      (...args: unknown[]) => {
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

        invoke(integrationBootConfigMethods);
        invoke(bootConfigMethods);

        // Runs last so that the final $Window instance is the tracked one.
        if (isBindApp) {
          const [, oc] = args as Parameters<typeof initBindApp>;

          trackApplicationWindow(oc.get('$Window'));
        }

        if (method === 'initSettings') {
          return assignRecursively({}, ...results);
        }

        return null;
      },
    ])
  ) as unknown as InitAppConfig;
}
