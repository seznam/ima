import { Dictionary } from '@ima/core';
import { useCallback } from 'react';

import { useComponentUtils } from './componentUtils';

/**
 * Provides direct access to Dictionary.get function.
 *
 * @example
 * const localize = useLocalize();
 *
 * @returns Localized string.
 */
export function useLocalize(): InstanceType<typeof Dictionary>['get'] {
  const { $Dictionary } = useComponentUtils();

  return useCallback((...params) => $Dictionary.get(...params), [$Dictionary]);
}
