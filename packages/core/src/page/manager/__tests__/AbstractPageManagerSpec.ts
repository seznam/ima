/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jest/no-conditional-expect */

import { toMockedInstance } from 'to-mock';

import { ControllerDecorator } from '../../..//controller/ControllerDecorator';
import { AbstractController } from '../../../controller/AbstractController';
import { Controller, IController } from '../../../controller/Controller';
import { Extension } from '../../../extension/Extension';
import { PageHandlerRegistry } from '../../../page/handler/PageHandlerRegistry';
import { PageNavigationHandler } from '../../../page/handler/PageNavigationHandler';
import { PageFactory } from '../../../page/PageFactory';
import { PageRenderer } from '../../../page/renderer/PageRenderer';
import { PageStateManager } from '../../../page/state/PageStateManager';
import { DynamicRoute } from '../../../router/DynamicRoute';
import { RouteFactory } from '../../../router/RouteFactory';
import { RouteOptions } from '../../../router/Router';
import { StaticRoute } from '../../../router/StaticRoute';
import { UnknownParameters } from '../../../types';
import { AbstractPageManager } from '../AbstractPageManager';

class AbstractControllerTest extends AbstractController {
  dependency: unknown;

  static get $dependencies() {
    return [];
  }

  constructor(dependency: unknown) {
    super();

    this.dependency = dependency;
  }
}

class PageRendererMock extends PageRenderer {}

class PageStateManagerMock extends PageStateManager {}

class PageManagerMock extends AbstractPageManager {}

