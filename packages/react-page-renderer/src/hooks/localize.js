import { useCallback } from 'react';

import { useComponentUtils } from './componentUtils';

/**
 * Provides direct access to Dictionary.get function.
 *
 * @example
 * const localize = useLocalize();
 * @returns {function(string, Object<string, *>): string} Dictionary.get
 */
function useLocalize() {
  const { $Dictionary } = useComponentUtils();

  return useCallback((...params) => $Dictionary.get(...params), [$Dictionary]);
}

export { useLocalize };
