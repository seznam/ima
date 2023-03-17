import { Router } from '@ima/core';
import { useCallback } from 'react';

import { useComponentUtils } from './componentUtils';

/**
 * Provides direct access to Router link function.
 *
 * @example
 * const link = useLink();
 *
 * @returns URL to linked path.
 */
export function useLink(): InstanceType<typeof Router>['link'] {
  const { $Router } = useComponentUtils();

  return useCallback((...params) => $Router.link(...params), [$Router]);
}
