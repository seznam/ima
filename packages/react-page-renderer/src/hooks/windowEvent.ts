import type { CaptureOptions, UnknownParameters } from '@ima/core';
import { useEffect, useMemo } from 'react';

import { useComponentUtils } from './componentUtils';

/**
 * Hook which you can use to quickly bind native window events.
 * It returns object with utility methods, that are usually used
 * together with binding/unbinding window events. If we omit
 * event target while using this hook, it defaults to current window.
 * This results in smaller and cleaner syntax in most use cases.
 * Omitting function parameters provides access to some window utils.
 *
 * @example
 * // Using window as event target
 * const { dispatchEvent, createCustomEvent } = useWindowEvent({
 * 	event: 'custom-event',
 * 	callback: () => windowEventCallback(a, b)
 * });
 *
 * // Using custom event target
 * const { dispatchEvent } = useWindowEvent({
 * 	event: 'click',npm
 * 	eventTarget: window.getElementById('page'),
 * 	callback: () => windowEventCallback(a, b),
 * 	useCapture: false,
 * });
 *
 * // Dispatching custom event
 * useEffect(() => {
 * 	dispatchEvent(
 * 		createCustomEvent('custom-event'),
 * 		{ data: {} }
 * 	);
 * });
 *
 * // Omitting function parameters
 * const {
 *   window,
 *   dispatchEvent,
 *   createCustomEvent
 * } = useWindowEvent();
 *
 * @param	params
 * @param eventTarget Optional event target, if left blank
 * 	it defaults to current window (=> can be omitted in most use cases).
 * @param event Event name.
 * @param callback Callback to register to window event.
 * @param useCapture Use capture instead of bubbling (default).
 * @returns `window` object and utility methods.
 */
export function useWindowEvent({
  eventTarget,
  event,
  callback,
  useCapture = false,
}: {
  eventTarget?: EventTarget;
  event?: string;
  callback?: (event: Event) => void;
  useCapture?: boolean | CaptureOptions;
} = {}) {
  const { $Window } = useComponentUtils();
  const window = $Window.getWindow();

  if (!eventTarget) {
    eventTarget = window;
  }

  useEffect(() => {
    if (eventTarget && event && callback) {
      $Window.bindEventListener(eventTarget, event, callback, useCapture);
    }

    return () => {
      if (eventTarget && event && callback) {
        $Window.unbindEventListener(eventTarget, event, callback, useCapture);
      }
    };
  }, [$Window, eventTarget, event, callback, useCapture]);

  return useMemo(
    () => ({
      window,
      dispatchEvent: (event: Event) => window && window.dispatchEvent(event),
      createCustomEvent: (name: string, options: UnknownParameters) =>
        $Window.createCustomEvent(name, options),
    }),
    [$Window]
  );
}
