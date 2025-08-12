import { getContextValue, renderHookWithContext } from '@ima/testing-library';
import { describe, expect, it, vi } from 'vitest';

import { useCssClasses } from '../cssClasses';

describe('useCssClasses', () => {
  it('should return shortcut to $CssClasses utility', async () => {
    const contextValue = await getContextValue();

    contextValue.$Utils.$CssClasses = vi.fn().mockReturnValue('$CssClasses');

    const { result } = await renderHookWithContext(() => useCssClasses(), {
      contextValue,
    });

    expect(result.current()).toBe('$CssClasses');
  });
});
