import PageStateManager from 'page/state/PageStateManagerImpl';
import PageStateManagerDecorator from 'page/state/PageStateManagerDecorator';

describe('ima.page.state.PageStateManagerDecorator', () => {
  let pageStateManager = null;
  let allowedStateKeys = ['allow'];
  let decoratedPageStateManager = null;
  let state = {
    allow: 1,
    deny: 0
  };

  beforeEach(() => {
    pageStateManager = new PageStateManager();
    decoratedPageStateManager = new PageStateManagerDecorator(
      pageStateManager,
      allowedStateKeys
    );
  });

  it('should call method clear', () => {
    spyOn(pageStateManager, 'clear').and.stub();

    decoratedPageStateManager.clear();

    expect(pageStateManager.clear).toHaveBeenCalled();
  });

  it('should return current page state', () => {
    spyOn(pageStateManager, 'getState').and.returnValue(state);

    decoratedPageStateManager.getState();

    expect(decoratedPageStateManager.getState()).toEqual(state);
  });

  it('should return all history of states', () => {
    spyOn(pageStateManager, 'getAllStates').and.returnValue([state]);

    expect(decoratedPageStateManager.getAllStates()).toEqual([state]);
  });

  describe('setState method', () => {
    it('should throw GenericError for at least one deny key', () => {
      expect(() => {
        decoratedPageStateManager.setState({ deny: 1 });
      }).toThrow();
    });

    it('should setState for all allowed keys', () => {
      let patchState = {
        allow: 0
      };

      spyOn(pageStateManager, 'setState').and.stub();

      decoratedPageStateManager.setState(patchState);

      expect(pageStateManager.setState).toHaveBeenCalledWith(patchState);
    });
  });
});
