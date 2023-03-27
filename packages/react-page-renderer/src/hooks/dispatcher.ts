import type { Dispatcher, DispatcherListener } from '@ima/core';
import { useEffect, useMemo } from 'react';

import { useComponentUtils } from './componentUtils';

export interface useDispatcherType {
  fire: Dispatcher['fire'];
}

/**
 * Hook to register listeners for dispatcher events. Returns
 * decorated dispatcher fire function. Omitting hook params
 * doesn't register any events to the dispatcher but provides
 * access to the dispatcher's fire method.
 *
 * @example
 * const { fire } = useDispatcher(
 * 	'dispatcher-event',
 * 	() => {}
 * );
 *
 * // Access $Dispatcher's.fire method without registering listener
 * const { fire } = useDispatcher();
 *
 * // Firing custom event
 * useEffect(() => {
 * 	fire('another-event', { data: {} })
 * });
 *
 * @param event Event name.
 * @param callback Callback to register to dispatcher.
 * @returns Dispatcher `fire` method.
 */
export function useDispatcher(
  event?: string,
  callback?: DispatcherListener
): useDispatcherType {
  const { $Dispatcher } = useComponentUtils();

  useEffect(() => {
    if (event && callback) {
      $Dispatcher.listen(event, callback);
    }

    return () => {
      if (event && callback) {
        $Dispatcher.unlisten(event, callback);
      }
    };
  }, [$Dispatcher, event, callback]);

  return useMemo<useDispatcherType>(
    () => ({
      fire: (...params) => $Dispatcher.fire(...params),
    }),
    [$Dispatcher]
  );
}
