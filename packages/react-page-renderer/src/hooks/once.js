import { useRef } from 'react';

/**
 * "Constructor" like hook, which makes sure, that provided callback
 * is called only once during component's lifecycle.
 *
 * @example
 * useOnce(() => {
 * 	oneTimeAction();
 * });
 * @param {Function} callback
 */
function useOnce(callback) {
  const called = useRef(false);

  if (called.current) {
    return;
  }

  callback && callback();
  called.current = true;
}

export { useOnce };
