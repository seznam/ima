import { useMemo } from 'react';

import { useComponentUtils } from './componentUtils';
import { Settings } from '../types';

/**
 * IMA $Settings access provider with optional selector.
 *
 * @example
 * const settings = useSettings();
 * console.log(settings.$Cache.enabled);
 *
 * // Using settings selector
 * const { scripts, documentView } = useSettings('$Page.$Render');
 * const esScripts = useSettings('$Page.$Render.esScripts');
 *
 * @param selector Optional path selector.
 * @returns Settings value or undefined.
 */
export function useSettings<T = Settings>(selector?: string): T | undefined {
  const { $Settings } = useComponentUtils();

  if (!selector) {
    return $Settings as T;
  }

  return useMemo<T | undefined>(() => {
    let segment;
    let curSettings = $Settings;
    const segments = selector.split('.');

    while ((segment = segments.shift())) {
      if (!(segment in curSettings)) {
        return undefined;
      }

      curSettings = curSettings[segment] as Settings;
    }

    return curSettings as T;
  }, [$Settings]);
}
