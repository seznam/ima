import { toMockedInstance } from 'to-mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DispatcherImpl } from '../../../event/DispatcherImpl';
import { PageStateManagerDecorator } from '../PageStateManagerDecorator';
import { PageStateManagerImpl } from '../PageStateManagerImpl';

describe('ima.core.page.state.PageStateManagerDecorator', () => {
  const dispatcher: DispatcherImpl = toMockedInstance(DispatcherImpl);
  let pageStateManager: PageStateManagerImpl;
  const allowedStateKeys = ['allow'];
  let decoratedPageStateManager: PageStateManagerDecorator;
  const state = {
    allow: 1,
    deny: 0,
  };

  beforeEach(() => {
    pageStateManager = new PageStateManagerImpl(dispatcher);
    decoratedPageStateManager = new PageStateManagerDecorator(
      pageStateManager,
      allowedStateKeys
    );
  });

  it('should call method clear', () => {
    vi.spyOn(pageStateManager, 'clear').mockImplementation();

    decoratedPageStateManager.clear();

    expect(pageStateManager.clear).toHaveBeenCalled();
  });

  it('should return current page state', () => {
    vi.spyOn(pageStateManager, 'getState').mockReturnValue(state);

    decoratedPageStateManager.getState();

    expect(decoratedPageStateManager.getState()).toStrictEqual(state);
  });

  it('should return all history of states', () => {
    vi.spyOn(pageStateManager, 'getAllStates').mockReturnValue([state]);

    expect(decoratedPageStateManager.getAllStates()).toStrictEqual([state]);
  });

  describe('setState method', () => {
    it('should throw GenericError for at least one deny key', () => {
      expect(() => {
        decoratedPageStateManager.setState({ deny: 1 });
      }).toThrow();
    });

    it('should throw GenericError for at least one deny key in transaction mode', () => {
      decoratedPageStateManager.beginTransaction();

      expect(() => {
        decoratedPageStateManager.setState({ deny: 1 });
      }).toThrow();

      decoratedPageStateManager.cancelTransaction();
    });

    it('should setState for all allowed keys', () => {
      const patchState = {
        allow: 0,
      };

      vi.spyOn(pageStateManager, 'setState').mockImplementation();

      decoratedPageStateManager.setState(patchState);

      expect(pageStateManager.setState).toHaveBeenCalledWith(patchState);
    });

    it('should commit transaction for all allowed keys', () => {
      const patchState = {
        allow: 0,
      };

      decoratedPageStateManager.beginTransaction();
      decoratedPageStateManager.setState(patchState);
      decoratedPageStateManager.commitTransaction();

      expect(pageStateManager.getState()).toStrictEqual(patchState);
    });
  });
});
