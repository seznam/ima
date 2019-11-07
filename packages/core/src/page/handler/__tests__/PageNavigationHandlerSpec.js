import PageNavigationHandler from 'page/handler/PageNavigationHandler';
import Window from 'window/Window';
import ActionTypes from 'router/ActionTypes';

jest.useFakeTimers();

describe('ima.page.handler.PageNavigationHandler', () => {
  let handler;
  let window;

  beforeEach(() => {
    window = new Window();
    spyOn(window, 'getWindow').and.returnValue({
      history: { scrollRestoration: 'auto' }
    });

    handler = new PageNavigationHandler(window);
    handler.init();
  });

  afterEach(() => {
    handler.destroy();
  });

  describe('constructor()', () => {
    it("should set 'scrollRestoration' property to 'manual'", () => {
      const browserWindow = window.getWindow();
      expect(browserWindow.history.scrollRestoration).toBe('manual');
    });
  });

  describe('handlePreManagedState() method', () => {
    it('should call window.replaceState and then window.pushState method', () => {
      const replaceStateMock = spyOn(window, 'replaceState');
      const pushStateMock = spyOn(window, 'pushState').and.stub();
      const nextManagedPage = { options: { autoScroll: true } };

      handler.handlePreManagedState({}, nextManagedPage, {
        url: 'http://localhost/'
      });

      expect(replaceStateMock).toHaveBeenCalled();
      expect(pushStateMock).toHaveBeenCalled();
    });

    it('should not call window.pushState after loading page because url is set alright from browser', () => {
      const replaceStateMock = spyOn(window, 'replaceState');
      const pushStateMock = spyOn(window, 'pushState').and.stub();
      const nextManagedPage = { options: { autoScroll: true } };

      handler.handlePreManagedState(null, nextManagedPage, {
        url: 'http://localhost/'
      });

      expect(replaceStateMock).not.toHaveBeenCalled();
      expect(pushStateMock).not.toHaveBeenCalled();
    });

    it('should not call window.pushState after POP_STATE action because url is set alright from browser', () => {
      const replaceStateMock = spyOn(window, 'replaceState');
      const pushStateMock = spyOn(window, 'pushState').and.stub();
      const nextManagedPage = { options: { autoScroll: true } };

      handler.handlePreManagedState(null, nextManagedPage, {
        url: 'http://localhost/',
        action: ActionTypes.POP_STATE
      });

      expect(replaceStateMock).not.toHaveBeenCalled();
      expect(pushStateMock).not.toHaveBeenCalled();
    });

    it('Window.scrollTo method should not be called if routers autoScroll option was set to false.', () => {
      spyOn(window, 'scrollTo').and.stub();
      const nextManagedPage = { options: { autoScroll: false } };

      handler.handlePreManagedState(null, nextManagedPage, {});

      jest.runAllTimers();
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('Window should be scrolled to the top if routers autoScroll option was set to true.', () => {
      spyOn(window, 'scrollTo').and.stub();
      const nextManagedPage = { options: { autoScroll: true } };

      handler.handlePreManagedState(null, nextManagedPage, {});

      jest.runAllTimers();
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('handlePostManagedState() method', () => {
    it('should call window.scrollTo method', () => {
      spyOn(window, 'scrollTo').and.stub();

      const managedPage = { options: { autoScroll: true } };
      const scroll = { x: 0, y: 340 };

      handler.handlePostManagedState(managedPage, null, {
        event: { state: { scroll } }
      });

      jest.runAllTimers();
      expect(window.scrollTo).toHaveBeenCalledWith(scroll.x, scroll.y);
    });

    it('should not call window.scrollTo for undefined scroll position', () => {
      spyOn(window, 'scrollTo').and.stub();

      const managedPage = { options: { autoScroll: true } };

      handler.handlePostManagedState(managedPage, null, {});

      jest.runAllTimers();
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('should not call window.scrollTo if current route has autoScroll set to false', () => {
      spyOn(window, 'scrollTo').and.stub();

      const managedPage = { options: { autoScroll: false } };
      const scroll = { x: 0, y: 340 };

      handler.handlePostManagedState(managedPage, null, {
        event: { state: { scroll } }
      });

      jest.runAllTimers();
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });
});
