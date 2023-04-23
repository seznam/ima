import { EventBus, type EventBusListener } from '@ima/core';
import { useEffect, useMemo } from 'react';

import { useComponentUtils } from './componentUtils';

export interface useEventBusType {
  fire: EventBus['fire'];
}

/**
 * Hook to register listeners for dispatcher events. Returns
 * decorated dispatcher fire function. Omitting hook params
 * doesn't register any events to the dispatcher but provides
 * access to the dispatcher's fire method.
 *
 * @example
 * const { fire } = useEventBus(
 * 	componentRef.current,
 * 	'event',
 *  () => {}
 * );
 *
 * @param event Event name.
 * @param callback Callback to register to dispatcher.
 * @returns Dispatcher `fire` method.
 */
export function useEventBus(
  eventTarget: EventTarget,
  eventName: string,
  listener: EventBusListener
): useEventBusType {
  const { $EventBus } = useComponentUtils();

  useEffect(() => {
    $EventBus.listen(eventTarget, eventName, listener);

    return () => {
      $EventBus.unlisten(eventTarget, eventName, listener);
    };
  }, [$EventBus]);

  return useMemo<useEventBusType>(
    () => ({
      fire: (...params) => $EventBus.fire(...params),
    }),
    [$EventBus]
  );
}
