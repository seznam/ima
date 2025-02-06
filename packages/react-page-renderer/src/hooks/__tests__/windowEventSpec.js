import { getContextValue, renderHookWithContext } from '@ima/testing-library';

import { useWindowEvent } from '../windowEvent';

describe('useWindowEvent', () => {
  let contextValue;
  let windowMock = {
    dispatchEvent: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    contextValue = await getContextValue();

    contextValue.$Utils.$Window = {
      getWindow: jest.fn().mockReturnValue(windowMock),
      createCustomEvent: jest.fn(),
      bindEventListener: jest.fn(),
      unbindEventListener: jest.fn(),
    };
  });

  it('should return window and utility functions', async () => {
    const { result } = await renderHookWithContext(
      () => useWindowEvent('custom-target', 'custom-event', jest.fn()),
      { contextValue }
    );

    expect(result.current).toMatchInlineSnapshot(`
      {
        "createCustomEvent": [Function],
        "dispatchEvent": [Function],
        "window": {
          "dispatchEvent": [MockFunction],
        },
      }
    `);
  });

  it('should bind events correctly', async () => {
    let cb = jest.fn();

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
