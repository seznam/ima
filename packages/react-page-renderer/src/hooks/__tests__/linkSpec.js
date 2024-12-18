import { getContextValue, renderHookWithContext } from '@ima/testing-library';

import { useLink } from '../link';

describe('useLink', () => {
  it('should return shortcut to $Router.link utility', async () => {
    const contextValue = await getContextValue();

    contextValue.$Utils.$Router.link = jest
      .fn()
      .mockReturnValue('$Router.link');

    const { result } = await renderHookWithContext(() => useLink(), {
      contextValue,
    });

    expect(result.current()).toBe('$Router.link');
  });
});
