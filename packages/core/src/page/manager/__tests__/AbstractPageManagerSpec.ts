/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jest/no-conditional-expect */

import { toMockedInstance } from 'to-mock';

import { AbstractController } from '../../../controller/AbstractController';
import { Controller } from '../../../controller/Controller';
import { DispatcherImpl } from '../../../event/DispatcherImpl';
import { AbstractExtension } from '../../../extension/AbstractExtension';
import { GenericError, ManageArgs, RouterEvents } from '../../../index';
import { DynamicRoute } from '../../../router/DynamicRoute';
import { RouteFactory } from '../../../router/RouteFactory';
import { RouteOptions } from '../../../router/Router';
import { StaticRoute } from '../../../router/StaticRoute';
import { PageHandlerRegistry } from '../../handler/PageHandlerRegistry';
import { PageNavigationHandler } from '../../handler/PageNavigationHandler';
import { PageFactory } from '../../PageFactory';
import { PageRenderer } from '../../renderer/PageRenderer';
import { PageStateManager } from '../../state/PageStateManager';
import { AbstractPageManager } from '../AbstractPageManager';

async function wait<T>(value: T, ms = 1000) {
  return new Promise<T>(resolve => {
    setTimeout(() => {
      resolve(value);
    }, ms);
  });
}

class ExtensionMock extends AbstractExtension {
  load() {
    return {};
  }
}

class ControllerMock extends AbstractController {
  dependency: unknown;

  static get $dependencies() {
    return [];
  }

  constructor(dependency: unknown) {
    super();

    this.dependency = dependency;
  }

  load() {
    return {};
  }
}

class PageStateManagerMock extends PageStateManager {}

class PageManagerMock extends AbstractPageManager {}

