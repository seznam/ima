import { toMockedInstance } from 'to-mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DispatcherImpl } from '../../../event/DispatcherImpl';
import { PageStateManagerImpl } from '../PageStateManagerImpl';
import { StateEvents } from '../StateEvents';

describe('ima.core.page.state.PageStateManagerImpl', () => {
  let stateManager: PageStateManagerImpl;
  const defaultState = { state: 'state', patch: null };
  const patchState = { patch: 'patch' };
  const queuedPatchState1 = { lazy: 'patch' };
  const queuedPatchState2 = { queued: 'patch', lazy: 'overriden' };
  const dispatcher = toMockedInstance(DispatcherImpl);

  beforeEach(() => {
    stateManager = new PageStateManagerImpl(dispatcher);

    stateManager._pushToHistory(defaultState);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should clear history', () => {
    stateManager.clear();

    expect(stateManager['_states']).toHaveLength(0);
    expect(stateManager['_cursor']).toBe(-1);
  });

  describe('getState method', () => {
    it('should returns default state', () => {
      expect(stateManager.getState()).toStrictEqual(defaultState);
    });

    it('should returns empty object for empty history', () => {
      stateManager.clear();

      expect(stateManager.getState()).toStrictEqual({});
    });
  });

  describe('setState method', () => {
    beforeEach(() => {
      vi.spyOn(stateManager, '_eraseExcessHistory').mockImplementation();
      vi.spyOn(stateManager, '_pushToHistory').mockImplementation();
      vi.spyOn(stateManager, '_callOnChangeCallback');
      vi.spyOn(dispatcher, 'fire').mockImplementation(() => {
        return;
      });
    });

    it('should set smooth copy last state and state patch', () => {
      const newState = Object.assign({}, defaultState, patchState);

      stateManager.setState(patchState);

      expect(stateManager._eraseExcessHistory).toHaveBeenCalledWith();
      expect(stateManager._pushToHistory).toHaveBeenCalledWith(newState);
      expect(stateManager._callOnChangeCallback).toHaveBeenCalledWith(newState);
      expect(dispatcher.fire).toHaveBeenNthCalledWith(
        1,
        StateEvents.BEFORE_CHANGE_STATE,
        { newState, patchState, oldState: defaultState }
      );
      expect(dispatcher.fire).toHaveBeenNthCalledWith(
        2,
        StateEvents.AFTER_CHANGE_STATE,
        { newState }
      );
    });

    it('should add the state patch to the queue during transaction', () => {
      stateManager.beginTransaction();

      stateManager.setState(patchState);

      expect(stateManager['_statePatchQueue']).toHaveLength(1);
      expect(stateManager._pushToHistory).not.toHaveBeenCalled();
      expect(dispatcher.fire).not.toHaveBeenCalled();
    });
  });

  it('should return history of states', () => {
    expect(stateManager.getAllStates()).toStrictEqual([defaultState]);
  });

  describe('beginTransaction method', () => {
    it('should show warning for another ongoing transaction', () => {
      stateManager['_ongoingTransaction'] = true;
      vi.spyOn(console, 'warn').mockImplementation();

      stateManager.beginTransaction();

      expect(console.warn).toHaveBeenCalled();
    });

    it('should flag transaction and empty queue', () => {
      stateManager.beginTransaction();

      expect(stateManager['_ongoingTransaction']).toBe(true);
      expect(stateManager['_statePatchQueue']).toHaveLength(0);
    });
  });

  describe('commitTransaction method', () => {
    it('should show warning for no active transaction', () => {
      stateManager['_ongoingTransaction'] = false;
      vi.spyOn(console, 'warn').mockImplementation();

      stateManager.commitTransaction();

      expect(console.warn).toHaveBeenCalled();
    });

    it('should patch state with all the queued patches in order they were queued', () => {
      const finalState = Object.assign(
        {},
        queuedPatchState1,
        queuedPatchState2
      );
      stateManager.beginTransaction();

      stateManager.setState(queuedPatchState1);
      stateManager.setState(queuedPatchState2);

      vi.spyOn(stateManager, 'setState');

      stateManager.commitTransaction();

      expect(stateManager.setState).toHaveBeenCalledWith(finalState);
      expect(stateManager.getState().lazy).toBe('overriden');
    });
  });

  describe('cancelTransaction method', () => {
    it('should cancel transaction and empty queue', () => {
      stateManager.beginTransaction();
      stateManager.setState(queuedPatchState1);

      stateManager.cancelTransaction();

      expect(stateManager['_ongoingTransaction']).toBe(false);
      expect(stateManager['_statePatchQueue']).toHaveLength(0);
    });
  });

  describe('getTransactionStatePatches method', () => {
    it('should return queueing state patches off the main state from the begin of transaction.', () => {
      stateManager.beginTransaction();
      stateManager.setState(queuedPatchState1);
      stateManager.setState(queuedPatchState2);

      expect(stateManager.getTransactionStatePatches()).toStrictEqual([
        queuedPatchState1,
        queuedPatchState2,
      ]);
    });
  });
});
