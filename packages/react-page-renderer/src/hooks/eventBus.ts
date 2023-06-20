import { EventBus, type EventBusListener } from '@ima/core';
import { useCallback, useEffect, useMemo } from 'react';

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
  eventTarget?: EventTarget | null,
  eventName?: string,
  listener?: EventBusListener
): useEventBusType {
  const { $EventBus } = useComponentUtils();
  const memoListener = useCallback(
    (...args: Parameters<EventBusListener>) => {
      listener?.(...args);
    },
    [listener]
  );

  useEffect(() => {
    if (!eventTarget || !eventName || !memoListener) {
      return;
    }

    $EventBus.listen(eventTarget, eventName, memoListener);

    return () => {
      $EventBus.unlisten(eventTarget, eventName, memoListener);
    };
  }, [$EventBus, eventName, eventTarget, memoListener]);

  return useMemo<useEventBusType>(
    () => ({
      fire: (...params) => $EventBus.fire(...params),
    }),
    [$EventBus]
  );
}
