import { getContextValue, renderHookWithContext } from '@ima/testing-library';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useWindowEvent } from '../windowEvent';

describe('useWindowEvent', () => {
  let contextValue;
  let windowMock = {
    dispatchEvent: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(async () => {
    contextValue = await getContextValue();

    contextValue.$Utils.$Window = {
      getWindow: vi.fn().mockReturnValue(windowMock),
      createCustomEvent: vi.fn(),
      bindEventListener: vi.fn(),
      unbindEventListener: vi.fn(),
    };
  });

  it('should return window and utility functions', async () => {
    const { result } = await renderHookWithContext(
      () => useWindowEvent('custom-target', 'custom-event', vi.fn()),
      { contextValue }
    );

    expect(result.current).toMatchInlineSnapshot(`
      {
        "createCustomEvent": [Function],
        "dispatchEvent": [Function],
        "window": {
          "dispatchEvent": [MockFunction spy],
        },
      }
    `);
  });

  it('should bind events correctly', async () => {
    let cb = vi.fn();

    await renderHookWithContext(
      () => useWindowEvent('custom-target', 'custom-event', cb, true),
      { contextValue }
    );

    expect(contextValue.$Utils.$Window.bindEventListener).toHaveBeenCalledWith(
      'custom-target',
      'custom-event',
      cb,
      true
    );
  });
});
