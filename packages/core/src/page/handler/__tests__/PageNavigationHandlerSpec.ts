/**
 * @jest-environment jsdom
 */

import { ActionTypes } from '../../../router/ActionTypes';
import { ClientWindow } from '../../../window/ClientWindow';
import { ManagedPage, PageAction } from '../../PageTypes';
import { PageNavigationHandler } from '../PageNavigationHandler';

window.scrollTo = jest.fn();

jest.useFakeTimers();

describe('ima.core.page.handler.PageNavigationHandler', () => {
  let handler: PageNavigationHandler;
  let window: ClientWindow;
  let mockBrowserWindow: any;

  beforeEach(() => {
    window = new ClientWindow();

    // Mock requestAnimationFrame for double RAF pattern
    const rafCallbacks: Array<() => void> = [];
    mockBrowserWindow = {
      history: { scrollRestoration: 'auto' },
      requestAnimationFrame: jest.fn((callback: () => void) => {
        rafCallbacks.push(callback);
        // Execute callbacks immediately in tests to simulate frame completion
        setTimeout(() => {
          const cb = rafCallbacks.shift();
          if (cb) cb();
        }, 0);
        return rafCallbacks.length;
      }),
    };

    jest.spyOn(window, 'getWindow').mockReturnValue(mockBrowserWindow);

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
      const replaceStateMock = jest.spyOn(window, 'replaceState');
      const pushStateMock = jest
        .spyOn(window, 'pushState')
        .mockImplementation();
      const nextManagedPage = { options: { autoScroll: true } };

      // Should skip first call
      handler.handlePreManagedState(
        {} as ManagedPage,
        nextManagedPage as ManagedPage,
        {
          url: 'http://localhost/',
        } as PageAction
      );

      handler.handlePreManagedState(
        {} as ManagedPage,
        nextManagedPage as ManagedPage,
        {
          url: 'http://localhost/',
        } as PageAction
      );

      expect(replaceStateMock).toHaveBeenCalled();
      expect(pushStateMock).toHaveBeenCalled();
    });

    it('should call just window.replaceState method for redirect action type', () => {
      const replaceStateMock = jest.spyOn(window, 'replaceState');
      const pushStateMock = jest
        .spyOn(window, 'pushState')
        .mockImplementation();
      const nextManagedPage = { options: { autoScroll: false } };

      // Should skip first call
      handler.handlePreManagedState(
        {} as ManagedPage,
        nextManagedPage as ManagedPage,
        {
          url: 'http://localhost/final_url',
          type: ActionTypes.REDIRECT,
        } as PageAction
      );

      handler.handlePreManagedState(
        {} as ManagedPage,
        nextManagedPage as ManagedPage,
        {
          url: 'http://localhost/final_url',
          type: ActionTypes.REDIRECT,
        } as PageAction
      );

      expect(replaceStateMock).toHaveBeenCalled();
      expect(pushStateMock).not.toHaveBeenCalled();
    });

    it('should not call window.pushState after loading page because url is set alright from browser', () => {
      const replaceStateMock = jest.spyOn(window, 'replaceState');
      const pushStateMock = jest
        .spyOn(window, 'pushState')
        .mockImplementation();
      const nextManagedPage = { options: { autoScroll: true } };

      handler.handlePreManagedState(
        undefined as unknown as ManagedPage,
        nextManagedPage as ManagedPage,
        {
          url: 'http://localhost/',
        } as PageAction
      );

      expect(replaceStateMock).not.toHaveBeenCalled();
      expect(pushStateMock).not.toHaveBeenCalled();
    });

    it('should not call window.pushState after POP_STATE action because url is set alright from browser', () => {
      const replaceStateMock = jest.spyOn(window, 'replaceState');
      const pushStateMock = jest
        .spyOn(window, 'pushState')
        .mockImplementation();
      const nextManagedPage = { options: { autoScroll: true } };

      handler.handlePreManagedState(
        undefined as unknown as ManagedPage,
        nextManagedPage as ManagedPage,
        {
          url: 'http://localhost/',
          action: ActionTypes.POP_STATE,
        } as PageAction
      );

      expect(replaceStateMock).not.toHaveBeenCalled();
      expect(pushStateMock).not.toHaveBeenCalled();
    });

    it('window.scrollTo method should not be called if routers autoScroll option was set to false.', () => {
      jest.spyOn(window, 'scrollTo').mockImplementation(() => {
        return;
      });
      const nextManagedPage = { options: { autoScroll: false } };

      handler.handlePreManagedState(
        {} as ManagedPage,
        nextManagedPage as ManagedPage,
        {} as PageAction
      );

      jest.runAllTimers();
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('window should be scrolled to the top if routers autoScroll option was set to true.', () => {
      jest.spyOn(window, 'scrollTo').mockImplementation();
      const nextManagedPage = { options: { autoScroll: true } };

      // Should skip first call
      handler.handlePreManagedState(
        {} as ManagedPage,
        nextManagedPage as ManagedPage,
        {} as PageAction
      );

      handler.handlePreManagedState(
        {} as ManagedPage,
        nextManagedPage as ManagedPage,
        {} as PageAction
      );

      jest.runAllTimers();
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('handlePostManagedState() method', () => {
    it('should call window.scrollTo method', () => {
      jest.spyOn(window, 'scrollTo').mockImplementation();

      const managedPage = { options: { autoScroll: true } };
      const scroll = { x: 0, y: 340 };

      handler.handlePostManagedState(
        managedPage as ManagedPage,
        {} as ManagedPage,
        {
          event: { state: { scroll } },
        } as PageAction
      );

      jest.runAllTimers();
      expect(window.scrollTo).toHaveBeenCalledWith(scroll.x, scroll.y);
    });

    it('should not call window.scrollTo for undefined scroll position', () => {
      jest.spyOn(window, 'scrollTo').mockImplementation();

      const managedPage = { options: { autoScroll: true } };

      handler.handlePostManagedState(
        managedPage as ManagedPage,
        {} as ManagedPage,
        {} as PageAction
      );

      jest.runAllTimers();
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('should not call window.scrollTo if current route has autoScroll set to false', () => {
      jest.spyOn(window, 'scrollTo').mockImplementation();

      const managedPage = { options: { autoScroll: false } };
      const scroll = { x: 0, y: 340 };

      handler.handlePostManagedState(
        managedPage as ManagedPage,
        {} as ManagedPage,
        {
          event: { state: { scroll } },
        } as PageAction
      );

      jest.runAllTimers();
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });
});
