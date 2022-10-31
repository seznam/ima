import { useMemo } from 'react';

import { useComponentUtils } from './componentUtils';

/**
 * Provides two utility values `isClient` and `isServer`,
 * which lets you know what kind of rendering is being done.
 *
 * @example
 * const { isClient, isServer } = useSSR();
 * @returns {{
 *  isServer: boolean,
 *  isClient: boolean,
 * }}
 */
function useSSR() {
  const { $Window } = useComponentUtils();

  return useMemo(
    () => ({
      isClient: $Window.isClient(),
      isServer: !$Window.isClient()
    }),
    [$Window]
  );
}

export { useSSR };
