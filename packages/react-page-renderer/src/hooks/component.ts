import type { Dictionary, Router, EventBus, Utils } from '@ima/core';
import { useMemo, useRef } from 'react';

import { usePageContext } from './pageContext';
import type { defaultCssClasses } from '../componentHelpers';

export interface useComponentType {
  utils: Utils;
  cssClasses: typeof defaultCssClasses;
  localize: InstanceType<typeof Dictionary>['get'];
  link: InstanceType<typeof Router>['link'];
  fire: InstanceType<typeof EventBus>['fire'];
  listen: InstanceType<typeof EventBus>['listen'];
  unlisten: InstanceType<typeof EventBus>['unlisten'];
}

/**
 * "Constructor" like hook, which makes sure, that provided callback
 * is called only once during component's lifecycle.
 *
 * @example
 * useOnce(() => {
 * 	oneTimeAction();
 * });
 *
 * @param {Function} callback
 */
export function useOnce(callback: () => void): void {
  const called = useRef(false);

  if (called.current) {
    return;
  }

  callback && callback();
  called.current = true;
}

/**
 * Base hook you can use to initialize your component.
 *
 * Returns object, which gives you access to the same features you would
 * get in your class component:
 *  - Utility methods: cssClasses, localize, link, fire, listen, unlisten.
 *  - Objects: utils (=== ComponentUtils).
 *
 * @example
 * const { utils, cssClasses } = useComponent();
 *
 * @returns Object containing context data and utility methods.
 */
export function useComponent(): useComponentType {
  const { $Utils } = usePageContext();

  return useMemo<useComponentType>(
    () => ({
      utils: $Utils,
      cssClasses: (...params) => $Utils.$CssClasses(...params),
      localize: (...params) => $Utils.$Dictionary.get(...params),
      link: (...params) => $Utils.$Router.link(...params),
      fire: (...params) => $Utils.$EventBus.fire(...params),
      listen: (...params) => $Utils.$EventBus.listen(...params),
      unlisten: (...params) => $Utils.$EventBus.unlisten(...params),
    }),
    [$Utils]
  );
}
