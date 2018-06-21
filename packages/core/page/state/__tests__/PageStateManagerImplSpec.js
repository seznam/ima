import PageStateManager from 'page/state/PageStateManagerImpl';
import Dispatcher from 'event/Dispatcher';
import Events from '../Events';
import { toMockedInstance } from 'to-mock';

describe('ima.page.state.PageStateManagerImpl', () => {
  let stateManager = null;
  let defaultState = { state: 'state', patch: null };
  let patchState = { patch: 'patch' };
  let dispatcher = toMockedInstance(Dispatcher);

  beforeEach(() => {
    stateManager = new PageStateManager(dispatcher);

    stateManager._pushToHistory(defaultState);
  });

  it('should clear history', () => {
    stateManager.clear();

    expect(stateManager._states.length).toEqual(0);
    expect(stateManager._cursor).toEqual(-1);
  });

  describe('getState method', () => {
    it('should returns default state', () => {
      expect(stateManager.getState()).toEqual(defaultState);
    });

    it('should returns empty object for empty history', () => {
      stateManager.clear();

      expect(stateManager.getState()).toEqual({});
    });
  });

  describe('setState method', () => {
    it('should set smooth copy last state and state patch', () => {
      let newState = Object.assign({}, defaultState, patchState);

      spyOn(stateManager, '_eraseExcessHistory').and.stub();

      spyOn(stateManager, '_pushToHistory').and.stub();

      spyOn(stateManager, '_callOnChangeCallback').and.callThrough();

      spyOn(dispatcher, 'fire');

      stateManager.setState(patchState);

      expect(stateManager._eraseExcessHistory).toHaveBeenCalledWith();
      expect(stateManager._pushToHistory).toHaveBeenCalledWith(newState);
      expect(stateManager._callOnChangeCallback).toHaveBeenCalledWith(newState);
      expect(dispatcher.fire).toHaveBeenCalledWith(
        Events.BEFORE_CHANGE_STATE,
        { newState, patchState, oldState: defaultState },
        true
      );
      expect(dispatcher.fire).toHaveBeenCalledWith(
        Events.AFTER_CHANGE_STATE,
        { newState },
        true
      );
    });
  });

  it('should return history of states', () => {
    expect(stateManager.getAllStates()).toEqual([defaultState]);
  });
});
