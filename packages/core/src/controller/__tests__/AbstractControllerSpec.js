import toMock from 'to-mock';
import AbstractController from '../AbstractController';
import PageStateManager from 'src/page/state/PageStateManager';

describe('ima.core.controller.AbstractController', () => {
  let MockedPageStateManager = toMock(PageStateManager);
  let controller = null;
  let pageStateManager = null;

  beforeEach(() => {
    controller = new AbstractController();
    pageStateManager = new MockedPageStateManager();

    controller.setPageStateManager(pageStateManager);
  });

  it('shoudl be throw error for load method', () => {
    expect(() => {
      controller.load();
    }).toThrow();
  });

  it('should be set state to PageStateManager', () => {
    let state = { state: 'state' };

    spyOn(pageStateManager, 'setState').and.stub();

    controller.setState(state);

    expect(pageStateManager.setState).toHaveBeenCalledWith(state);
  });

  describe('getState method', () => {
    it('should be get state from PageStateManager for setted stateManager', () => {
      spyOn(pageStateManager, 'getState').and.stub();

      controller.getState();

      expect(pageStateManager.getState).toHaveBeenCalled();
    });

    it('should be return {} for undefined stateManager', () => {
      controller.setPageStateManager(null);

      expect(controller.getState()).toEqual({});
    });
  });
});
