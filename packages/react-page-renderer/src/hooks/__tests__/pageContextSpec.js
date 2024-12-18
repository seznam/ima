import { renderHookWithContext } from '@ima/testing-library';

import { usePageContext } from '../pageContext';

describe('usePageContext', () => {
  it('should return context', async () => {
    const { result, contextValue } = await renderHookWithContext(() =>
      usePageContext()
    );

    expect(result.current).toBe(contextValue);
  });
});
