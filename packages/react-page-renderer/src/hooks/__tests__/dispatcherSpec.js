import { getContextValue, renderHookWithContext } from '@ima/testing-library';

import { useDispatcher } from '../dispatcher';

/**
 * Create dispatcher mock instance and set it to context value.
 * @param {import('@ima/testing-library').ContextValue} contextValue
 * @returns {object} dispatcher mock
 */
function mockDispatcher(contextValue) {
  const dispatcher = {
    fire: jest.fn(),
    listen: jest.fn(),
    unlisten: jest.fn(),
  };

  contextValue.$Utils.$Dispatcher = dispatcher;

  return dispatcher;
}

describe('useDispatcher', () => {
  it('should return `fire` callback', async () => {
    const { result } = await renderHookWithContext(() => useDispatcher());

    expect(result.current.fire).toBeInstanceOf(Function);
  });

  it('should call listen/unlisten/fire methods', async () => {
    const listenerArgs = ['foo', 'bar'];
    const contextValue = await getContextValue();

    const dispatcher = mockDispatcher(contextValue);

    const { result, unmount } = await renderHookWithContext(
      () => useDispatcher(...listenerArgs),
      { contextValue }
    );

    // Only listen should be called on component mount
    expect(dispatcher.listen).toHaveBeenCalledTimes(1);
    expect(dispatcher.listen).toHaveBeenCalledWith(...listenerArgs);
    expect(dispatcher.unlisten).toHaveBeenCalledTimes(0);
    expect(dispatcher.fire).toHaveBeenCalledTimes(0);

    result.current.fire();

    // The hook fire method should call dispatcher fire method
    expect(dispatcher.fire).toHaveBeenCalledTimes(1);

    unmount();

    // Only unlisten should be called on component unmount
    expect(dispatcher.listen).toHaveBeenCalledTimes(1);
    expect(dispatcher.unlisten).toHaveBeenCalledTimes(1);
    expect(dispatcher.unlisten).toHaveBeenCalledWith(...listenerArgs);
    expect(dispatcher.fire).toHaveBeenCalledTimes(1);
  });
});
