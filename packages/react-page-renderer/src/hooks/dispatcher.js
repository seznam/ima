import { useEffect, useMemo } from 'react';

import { useComponentUtils } from './componentUtils';

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
 * @param {string} [event=null] Event name.
 * @param {Function} [callback=null] Callback to register to dispatcher.
 * @returns {{
 * 	fire: function(string, Object<string, *>, boolean)
 * }} Dispatcher `fire` method.
 */
function useDispatcher(event = null, callback = null) {
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

  return useMemo(
    () => ({
      fire: (...params) => $Dispatcher.fire(...params),
    }),
    [$Dispatcher]
  );
}

export { useDispatcher };