describe('ima.core.page.manager.AbstractPageManager', () => {
  let pageFactory: PageFactory;
  let pageRenderer: PageRenderer;
  let pageStateManager: PageStateManager;
  let pageManager: AbstractPageManager;
  let handlerRegistry: PageHandlerRegistry;
  let routeFactory: RouteFactory;
  let dispatcher: DispatcherImpl;
  let extensionMock: AbstractExtension;
  let controllerMock: AbstractController;
  let route: StaticRoute | DynamicRoute;
  let options: RouteOptions;

  const View = () => undefined;
  const routeName = 'link';
  const routePath = '/link';
  const routeParams = {
    param1: 'param1',
    param2: 2,
  };

  async function runManage(manageParams?: ManageArgs) {
    await pageManager.manage(
      manageParams ?? {
        route,
        options,
        params: routeParams,
      }
    );

    // Resolve page promise in timeout
    jest.runOnlyPendingTimers();
  }

  beforeEach(() => {
    jest.useFakeTimers();
    controllerMock = new ControllerMock([]);
    extensionMock = new ExtensionMock();
    pageRenderer = toMockedInstance(PageRenderer, {
      mount: jest.fn().mockResolvedValue('mounted'),
    });
    pageStateManager = new PageStateManagerMock();
    handlerRegistry = new PageHandlerRegistry(
      toMockedInstance(PageNavigationHandler)
    );
    routeFactory = new RouteFactory();
    dispatcher = toMockedInstance(DispatcherImpl, {
      fire: jest.fn(),
    });
    pageFactory = toMockedInstance(PageFactory, {
      createController: jest.fn().mockReturnValue(controllerMock),
      decorateController: (controller: IController) => controller,
      decoratePageStateManager: (pageStateManger: PageStateManager) =>
        pageStateManger,
      createView: (view: unknown) => view,
    });

    // Mock extensions getter
    jest
      .spyOn(controllerMock, 'getExtensions')
      .mockReturnValue([extensionMock]);

    pageManager = new PageManagerMock(
      pageFactory as unknown as PageFactory,
      pageRenderer,
      pageStateManager,
      handlerRegistry,
      dispatcher
    );

    // Route & options
    route = routeFactory.createRoute(
      routeName,
      routePath,
      AbstractController,
      View
    );
    options = {
      autoScroll: true,
      documentView: null,
      managedRootView: null,
      onlyUpdate: false,
      viewAdapter: null,
      middlewares: [],
    };

    // Init page
    pageManager.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('init()', () => {
    it('should init page handlers', () => {
      jest.spyOn(handlerRegistry, 'init');

      pageManager.init();

      expect(handlerRegistry.init).toHaveBeenCalled();
    });

    it('should clear managed pages', () => {
      const initialState = pageManager['_getInitialManagedPage']();

      expect(JSON.stringify(pageManager['_managedPage'])).toBe(
        JSON.stringify(initialState)
      );
      expect(JSON.stringify(pageManager['_previousManagedPage'])).toBe(
        JSON.stringify(initialState)
      );
    });
  });

  describe('preManage()', () => {
    it('should resolve in initial state', async () => {
      await expect(pageManager.preManage()).resolves.not.toThrow();
    });
  });

  describe('manage()', () => {
    it('should only update last managed controller and view', async () => {
      pageManager['_managedPage'].state.mounted = true;
      jest
        .spyOn(pageManager, '_hasOnlyUpdate' as never)
        .mockReturnValue(true as never);
      jest
        .spyOn(pageManager, '_runPreManageHandlers' as never)
        .mockReturnValue(Promise.resolve() as never);
      jest
        .spyOn(pageManager, '_runPostManageHandlers' as never)
        .mockReturnValue(Promise.resolve() as never);
      jest
        .spyOn(pageManager, '_updatePageSource' as never)
        .mockReturnValue(Promise.resolve() as never);

      await pageManager.manage({
        route,
        options,
        action: {},
      });

      expect(pageManager['_runPreManageHandlers']).toHaveBeenCalled();
      expect(pageManager['_updatePageSource']).toHaveBeenCalled();
      expect(pageManager['_runPostManageHandlers']).toHaveBeenCalled();
    });

    it('should mount new controller and view', async () => {
      jest
        .spyOn(pageManager, '_hasOnlyUpdate' as never)
        .mockReturnValue(false as never);
      jest.spyOn(pageManager, '_getInitialManagedPage' as never);
      jest
        .spyOn(pageManager, '_runPreManageHandlers' as never)
        .mockReturnValue(Promise.resolve() as never);
      jest
        .spyOn(pageManager, '_runPostManageHandlers' as never)
        .mockReturnValue(Promise.resolve() as never);
      jest
        .spyOn(pageManager, '_deactivatePageSource' as never)
        .mockImplementation();
      jest
        .spyOn(pageManager, '_destroyPageSource' as never)
        .mockImplementation();
      jest.spyOn(pageStateManager, 'clear').mockImplementation();
      jest.spyOn(pageManager, '_clearComponentState').mockImplementation();
      jest.spyOn(pageManager, '_constructManagedPageValue' as never);
      jest.spyOn(pageManager, '_initPageSource' as never).mockImplementation();
      jest
        .spyOn(pageManager, '_loadPageSource' as never)
        .mockReturnValue(Promise.resolve() as never);

      jest.useFakeTimers();

      await pageManager.manage({
        route,
        options,
        action: {},
      });

      jest.advanceTimersByTime(1000);

      expect(pageManager['_runPreManageHandlers']).toHaveBeenCalled();
      expect(pageManager['_deactivatePageSource']).toHaveBeenCalled();
      expect(pageManager['_destroyPageSource']).toHaveBeenCalled();
      expect(pageStateManager.clear).toHaveBeenCalled();
      expect(pageManager._clearComponentState).toHaveBeenCalledWith(options);
      expect(pageManager['_getInitialManagedPage']).toHaveBeenCalled();
      expect(pageManager['_constructManagedPageValue']).toHaveBeenCalled();
      expect(pageManager['_initPageSource']).toHaveBeenCalled();
      expect(pageManager['_loadPageSource']).toHaveBeenCalled();
      expect(pageManager['_runPostManageHandlers']).toHaveBeenCalled();
    });

    it('should cancel loading of async handlers', async () => {
      const oldPagePromise = pageManager.manage({
        route: routeFactory.createRoute(
          routeName,
          routePath,
          async () => wait(AbstractController),
          View
        ),
        options,
      });

      const preManageOld = pageManager.preManage();
      const oldResponse = await oldPagePromise;

      pageManager.postManage();
      jest.runOnlyPendingTimers();
      await preManageOld;

      expect(pageManager['_managedPage']).toMatchInlineSnapshot(`
        {
          "controller": undefined,
          "controllerInstance": undefined,
          "decoratedController": undefined,
          "options": undefined,
          "params": undefined,
          "route": undefined,
          "state": {
            "abort": {
              "promise": Promise {},
              "reject": [Function],
              "resolve": [Function],
            },
            "activated": false,
            "cancelled": true,
            "executed": false,
            "initialized": false,
            "mounted": false,
            "page": {
              "promise": Promise {},
              "reject": [Function],
              "resolve": [Function],
            },
          },
          "view": undefined,
          "viewInstance": undefined,
        }
      `);
      // @ts-expect-error
      expect(pageManager['_previouslyManagedPage']).toMatchInlineSnapshot(
        `undefined`
      );
      expect(oldResponse).toStrictEqual({ status: 409 });
    });

    it('should fire router events for async route handlers', async () => {
      const pagePromise = pageManager.manage({
        route: routeFactory.createRoute(
          routeName,
          routePath,
          async () => wait(controllerMock),
          View
        ),
        options,
      });

      jest.advanceTimersByTime(10000);
      const response = await pagePromise;
      pageManager.postManage();
      jest.runOnlyPendingTimers();

      expect(dispatcher.fire).toHaveBeenNthCalledWith(
        1,
        RouterEvents.BEFORE_LOADING_ASYNC_ROUTE,
        expect.objectContaining({ route: expect.anything() }),
        true
      );
      expect(dispatcher.fire).toHaveBeenNthCalledWith(
        2,
        RouterEvents.AFTER_LOADING_ASYNC_ROUTE,
        expect.objectContaining({ route: expect.anything() }),
        true
      );

      expect(response).toBe('mounted');
      await expect(
        pageManager['_managedPage'].state.page.promise
      ).resolves.not.toThrow();
    });

    it('should handle only update properly', async () => {
      const oldResponse = await pageManager.manage({
        route,
        options,
      });

      // Resolve page promise in timeout
      jest.runOnlyPendingTimers();

      // @ts-expect-error
      jest.spyOn(pageManager, '_hasOnlyUpdate').mockReturnValue(true);
      const updatedResponse = await pageManager.manage({
        route,
        options,
      });

      // Resolve page promise in timeout
      pageManager.postManage();
      jest.runOnlyPendingTimers();

      await expect(
        pageManager['_managedPage'].state.page.promise
      ).resolves.not.toThrow();
      expect(oldResponse).toBe('mounted');
      expect(updatedResponse).toBeUndefined();
      expect(pageFactory.createController).toHaveBeenCalledTimes(1);
    });

    it('should clear previously managed page after successful handling', async () => {
      await pageManager.manage({
        route,
        options,
      });

      // Resolve page promise in timeout
      jest.runOnlyPendingTimers();

      expect(JSON.stringify(pageManager['_previousManagedPage'])).toBe(
        JSON.stringify(pageManager['_getInitialManagedPage']())
      );
    });

    it('should properly destroy previous route when canceled', async () => {
      await pageManager.manage({
        route,
        options,
      });

      pageManager.postManage();

      // Resolve page promise in timeout
      jest.runOnlyPendingTimers();
      await pageManager.preManage();
      jest.runOnlyPendingTimers();

      class StuckController extends ControllerMock {
        async init() {
          return wait(10, 100);
        }
      }

      jest
        .spyOn(pageFactory, 'createController')
        .mockReturnValue(new StuckController([]));

      const oldPagePromise = pageManager.manage({
        route,
        options,
      });

      // Resolve page promise in timeout
      jest.advanceTimersByTime(50);

      const preManageOld = pageManager.preManage();
      const oldResponse = await oldPagePromise;

      expect(pageManager['_previousManagedPage'].state.cancelled).toBeTruthy();

      pageManager.postManage();

      // Resolve page promise in timeout
      jest.runOnlyPendingTimers();
      await preManageOld;
      jest.runOnlyPendingTimers();

      jest
        .spyOn(pageFactory, 'createController')
        .mockReturnValue(new ControllerMock([]));

      const newPagePromise = pageManager.manage({
        route: routeFactory.createRoute(
          'newRoute',
          '/new-route',
          AbstractController,
          View
        ),
        options,
      });

      // Resolve page promise in timeout
      const newPageResponse = await newPagePromise;
      pageManager.postManage();
      jest.runOnlyPendingTimers();

      await expect(
        pageManager['_managedPage'].state.page.promise
      ).resolves.not.toThrow();
      expect(oldResponse).toStrictEqual({ status: 409 });
      expect(newPageResponse).toBe('mounted');
    });
  });

  describe('destroy()()', () => {
    it('should clear managed page value', async () => {
      jest.spyOn(pageManager, '_getInitialManagedPage' as never);

      await pageManager.destroy();

      expect(pageManager['_getInitialManagedPage']).toHaveBeenCalled();
    });

    it('should remove listener for onChange event from page state manager', async () => {
      await pageManager.destroy();

      expect(pageStateManager.onChange).toBeUndefined();
    });

    it('should deactivate page source', async () => {
      jest
        .spyOn(pageManager, '_deactivatePageSource' as never)
        .mockImplementation();

      await pageManager.destroy();

      expect(pageManager['_deactivatePageSource']).toHaveBeenCalled();
    });

    it('should destroy page source', async () => {
      jest
        .spyOn(pageManager, '_destroyPageSource' as never)
        .mockImplementation();

      await pageManager.destroy();

      expect(pageManager['_destroyPageSource']).toHaveBeenCalled();
    });

    it('should clear page state manager', async () => {
      jest.spyOn(pageStateManager, 'clear').mockImplementation();

      await pageManager.destroy();

      expect(pageStateManager.clear).toHaveBeenCalled();
    });
  });

  describe('_initPageSource()', () => {
    it('should initialize page source', async () => {
      jest.spyOn(pageManager, '_initController' as never).mockImplementation();
      jest.spyOn(pageManager, '_initExtensions' as never).mockImplementation();

      await pageManager['_initPageSource']();

      expect(pageManager['_initController']).toHaveBeenCalledWith();
      expect(pageManager['_initExtensions']).toHaveBeenCalledWith();
    });
  });

  describe('_initController()', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should set route params to controller instance', async () => {
      jest.spyOn(controllerMock, 'setRouteParams').mockImplementation();

      await pageManager['_initController']();

      expect(controllerMock.setRouteParams).toHaveBeenCalledWith(routeParams);
    });

    it('should call init function on controller instance', async () => {
      jest.spyOn(controllerMock, 'init').mockImplementation();

      await pageManager['_initController']();

      expect(controllerMock.init).toHaveBeenCalled();
    });
  });

  describe('_initExtensions()', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should set route params to extension instance', async () => {
      jest.spyOn(extensionMock, 'setRouteParams').mockImplementation();

      await pageManager['_initExtensions']();

      expect(extensionMock.setRouteParams).toHaveBeenCalledWith(routeParams);
    });

    it('should call init function on controller instance', async () => {
      jest.spyOn(extensionMock, 'init').mockImplementation();

      await pageManager['_initExtensions']();

      expect(extensionMock.init).toHaveBeenCalled();
    });
  });

  describe('_activatePageSource()', () => {
    beforeEach(async () => {
      // @ts-expect-error
      jest.spyOn(pageManager, '_activateController').mockImplementation();
      // @ts-expect-error
      jest.spyOn(pageManager, '_activateExtensions').mockImplementation();

      await runManage();
    });

    it('should activate controller and extensions', async () => {
      await pageManager['_activatePageSource']();

      expect(pageManager['_activateController']).toHaveBeenCalled();
      expect(pageManager['_activateExtensions']).toHaveBeenCalled();
      expect(pageManager['_managedPage'].state.activated).toBeTruthy();
    });

    it('should not call method activate more times', async () => {
      pageManager['_managedPage'].state.activated = true;

      await pageManager['_activatePageSource']();

      expect(pageManager['_activateController']).not.toHaveBeenCalled();
      expect(pageManager['_activateExtensions']).not.toHaveBeenCalled();
    });
  });

  describe('_clearComponentState()', () => {
    it('should call page renderer unmount method if route options documentView and managedRootView are not same with last one rendered', () => {
      jest.spyOn(pageRenderer, 'unmount').mockImplementation();

      pageManager._clearComponentState({} as RouteOptions);

      expect(pageRenderer.unmount).toHaveBeenCalled();
    });
  });

  describe('_hasOnlyUpdate()', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should return value from onlyUpdate function', () => {
      const newOptions: RouteOptions = {
        ...options,
        onlyUpdate: jest.fn().mockReturnValue(true),
      };

      // @ts-expect-error
      const spy = jest.spyOn(newOptions, 'onlyUpdate');
      const mockSpyWrapper = (...args: unknown[]) => {
        // @ts-expect-error
        return spy(...args);
      };
      newOptions.onlyUpdate = mockSpyWrapper;

      expect(
        pageManager['_hasOnlyUpdate'](AbstractController, View, newOptions)
      ).toBeTruthy();
      expect(spy).toHaveBeenCalledWith(AbstractController, View);
    });

    it('should return true for option onlyUpdate set to true and for same controller and view', () => {
      expect(
        pageManager['_hasOnlyUpdate'](AbstractController, View, {
          ...options,
          onlyUpdate: true,
        })
      ).toBeTruthy();
    });

    it('should return false for option onlyUpdate set to true and for different controller and view', () => {
      pageManager['_managedPage'].controller = undefined;

      expect(
        pageManager['_hasOnlyUpdate'](Controller, View, {
          ...options,
          onlyUpdate: true,
        })
      ).toBeFalsy();
    });
  });

  describe('_destroyExtensions()', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should call destroy on extension instance', async () => {
      jest.spyOn(extensionMock, 'destroy').mockImplementation();

      await runManage();

      expect(extensionMock.destroy).toHaveBeenCalled();
    });

    it('should unset pageStateManager to extension', async () => {
      jest.spyOn(extensionMock, 'setPageStateManager').mockImplementation();

      await runManage();

      expect(extensionMock.setPageStateManager).toHaveBeenCalledWith();
    });
  });

  describe('_destroyPageSource()', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should destroy page resource', async () => {
      // @ts-expect-error
      jest.spyOn(pageManager, '_destroyController').mockImplementation();
      // @ts-expect-error
      jest.spyOn(pageManager, '_destroyExtensions').mockImplementation();

      await runManage();

      expect(pageManager['_destroyController']).toHaveBeenCalledWith();
      expect(pageManager['_destroyExtensions']).toHaveBeenCalledWith();
    });
  });

  describe('_deactivateController()', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should call deactivate method on controller', async () => {
      jest.spyOn(controllerMock, 'deactivate').mockImplementation();
      pageManager['_managedPage'].state.activated = true;

      await runManage();

      expect(controllerMock.deactivate).toHaveBeenCalled();
    });
  });

  describe('_getUpdatedExtensionsState()', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should call extensions update method', async () => {
      jest.spyOn(extensionMock, 'getRouteParams').mockReturnValue(routeParams);
      jest.spyOn(extensionMock, 'update').mockReturnValue({ state: 'state' });

      await pageManager['_getUpdatedExtensionsState']();

      expect(extensionMock.update).toHaveBeenCalledWith(routeParams);
    });

    it('should set restricted pageStateManager to extension instance', async () => {
      jest
        .spyOn(pageManager, '_setRestrictedPageStateManager')
        .mockImplementation();
      jest.spyOn(extensionMock, 'update').mockReturnValue({ state: 'state' });

      await pageManager['_getUpdatedExtensionsState']();

      expect(pageManager._setRestrictedPageStateManager).toHaveBeenCalledWith(
        extensionMock,
        { state: 'state' }
      );
    });

    it("should call extension's setPartialState method and switch extension to partial state", async () => {
      jest.spyOn(extensionMock, 'setPartialState').mockImplementation();
      jest.spyOn(extensionMock, 'switchToPartialState').mockImplementation();
      jest.spyOn(extensionMock, 'update').mockReturnValue({ state: 'state' });
      jest.spyOn(pageStateManager, 'getState').mockReturnValue({ foo: 'bar' });

      await pageManager['_getUpdatedExtensionsState']({ foobar: 'bazfoo' });

      expect(extensionMock.setPartialState).toHaveBeenCalledWith(
        expect.objectContaining({
          foo: 'bar',
          foobar: 'bazfoo',
        })
      );
      expect(extensionMock.switchToPartialState).toHaveBeenCalled();
    });

    it('should return extensions state together with active controller state', async () => {
      jest
        .spyOn(pageManager, '_setRestrictedPageStateManager')
        .mockImplementation();
      jest
        .spyOn(extensionMock, 'update')
        .mockReturnValue({ extension: 'state' });

      const result = await pageManager['_getUpdatedExtensionsState']({
        controller: 'state',
      });

      expect(result).toStrictEqual({ controller: 'state', extension: 'state' });
    });

    it('should switch extensions to PageStateManager after all resources are updated', async () => {
      jest
        .spyOn(pageManager, '_switchToPageStateManagerAfterLoaded')
        .mockImplementation();

      await pageManager['_getLoadedExtensionsState']();

      expect(
        pageManager._switchToPageStateManagerAfterLoaded
      ).toHaveBeenCalled();
    });
  });

  describe('_deactivatePageSource()', () => {
    beforeEach(async () => {
      await runManage();

      // @ts-expect-error
      jest.spyOn(pageManager, '_deactivateController').mockImplementation();
      // @ts-expect-error
      jest.spyOn(pageManager, '_deactivateExtensions').mockImplementation();
    });

    it('should activate controller and extensions', async () => {
      pageManager['_managedPage'].state.activated = true;

      await runManage();

      expect(pageManager['_deactivateController']).toHaveBeenCalled();
      expect(pageManager['_deactivateExtensions']).toHaveBeenCalled();
    });

    it('should not call method activate more times', async () => {
      await runManage();

      expect(pageManager['_deactivateController']).not.toHaveBeenCalled();
      expect(pageManager['_deactivateExtensions']).not.toHaveBeenCalled();
    });
  });

  describe('_deactivateExtensions()', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should call deactivate method on extensions', async () => {
      jest.spyOn(extensionMock, 'deactivate').mockImplementation();
      pageManager['_managedPage'].state.activated = true;

      await runManage();

      expect(extensionMock.deactivate).toHaveBeenCalled();
    });
  });

  describe('_getUpdatedControllerState()', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should calls controller update method', () => {
      jest.spyOn(controllerMock, 'update').mockImplementation();
      jest.spyOn(controllerMock, 'getRouteParams').mockReturnValue(routeParams);

      pageManager['_getUpdatedControllerState']();

      expect(controllerMock.update).toHaveBeenCalledWith(routeParams);
    });
  });

  describe('_updatePageSource()', () => {
    beforeEach(async () => {
      jest
        // @ts-expect-error
        .spyOn(pageManager, '_getUpdatedControllerState')
        // @ts-expect-error
        .mockReturnValue({ controller: 'state' });

      jest
        // @ts-expect-error
        .spyOn(pageManager, '_getUpdatedExtensionsState')
        // @ts-expect-error
        .mockReturnValue({ extension: 'state' });

      jest.spyOn(pageRenderer, 'update').mockReturnValue(Promise.resolve());

      await runManage();
    });

    it('should merge state from controller and extensions to updated page state', async () => {
      pageManager['_storeManagedPageSnapshot']();
      await pageManager['_updatePageSource']();

      expect(pageRenderer.update).toHaveBeenCalledWith(
        pageFactory.decorateController(controllerMock),
        View,
        {
          controller: 'state',
          extension: 'state',
        },
        options
      );
    });
  });

  describe('_activateController()', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should call activate method on controller', async () => {
      jest.spyOn(controllerMock, 'activate').mockImplementation();

      await pageManager['_activateController']();

      expect(controllerMock.activate).toHaveBeenCalled();
    });
  });

  describe('_activateExtensions()', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should call activate method on extensions', async () => {
      jest.spyOn(extensionMock, 'activate').mockImplementation();

      await pageManager['_activateExtensions']();

      expect(extensionMock.activate).toHaveBeenCalled();
    });
  });

  describe('_switchToPageStateManagerAfterLoaded method', () => {
    let deferredPromise: Promise<unknown>;
    let resolver: (value?: unknown) => void;

    beforeEach(() => {
      deferredPromise = new Promise(resolve => {
        resolver = resolve;
      });
    });

    it('should switch to state manager and clear partial state if resources are loaded successfully', async () => {
      jest.spyOn(extensionMock, 'switchToStateManager').mockImplementation();
      jest.spyOn(extensionMock, 'clearPartialState').mockImplementation(() => {
        resolver();
      });

      pageManager._switchToPageStateManagerAfterLoaded(extensionMock, {
        extension: Promise.resolve(),
      });
      await deferredPromise;

      expect(extensionMock.switchToStateManager).toHaveBeenCalled();
      expect(extensionMock.clearPartialState).toHaveBeenCalled();
    });

    it('should clear partial state if resource is not loaded successfully', async () => {
      jest.spyOn(extensionMock, 'clearPartialState').mockImplementation(() => {
        resolver();
      });

      pageManager._switchToPageStateManagerAfterLoaded(extensionMock, {
        extension: Promise.reject(),
      });
      await deferredPromise;

      expect(extensionMock.clearPartialState).toHaveBeenCalled();
    });
  });

  describe('_getLoadedExtensionsState()', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should call extensions load method', async () => {
      jest.spyOn(extensionMock, 'load').mockReturnValue({});

      await pageManager['_getLoadedExtensionsState']();

      expect(extensionMock.load).toHaveBeenCalled();
    });

    it('should set restricted pageStateManager to extension instance', async () => {
      jest.spyOn(extensionMock, 'load').mockReturnValue({});
      jest
        .spyOn(pageManager, '_setRestrictedPageStateManager')
        .mockImplementation();

      await pageManager['_getLoadedExtensionsState']();

      expect(pageManager._setRestrictedPageStateManager).toHaveBeenCalledWith(
        extensionMock,
        {}
      );
    });

    it("should call extension's setPartialState method and switch extension to partial state", async () => {
      jest.spyOn(extensionMock, 'setPartialState').mockImplementation();
      jest.spyOn(extensionMock, 'switchToPartialState').mockImplementation();
      jest.spyOn(extensionMock, 'load').mockReturnValue({});

      await pageManager['_getLoadedExtensionsState']();

      expect(extensionMock.setPartialState).toHaveBeenCalled();
      expect(extensionMock.switchToPartialState).toHaveBeenCalled();
    });

    it('should return extensions state together with active controller state', async () => {
      jest.spyOn(extensionMock, 'load');
      jest
        .spyOn(pageManager, '_setRestrictedPageStateManager')
        .mockImplementation();

      const result = await pageManager['_getLoadedExtensionsState']({
        controller: 'state',
      });

      expect(result).toStrictEqual({
        controller: 'state',
      });
    });

    it('should switch extensions to PageStateManager after all resources are loaded', async () => {
      jest
        .spyOn(pageManager, '_switchToPageStateManagerAfterLoaded')
        .mockImplementation();

      await pageManager['_getLoadedExtensionsState']();

      expect(
        pageManager._switchToPageStateManagerAfterLoaded
      ).toHaveBeenCalled();
    });
  });

  describe('_getLoadedControllerState method', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should calls controller load method', async () => {
      jest.spyOn(controllerMock, 'load').mockImplementation();

      await pageManager['_getLoadedControllerState']();

      expect(controllerMock.load).toHaveBeenCalled();
    });

    it('should set pageStateManager to controller instance', async () => {
      jest.spyOn(controllerMock, 'setPageStateManager').mockImplementation();

      await pageManager['_getLoadedControllerState']();

      expect(controllerMock.setPageStateManager).toHaveBeenCalledWith(
        pageStateManager
      );
    });
  });

  describe('_initExtensions method', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should set route params to extension instance', async () => {
      jest.spyOn(extensionMock, 'setRouteParams').mockImplementation();

      await pageManager['_initExtensions']();

      expect(extensionMock.setRouteParams).toHaveBeenCalledWith(routeParams);
    });

    it('should call init function on controller instance', async () => {
      jest.spyOn(extensionMock, 'init').mockImplementation();

      await pageManager['_initExtensions']();

      expect(extensionMock.init).toHaveBeenCalled();
    });
  });

  describe('_loadPageSource method', () => {
    beforeEach(async () => {
      jest
        // @ts-expect-error
        .spyOn(pageManager, '_getLoadedControllerState')
        // @ts-expect-error
        .mockReturnValue({ controller: 'state' });

      jest
        // @ts-expect-error
        .spyOn(pageManager, '_getLoadedExtensionsState')
        // @ts-expect-error
        .mockReturnValue({ extension: 'state' });
      jest.spyOn(pageRenderer, 'mount').mockReturnValue(Promise.resolve());

      await runManage();
    });

    it('should be merge state from controller and extensions to loaded page state', async () => {
      await pageManager['_loadPageSource']();

      expect(pageRenderer.mount).toHaveBeenCalledWith(
        pageFactory.decorateController(controllerMock),
        View,
        { controller: 'state', extension: 'state' },
        options
      );
    });
  });

  describe('_destroyController()', () => {
    beforeEach(async () => {
      await runManage();
    });

    it('should call destroy on controller instance', async () => {
      jest.spyOn(controllerMock, 'destroy').mockImplementation();

      await runManage();

      expect(controllerMock.destroy).toHaveBeenCalled();
    });

    it('should unset pageStateManager to controller', async () => {
      jest.spyOn(controllerMock, 'setPageStateManager').mockImplementation();

      await runManage();

      expect(controllerMock.setPageStateManager).toHaveBeenCalledWith();
    });
  });

  describe('_setRestrictedPageStateManager()', () => {
    const allowedStateKeys = ['user'];
    const allAllowedStateKeys = Object.keys({ extension: 'state' }).concat(
      allowedStateKeys
    );

    beforeEach(async () => {
      jest
        .spyOn(extensionMock, 'getAllowedStateKeys')
        .mockReturnValue(allowedStateKeys);

      jest
        .spyOn(pageFactory, 'decoratePageStateManager')
        // @ts-expect-error
        .mockReturnValue(pageStateManager);

      (
        jest.spyOn(extensionMock, 'setPageStateManager') as jest.SpyInstance
      ).mockImplementation();

      await runManage();
    });

    it('should create restricted page state manager for extension', () => {
      pageManager._setRestrictedPageStateManager(extensionMock, {
        extension: 'state',
      });

      expect(pageFactory.decoratePageStateManager).toHaveBeenCalledWith(
        pageStateManager,
        allAllowedStateKeys
      );
    });

    it('should set restricted page state manager to extension', () => {
      pageManager._setRestrictedPageStateManager(extensionMock, {
        extension: 'state',
      });

      expect(extensionMock.setPageStateManager).toHaveBeenCalledWith(
        pageStateManager
      );
    });
  });
});
