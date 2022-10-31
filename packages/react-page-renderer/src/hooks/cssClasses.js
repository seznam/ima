import { useCallback } from 'react';

import { useComponentUtils } from './componentUtils';

/**
 * Provides direct access to CssClasses.
 *
 * @example
 * const cssClasses = useCssClasses();
 * @returns {function(...(string|Object<string, boolean>|string[])): string} classnames
 */
function useCssClasses() {
  const { $CssClasses } = useComponentUtils();

  return useCallback((...params) => $CssClasses(...params), [$CssClasses]);
}

export { useCssClasses };
