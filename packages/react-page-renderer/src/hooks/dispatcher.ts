/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type {
  Dispatcher,
  DispatcherEventsMap,
  DispatcherListener,
} from '@ima/core';
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
 * @param listener Callback to register to dispatcher.
 * @returns Dispatcher `fire` method.
 */
export function useDispatcher<E extends keyof DispatcherEventsMap>(
  event?: E,
  listener?: DispatcherListener<DispatcherEventsMap[E]>
): useDispatcherType;
export function useDispatcher(
  event?: string,
  listener?: DispatcherListener<any>
): useDispatcherType;
export function useDispatcher(
  event?: string,
  listener?: DispatcherListener<any>
): useDispatcherType {
  const { $Dispatcher } = useComponentUtils();

  useEffect(() => {
    if (event && listener) {
      $Dispatcher.listen(event, listener);
    }

    return () => {
      if (event && listener) {
        $Dispatcher.unlisten(event, listener);
      }
    };
  }, [$Dispatcher, event, listener]);

  return useMemo<useDispatcherType>(
    () => ({
      fire: (...params: Parameters<Dispatcher['fire']>) =>
        $Dispatcher.fire(...params),
    }),
    [$Dispatcher]
  );
}
