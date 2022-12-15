import { useCallback } from 'react';

import { useComponentUtils } from './componentUtils';

/**
 * Provides direct access to Router link function.
 *
 * @example
 * const link = useLink();
 * @returns {function(string, Object<string, *>): string} Router.link
 */
function useLink() {
  const { $Router } = useComponentUtils();

  return useCallback((...params) => $Router.link(...params), [$Router]);
}

export { useLink };
