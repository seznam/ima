import type { WindowEventTargetsMap, WindowEventTargets } from '@ima/core';
import { useEffect, useMemo } from 'react';

import { useComponentUtils } from './componentUtils';

export type useWindowEventType = {
  window: globalThis.Window | undefined;
  dispatchEvent: (event: Event) => boolean | undefined;
  createCustomEvent: <T = any>(
    name: string,
    options: CustomEventInit<T>
  ) => CustomEvent<T>;
};

/**
 * Hook for binding window events using IMA window API.
 *
 * @example
 * // Using window as event target
 * const { dispatchEvent, createCustomEvent } = useWindowEvent(
 *   window,
 *   'custom-event',
 *   () => windowEventCallback(a, b)
 * );
 *
 * // Using custom event target
 * const { dispatchEvent } = useWindowEvent(
 * 	window.getElementById('page'),
 * 	'click',
 * 	() => windowEventCallback(a, b),
 * 	false,
 * );
 *
 * // Dispatching custom event
 * useEffect(() => {
 * 	dispatchEvent(
 * 		createCustomEvent('custom-event'),
 * 		{ data: {} }
 * 	);
 * });
 *
 * @param	params
 * @param eventTarget Optional event target, if left blank
 * 	it defaults to current window (=> can be omitted in most use cases).
 * @param event Event name.
 * @param callback Callback to register to window event.
 * @param useCapture Use capture instead of bubbling (default).
 * @returns `window` object and utility methods.
 */
export function useWindowEvent<
  T extends WindowEventTargets,
  K extends keyof WindowEventTargetsMap<T>,
>(
  eventTarget: T,
  event: K,
  listener: (event: WindowEventTargetsMap<T>[K]) => void,
  useCapture?: boolean | EventListenerOptions
): useWindowEventType;
export function useWindowEvent<T extends EventTarget, E extends Event = Event>(
  eventTarget: T,
  event: string,
  listener: (event: E) => void,
  useCapture?: boolean | EventListenerOptions
): useWindowEventType;
export function useWindowEvent<T extends EventTarget, E extends Event = Event>(
  eventTarget: T,
  event: string,
  listener: (event: E) => void,
  useCapture?: boolean | EventListenerOptions
): useWindowEventType {
  const { $Window } = useComponentUtils();
  const window = $Window.getWindow();

  useEffect(() => {
    if (eventTarget && event && listener) {
      $Window.bindEventListener(eventTarget, event, listener, useCapture);
    }

    return () => {
      if (eventTarget && event && listener) {
        $Window.unbindEventListener(eventTarget, event, listener, useCapture);
      }
    };
  }, [$Window, eventTarget, event, listener, useCapture]);

  return useMemo(
    () => ({
      window,
      dispatchEvent: event => window?.dispatchEvent(event),
      createCustomEvent: (name, options) =>
        $Window.createCustomEvent(name, options),
    }),
    [$Window]
  );
}
