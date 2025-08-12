import { renderHookWithContext } from '@ima/testing-library';
import { describe, expect, it } from 'vitest';

import { useComponentUtils } from '../componentUtils';

describe('useComponentUtils', () => {
  it('should return componentUtils', async () => {
    const { result, contextValue } = await renderHookWithContext(() =>
      useComponentUtils()
    );

    expect(result.current).toBe(contextValue.$Utils);
  });
});
