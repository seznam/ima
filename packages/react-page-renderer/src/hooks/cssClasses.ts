import { useCallback } from 'react';

import { useComponentUtils } from './componentUtils';
import { defaultCssClasses } from '../componentHelpers';

/**
 * Provides direct access to CssClasses.
 *
 * @example
 * const cssClasses = useCssClasses();
 *
 * @returns CssClasses function.
 */
function useCssClasses(): typeof defaultCssClasses {
  const { $CssClasses } = useComponentUtils();

  return useCallback((...params) => $CssClasses(...params), [$CssClasses]);
}

export { useCssClasses };
