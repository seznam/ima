import type { Utils } from '@ima/core';

import { usePageContext } from './pageContext';

/**
 * Provides direct access to ComponentUtils.
 *
 * @example
 * const utils = useComponentUtils();
 *
 * @returns Component utils.
 */
export function useComponentUtils(): Utils {
  const pageContext = usePageContext();

  return pageContext.$Utils ?? {};
}
