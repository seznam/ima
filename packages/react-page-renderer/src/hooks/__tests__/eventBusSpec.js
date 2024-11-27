import { getContextValue, renderHookWithContext } from '@ima/testing-library';

import { useEventBus } from '../eventBus';

/**
 * Create eventBus mock instance and set it to context value.
 * @param {import('@ima/testing-library').ContextValue} contextValue
 * @returns {object} eventBus mock
 */
function mockEventBus(contextValue) {
  let listener = null;
  const eventBus = {
    fire: jest.fn(() => {
      if (listener) {
        listener();
      }
    }),
    listen: jest.fn((_, __, fn) => {
      listener = fn;
    }),
    unlisten: jest.fn(),
  };

  contextValue.$Utils.$EventBus = eventBus;

  return eventBus;
}

describe('useEventBus', () => {
  it('should return `fire` callback', async () => {
    const { result } = await renderHookWithContext(() => useEventBus());

    expect(result.current.fire).toBeInstanceOf(Function);
  });

  it('should call listen/unlisten/fire methods', async () => {
    const listener = jest.fn();
    const listenerArgs = ['eventTarget', 'eventName'];
    const contextValue = await getContextValue();

    const eventBus = mockEventBus(contextValue);

    const { result, unmount } = await renderHookWithContext(
      () => useEventBus(...listenerArgs, listener),
      { contextValue }
    );

    // Only listen should be called on component mount
    expect(eventBus.listen).toHaveBeenCalledTimes(1);
    expect(eventBus.listen).toHaveBeenCalledWith(
      ...listenerArgs,
      expect.any(Function)
    );
    expect(listener).toHaveBeenCalledTimes(0);
    expect(eventBus.unlisten).toHaveBeenCalledTimes(0);
    expect(eventBus.fire).toHaveBeenCalledTimes(0);

    result.current.fire();

    // The hook fire method should call eventBus fire method and trigger listener
    expect(eventBus.fire).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(1);

    unmount();

    // Only unlisten should be called on component unmount
    expect(eventBus.listen).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(eventBus.unlisten).toHaveBeenCalledTimes(1);
    expect(eventBus.unlisten).toHaveBeenCalledWith(
      ...listenerArgs,
      expect.any(Function)
    );
    expect(eventBus.fire).toHaveBeenCalledTimes(1);
  });
});
