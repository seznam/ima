import { getContextValue, renderHookWithContext } from '@ima/testing-library';
import { describe, expect, it, vi } from 'vitest';

import { useLocalize } from '../localize';

describe('useLocalize', () => {
  it('should return shortcut to $Dictionary.get utility', async () => {
    const contextValue = await getContextValue();

    contextValue.$Utils.$Dictionary.get = vi
      .fn()
      .mockReturnValue('$Dictionary.get');

    const { result } = await renderHookWithContext(() => useLocalize(), {
      contextValue,
    });

    expect(result.current()).toBe('$Dictionary.get');
  });
});
