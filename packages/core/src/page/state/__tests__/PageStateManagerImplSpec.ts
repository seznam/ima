import PageStateManager from '../PageStateManagerImpl';
import Dispatcher from '../../../event/DispatcherImpl';
import Events from '../Events';
import { toMockedInstance } from 'to-mock';

describe('ima.core.page.state.PageStateManagerImpl', () => {
  let stateManager: PageStateManager;
  let defaultState = { state: 'state', patch: null };
  let patchState = { patch: 'patch' };
  let queuedPatchState1 = { lazy: 'patch' };
  let queuedPatchState2 = { queued: 'patch', lazy: 'overriden' };
  let dispatcher = toMockedInstance(Dispatcher);

  beforeEach(() => {
    stateManager = new PageStateManager(dispatcher);

    stateManager._pushToHistory(defaultState);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
      jest.spyOn(stateManager, '_eraseExcessHistory').mockImplementation();
      jest.spyOn(stateManager, '_pushToHistory').mockImplementation();
      jest.spyOn(stateManager, '_callOnChangeCallback');
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
    });

    it('should set smooth copy last state and state patch', () => {
      let newState = Object.assign({}, defaultState, patchState);

      stateManager.setState(patchState);

      expect(stateManager._eraseExcessHistory).toHaveBeenCalledWith();
      expect(stateManager._pushToHistory).toHaveBeenCalledWith(newState);
      expect(stateManager._callOnChangeCallback).toHaveBeenCalledWith(newState);
      expect(dispatcher.fire).toHaveBeenNthCalledWith(
        1,
        Events.BEFORE_CHANGE_STATE,
        { newState, patchState, oldState: defaultState },
        true
      );
      expect(dispatcher.fire).toHaveBeenNthCalledWith(
        2,
        Events.AFTER_CHANGE_STATE,
        { newState },
        true
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
      jest.spyOn(console, 'warn').mockImplementation();

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
      jest.spyOn(console, 'warn').mockImplementation();

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

      jest.spyOn(stateManager, 'setState');

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