describe('ima.core.page.manager.AbstractPageManager', () => {
  const controllerState = {
    controller: 'controller',
    share: 'controller',
  };
  const extensionsState = {
    extension: 'extension',
    share: 'extension',
  };
  const extensionState = {
    extension: Promise.resolve('extension'),
  };

  class ExtensionTest extends Extension {}

  const pageState = Object.assign({}, extensionsState, controllerState);

  const pageFactory = {
    createController: () => new AbstractControllerTest(null),
    decorateController: (controller: IController) => controller,
    decoratePageStateManager: (pageStateManger: PageStateManager) =>
      pageStateManger,
    createView: (view: unknown) => view,
  };
  let pageRenderer: PageRenderer;
  let pageStateManager: PageStateManager;
  let pageManager: AbstractPageManager;
  let handlerRegistry: PageHandlerRegistry;
  let routeFactory: RouteFactory;

  const View = () => {
    return;
  };

  const routeName = 'link';
  const routePath = '/link';
  let route: StaticRoute | DynamicRoute;

  let options: RouteOptions;
  const params = {
    param1: 'param1',
    param2: 2,
  };

  const controllerInstance = pageFactory.createController();
  const decoratedController =
    pageFactory.decorateController(controllerInstance);
  const viewInstance = pageFactory.createView(View);
  const extensionInstance = new ExtensionTest();

  const pageManagerHandler = toMockedInstance(PageNavigationHandler);

  beforeEach(() => {
    pageRenderer = new PageRendererMock();
    pageStateManager = new PageStateManagerMock();
    handlerRegistry = new PageHandlerRegistry(pageManagerHandler);
    routeFactory = new RouteFactory();

    pageManager = new PageManagerMock(
      pageFactory as unknown as PageFactory,
      pageRenderer,
      pageStateManager,
      handlerRegistry
    );

    options = {
      autoScroll: true,
      documentView: null,
      managedRootView: null,
      onlyUpdate: false,
      viewAdapter: null,
      middlewares: [],
    };

    (
      jest.spyOn(controllerInstance, 'getExtensions') as jest.SpyInstance
    ).mockReturnValue([extensionInstance]);

    route = routeFactory.createRoute(
      routeName,
      routePath,
      Controller,
      View,
      options
    );

    pageManager['_managedPage'] = pageManager['_constructManagedPageValue'](
      Controller,
      View,
      route,
      options,
      params,
      controllerInstance,
      decoratedController as ControllerDecorator,
      viewInstance
    );
  });

  afterEach(() => {
    pageManager['_getClearManagedPage']();
    jest.clearAllMocks();
  });

  describe('manage method', () => {
    it('should only update last managed controller and view', async () => {
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

      await pageManager
        .manage({
          route,
          controller: Controller,
          view: View,
          options,
          params,
          action: {},
        })
        .then(() => {
          expect(pageManager['_runPreManageHandlers']).toHaveBeenCalled();
          expect(pageManager['_managedPage'].params).toStrictEqual(params);
          expect(pageManager['_updatePageSource']).toHaveBeenCalled();
          expect(pageManager['_runPostManageHandlers']).toHaveBeenCalled();
        })
        .catch(error => {
          console.error('ima.core.page.manager:manage', error.message);
        });
    });

    it('should mount new controller and view', async () => {
      jest
        .spyOn(pageManager, '_hasOnlyUpdate' as never)
        .mockReturnValue(false as never);
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
      jest
        .spyOn(pageManager, '_clearManagedPageValue' as never)
        .mockImplementation();
      jest
        .spyOn(pageManager, '_constructManagedPageValue' as never)
        .mockImplementation();
      jest.spyOn(pageManager, '_initPageSource' as never).mockImplementation();
      jest
        .spyOn(pageManager, '_loadPageSource' as never)
        .mockReturnValue(Promise.resolve() as never);

      await pageManager
        .manage({
          route,
          controller: Controller,
          view: View,
          options,
          params,
          action: {},
        })
        .then(() => {
          expect(pageManager['_runPreManageHandlers']).toHaveBeenCalled();
          expect(pageManager['_deactivatePageSource']).toHaveBeenCalled();
          expect(pageManager['_destroyPageSource']).toHaveBeenCalled();
          expect(pageStateManager.clear).toHaveBeenCalled();
          expect(pageManager._clearComponentState).toHaveBeenCalledWith(
            options
          );
          expect(pageManager['_getClearManagedPage']).toHaveBeenCalled();
          expect(pageManager['_constructManagedPageValue']).toHaveBeenCalled();
          expect(pageManager['_initPageSource']).toHaveBeenCalled();
          expect(pageManager['_loadPageSource']).toHaveBeenCalled();
          expect(pageManager['_runPostManageHandlers']).toHaveBeenCalled();
        })
        .catch(error => {
          console.error('ima.core.page.manager:manage', error.message);
        });
    });
  });

  describe('destroy method', () => {
    it('should clear managed page value', async () => {
      jest
        .spyOn(pageManager, '_clearManagedPageValue' as never)
        .mockImplementation();

      await pageManager.destroy();

      expect(pageManager['_getClearManagedPage']).toHaveBeenCalled();
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

  describe('_setRestrictedPageStateManager', () => {
    const allowedStateKeys = ['user'];
    const allAllowedStateKeys =
      Object.keys(extensionState).concat(allowedStateKeys);

    beforeEach(() => {
      (
        jest.spyOn(extensionInstance, 'getAllowedStateKeys') as jest.SpyInstance
      ).mockReturnValue(allowedStateKeys);

      jest
        .spyOn(pageFactory, 'decoratePageStateManager')
        .mockReturnValue(pageStateManager);

      (
        jest.spyOn(extensionInstance, 'setPageStateManager') as jest.SpyInstance
      ).mockImplementation();
    });

    it('should create restricted page state manager for extension', () => {
      pageManager._setRestrictedPageStateManager(
        extensionInstance,
        extensionState
      );

      expect(pageFactory.decoratePageStateManager).toHaveBeenCalledWith(
        pageStateManager,
        allAllowedStateKeys
      );
    });

    it('should set restricted page state manager to extension', () => {
      pageManager._setRestrictedPageStateManager(
        extensionInstance,
        extensionState
      );

      expect(extensionInstance.setPageStateManager).toHaveBeenCalledWith(
        pageStateManager
      );
    });
  });

  describe('_initPageSource method', () => {
    it('should initialize page source', async () => {
      jest.spyOn(pageManager, '_initController' as never).mockImplementation();
      jest.spyOn(pageManager, '_initExtensions' as never).mockImplementation();

      await pageManager['_initPageSource']();

      expect(pageManager['_initController']).toHaveBeenCalledWith();
      expect(pageManager['_initExtensions']).toHaveBeenCalledWith();
    });
  });

  describe('_initController method', () => {
    it('should set route params to controller instance', async () => {
      (
        jest.spyOn(controllerInstance, 'setRouteParams') as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_initController']();

      expect(controllerInstance.setRouteParams).toHaveBeenCalledWith(params);
    });

    it('should call init function on controller instance', async () => {
      (
        jest.spyOn(controllerInstance, 'init') as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_initController']();

      expect(controllerInstance.init).toHaveBeenCalled();
    });
  });

  describe('_initExtensions method', () => {
    it('should set route params to extension instance', async () => {
      (
        jest.spyOn(extensionInstance, 'setRouteParams') as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_initExtensions']();

      expect(extensionInstance.setRouteParams).toHaveBeenCalledWith(params);
    });

    it('should call init function on controller instance', async () => {
      (
        jest.spyOn(extensionInstance, 'init') as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_initExtensions']();

      expect(extensionInstance.init).toHaveBeenCalled();
    });
  });

  describe('_loadPageSource method', () => {
    beforeEach(() => {
      jest
        .spyOn(pageManager, '_getLoadedControllerState' as never)
        .mockReturnValue(controllerState as never);

      jest
        .spyOn(pageManager, '_getLoadedExtensionsState' as never)
        .mockReturnValue(extensionsState as never);
      jest
        .spyOn(pageRenderer, 'mount')
        .mockReturnValue(Promise.resolve() as never);
    });

    it('should be merge state from controller and extensions to loaded page state', async () => {
      await pageManager['_loadPageSource']()
        .then(() => {
          expect(pageRenderer.mount).toHaveBeenCalledWith(
            decoratedController,
            View,
            pageState,
            options
          );
        })
        .catch(error => {
          console.error('ima.core.page.manager:_loadPageSource', error.message);
        });
    });
  });

  describe('_getLoadedControllerState method', () => {
    it('should calls controller load method', async () => {
      (
        jest.spyOn(controllerInstance, 'load') as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_getLoadedControllerState']();

      expect(controllerInstance.load).toHaveBeenCalled();
    });

    it('should set pageStateManager to controller instance', async () => {
      (
        jest.spyOn(
          controllerInstance,
          'setPageStateManager'
        ) as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_getLoadedControllerState']();

      expect(controllerInstance.setPageStateManager).toHaveBeenCalledWith(
        pageStateManager
      );
    });
  });

  describe('_getLoadedExtensionsState method', () => {
    it('should call extensions load method', async () => {
      (
        jest.spyOn(extensionInstance, 'load') as jest.SpyInstance
      ).mockReturnValue(extensionState);

      await pageManager['_getLoadedExtensionsState']();

      expect(extensionInstance.load).toHaveBeenCalled();
    });

    it('should set restricted pageStateManager to extension instance', async () => {
      (
        jest.spyOn(extensionInstance, 'load') as jest.SpyInstance
      ).mockReturnValue(extensionState);
      jest
        .spyOn(pageManager, '_setRestrictedPageStateManager')
        .mockImplementation();

      await pageManager['_getLoadedExtensionsState']();

      expect(pageManager._setRestrictedPageStateManager).toHaveBeenCalledWith(
        extensionInstance,
        extensionState
      );
    });

    it("should call extension's setPartialState method and switch extension to partial state", async () => {
      (
        jest.spyOn(extensionInstance, 'setPartialState') as jest.SpyInstance
      ).mockImplementation();
      (
        jest.spyOn(
          extensionInstance,
          'switchToPartialState'
        ) as jest.SpyInstance
      ).mockImplementation();
      (
        jest.spyOn(extensionInstance, 'load') as jest.SpyInstance
      ).mockReturnValue(extensionState);

      await pageManager['_getLoadedExtensionsState']();

      expect(extensionInstance.setPartialState).toHaveBeenCalled();
      expect(extensionInstance.switchToPartialState).toHaveBeenCalled();
    });

    it('should return extensions state together with active controller state', async () => {
      jest.spyOn(extensionInstance, 'load');
      jest
        .spyOn(pageManager, '_setRestrictedPageStateManager')
        .mockImplementation();

      const result = await pageManager['_getLoadedExtensionsState'](
        controllerState
      );

      expect(result).toStrictEqual({
        controller: 'controller',
        share: 'controller',
        extension: extensionState.extension,
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

  describe('_switchToPageStateManagerAfterLoaded method', () => {
    let deferredPromise: Promise<unknown>;
    let resolver: (value?: unknown) => void;

    beforeEach(() => {
      deferredPromise = new Promise(resolve => {
        resolver = resolve;
      });
    });

    it('should switch to state manager and clear partial state if resources are loaded successfully', async () => {
      (
        jest.spyOn(
          extensionInstance,
          'switchToStateManager'
        ) as jest.SpyInstance
      ).mockImplementation();
      (
        jest.spyOn(extensionInstance, 'clearPartialState') as jest.SpyInstance
      ).mockImplementation(() => {
        resolver();
      });

      pageManager._switchToPageStateManagerAfterLoaded(extensionInstance, {
        extension: Promise.resolve(),
      });
      await deferredPromise;

      expect(extensionInstance.switchToStateManager).toHaveBeenCalled();
      expect(extensionInstance.clearPartialState).toHaveBeenCalled();
    });

    it('should clear partial state if resource is not loaded successfully', async () => {
      (
        jest.spyOn(extensionInstance, 'clearPartialState') as jest.SpyInstance
      ).mockImplementation(() => {
        resolver();
      });

      pageManager._switchToPageStateManagerAfterLoaded(extensionInstance, {
        extension: Promise.reject(),
      });
      await deferredPromise;

      expect(extensionInstance.clearPartialState).toHaveBeenCalled();
    });
  });

  describe('_activatePageSource method', () => {
    beforeEach(() => {
      jest
        .spyOn(pageManager, '_activateController' as never)
        .mockImplementation();

      jest
        .spyOn(pageManager, '_activateExtensions' as never)
        .mockImplementation();
    });

    it('should activate controller and extensions', async () => {
      await pageManager['_activatePageSource']();

      expect(pageManager['_activateController']).toHaveBeenCalled();
      expect(pageManager['_activateExtensions']).toHaveBeenCalled();
      expect(
        (pageManager['_managedPage'].state as UnknownParameters).activated
      ).toBeTruthy();
    });

    it('should not call method activate more times', async () => {
      (pageManager['_managedPage'].state as UnknownParameters).activated = true;

      await pageManager['_activatePageSource']();

      expect(pageManager['_activateController']).not.toHaveBeenCalled();
      expect(pageManager['_activateExtensions']).not.toHaveBeenCalled();
    });
  });

  describe('_activateController method', () => {
    it('should call activate method on controller', async () => {
      (
        jest.spyOn(controllerInstance, 'activate') as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_activateController']();

      expect(controllerInstance.activate).toHaveBeenCalled();
    });
  });

  describe('_activateExtensions method', () => {
    it('should call activate method on extensions', async () => {
      (
        jest.spyOn(extensionInstance, 'activate') as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_activateExtensions']();

      expect(extensionInstance.activate).toHaveBeenCalled();
    });
  });

  describe('_updatePageSource method', () => {
    beforeEach(() => {
      jest
        .spyOn(pageManager, '_getUpdatedControllerState' as never)
        .mockReturnValue(controllerState as never);

      jest
        .spyOn(pageManager, '_getUpdatedExtensionsState' as never)
        .mockReturnValue(extensionsState as never);
      jest
        .spyOn(pageRenderer, 'update')
        .mockReturnValue(Promise.resolve() as never);
    });

    it('should be merge state from controller and extensions to updated page state', async () => {
      await pageManager['_updatePageSource']()
        .then(() => {
          expect(pageRenderer.update).toHaveBeenCalledWith(
            decoratedController,
            viewInstance,
            pageState,
            options
          );
        })
        .catch(error => {
          console.error(
            'ima.core.page.manager:_updatePageSource',
            error.message
          );
        });
    });
  });

  describe('_getUpdatedControllerState method', () => {
    it('should calls controller update method', () => {
      (
        jest.spyOn(controllerInstance, 'update') as jest.SpyInstance
      ).mockImplementation();
      (
        jest.spyOn(controllerInstance, 'getRouteParams') as jest.SpyInstance
      ).mockReturnValue(params);

      pageManager['_getUpdatedControllerState']();

      expect(controllerInstance.update).toHaveBeenCalledWith(params);
    });
  });

  describe('_getUpdatedExtensionsState method', () => {
    it('should call extensions update method', async () => {
      (
        jest.spyOn(extensionInstance, 'getRouteParams') as jest.SpyInstance
      ).mockReturnValue(params);
      (
        jest.spyOn(extensionInstance, 'update') as jest.SpyInstance
      ).mockReturnValue(extensionState);

      await pageManager['_getUpdatedExtensionsState']();

      expect(extensionInstance.update).toHaveBeenCalledWith(params);
    });

    it('should set restricted pageStateManager to extension instance', async () => {
      jest
        .spyOn(pageManager, '_setRestrictedPageStateManager')
        .mockImplementation();
      (
        jest.spyOn(extensionInstance, 'update') as jest.SpyInstance
      ).mockReturnValue(extensionState);

      await pageManager['_getUpdatedExtensionsState']();

      expect(pageManager._setRestrictedPageStateManager).toHaveBeenCalledWith(
        extensionInstance,
        extensionState
      );
    });

    it("should call extension's setPartialState method and switch extension to partial state", async () => {
      (
        jest.spyOn(extensionInstance, 'setPartialState') as jest.SpyInstance
      ).mockImplementation();
      (
        jest.spyOn(
          extensionInstance,
          'switchToPartialState'
        ) as jest.SpyInstance
      ).mockImplementation();
      (
        jest.spyOn(extensionInstance, 'update') as jest.SpyInstance
      ).mockReturnValue(extensionState);
      jest.spyOn(pageStateManager, 'getState').mockReturnValue({ foo: 'bar' });

      await pageManager['_getUpdatedExtensionsState']({ foobar: 'bazfoo' });

      expect(extensionInstance.setPartialState).toHaveBeenCalledWith(
        expect.objectContaining({
          foo: 'bar',
          foobar: 'bazfoo',
        })
      );
      expect(extensionInstance.switchToPartialState).toHaveBeenCalled();
    });

    it('should return extensions state together with active controller state', async () => {
      jest.spyOn(extensionInstance, 'update');
      jest
        .spyOn(pageManager, '_setRestrictedPageStateManager')
        .mockImplementation();

      const result = await pageManager['_getUpdatedExtensionsState'](
        controllerState
      );

      expect(result).toStrictEqual({
        controller: 'controller',
        share: 'controller',
        extension: extensionState.extension,
      });
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

  describe('_deactivatePageSource method', () => {
    beforeEach(() => {
      jest
        .spyOn(pageManager, '_deactivateController' as never)
        .mockImplementation();

      jest
        .spyOn(pageManager, '_deactivateExtensions' as never)
        .mockImplementation();
    });

    it('should activate controller and extensions', async () => {
      (pageManager['_managedPage'].state as UnknownParameters).activated = true;

      await pageManager['_deactivatePageSource']();

      expect(pageManager['_deactivateController']).toHaveBeenCalled();
      expect(pageManager['_deactivateExtensions']).toHaveBeenCalled();
    });

    it('should not call method activate more times', async () => {
      (pageManager['_managedPage'].state as UnknownParameters).activated =
        false;

      await pageManager['_deactivatePageSource']();

      expect(pageManager['_deactivateController']).not.toHaveBeenCalled();
      expect(pageManager['_deactivateExtensions']).not.toHaveBeenCalled();
    });
  });

  describe('_deactivateController method', () => {
    it('should call deactivate method on controller', async () => {
      (
        jest.spyOn(controllerInstance, 'deactivate') as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_deactivateController']();

      expect(controllerInstance.deactivate).toHaveBeenCalled();
    });
  });

  describe('_deactivateExtensions method', () => {
    it('should call deactivate method on extensions', async () => {
      (
        jest.spyOn(extensionInstance, 'deactivate') as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_deactivateExtensions']();

      expect(extensionInstance.deactivate).toHaveBeenCalled();
    });
  });

  describe('_destroyPageSource method', () => {
    it('should destroy page resource', async () => {
      jest
        .spyOn(pageManager, '_destroyController' as never)
        .mockImplementation();
      jest
        .spyOn(pageManager, '_destroyExtensions' as never)
        .mockImplementation();

      await pageManager['_destroyPageSource']();

      expect(pageManager['_destroyController']).toHaveBeenCalledWith();
      expect(pageManager['_destroyExtensions']).toHaveBeenCalledWith();
    });
  });

  describe('_destroyController method', () => {
    it('should call destroy on controller instance', async () => {
      (
        jest.spyOn(controllerInstance, 'destroy') as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_destroyController']();

      expect(controllerInstance.destroy).toHaveBeenCalled();
    });

    it('should unset pageStateManager to controller', async () => {
      (
        jest.spyOn(
          controllerInstance,
          'setPageStateManager'
        ) as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_destroyController']();

      expect(controllerInstance.setPageStateManager).toHaveBeenCalledWith();
    });
  });

  describe('_destroyExtensions method', () => {
    it('should call destroy on extension instance', async () => {
      (
        jest.spyOn(extensionInstance, 'destroy') as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_destroyExtensions']();

      expect(extensionInstance.destroy).toHaveBeenCalled();
    });

    it('should unset pageStateManager to extension', async () => {
      (
        jest.spyOn(extensionInstance, 'setPageStateManager') as jest.SpyInstance
      ).mockImplementation();

      await pageManager['_destroyExtensions']();

      expect(extensionInstance.setPageStateManager).toHaveBeenCalledWith();
    });
  });

  describe('_hasOnlyUpdate method', () => {
    it('should return value from onlyUpdate function', () => {
      const newOptions: RouteOptions = {
        ...options,
        onlyUpdate: jest.fn().mockReturnValue(true),
      };

      //Instance of mocked Jest function !== Function, wrapper is needed =>  https://github.com/facebook/jest/issues/6329
      const spy = jest.spyOn(newOptions, 'onlyUpdate' as never);
      const mockSpyWrapper = (...args: unknown[]) => {
        // @ts-expect-error
        return spy(...args);
      };
      newOptions.onlyUpdate = mockSpyWrapper;

      expect(
        pageManager['_hasOnlyUpdate'](Controller, View, newOptions)
      ).toBeTruthy();
      expect(spy).toHaveBeenCalledWith(Controller, View);
    });

    it('should return true for option onlyUpdate set to true and for same controller and view', () => {
      const newOptions = Object.assign({}, options, { onlyUpdate: true });

      expect(
        pageManager['_hasOnlyUpdate'](Controller, View, newOptions)
      ).toBeTruthy();
    });

    it('should return false for option onlyUpdate set to true and for different controller and view', () => {
      const newOptions = Object.assign({}, options, { onlyUpdate: true });
      pageManager['_managedPage'].controller = undefined;

      expect(
        pageManager['_hasOnlyUpdate'](Controller, View, newOptions)
      ).toBeFalsy();
    });
  });

  describe('_clearComponentState method', () => {
    it('should call page renderer unmount method if route options documentView and managedRootView are not same with last one rendered', () => {
      jest.spyOn(pageRenderer, 'unmount').mockImplementation();

      pageManager._clearComponentState({} as RouteOptions);

      expect(pageRenderer.unmount).toHaveBeenCalled();
    });
  });
});
