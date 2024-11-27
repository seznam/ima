import { getContextValue, renderHookWithContext } from '@ima/testing-library';

import { useLocalize } from '../localize';

describe('useLocalize', () => {
  it('should return shortcut to $Dictionary.get utility', async () => {
    const contextValue = await getContextValue();

    contextValue.$Utils.$Dictionary.get = jest
      .fn()
      .mockReturnValue('$Dictionary.get');

    const { result } = await renderHookWithContext(() => useLocalize(), {
      contextValue,
    });

    expect(result.current()).toBe('$Dictionary.get');
  });
});
