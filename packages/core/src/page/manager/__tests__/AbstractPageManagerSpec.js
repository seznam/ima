import Controller from 'src/controller/Controller';
import Extension from 'src/extension/Extension';
import PageHandler from 'src/page/handler/PageHandler';
import PageHandlerRegistry from 'src/page/handler/PageHandlerRegistry';
import AbstractPageManager from '../AbstractPageManager';
import PageRenderer from 'src/page/renderer/PageRenderer';
import PageStateManager from 'src/page/state/PageStateManager';
import RouteFactory from 'src/router/RouteFactory';
import { toMockedInstance } from 'to-mock';

describe('ima.core.page.manager.AbstractPageManager', () => {
  let controllerState = {
    controller: 'controller',
    share: 'controller'
  };
  let extensionsState = {
    extension: 'extension',
    share: 'extension'
  };
  let extensionState = {
    extension: 'extension'
  };
  let pageState = Object.assign({}, extensionsState, controllerState);

  let pageFactory = {
    createController: Controller => new Controller(),
    decorateController: controller => controller,
    decoratePageStateManager: pageStateManger => pageStateManger,
    createView: view => view
  };
  let pageRenderer = null;
  let pageStateManager = null;
  let pageManager = null;
  let handlerRegistry = null;
  let routeFactory = null;

  let View = () => {};

  let routeName = 'link';
  let routePath = '/link';
  let route = null;

  let options = {
    onlyUpdate: false,
    autoScroll: true,
    documentView: null,
    managedRootView: null
  };
  let params = {
    param1: 'param1',
    param2: 2
  };

  let controllerInstance = pageFactory.createController(Controller);
  let decoratedController = pageFactory.decorateController(controllerInstance);
  let viewInstance = pageFactory.createView(View);
  let extensionInstance = toMockedInstance(Extension, {
    load() {
      return extensionState;
    }
  });

  let pageManagerHandler = toMockedInstance(PageHandler);

  beforeEach(() => {
    pageRenderer = new PageRenderer();
    pageStateManager = new PageStateManager();
    handlerRegistry = new PageHandlerRegistry(pageManagerHandler);
    routeFactory = new RouteFactory();

    pageManager = new AbstractPageManager(
      pageFactory,
      pageRenderer,
      pageStateManager,
      handlerRegistry
    );

    jest
      .spyOn(controllerInstance, 'getExtensions')
      .mockReturnValue([extensionInstance]);

    route = routeFactory.createRoute(
      routeName,
      routePath,
      Controller,
      View,
      options,
      []
    );

    pageManager._managedPage = pageManager._constructManagedPageValue(
      Controller,
      View,
      route,
      options,
      params,
      controllerInstance,
      decoratedController,
      viewInstance
    );
  });

  afterEach(() => {
    pageManager._clearManagedPageValue();
    jest.clearAllMocks();
  });

  it('should be observe state manager', () => {
    pageManager.init();

    expect(pageStateManager.onChange).not.toEqual(null);
  });

  describe('manage method', () => {
    it('should only update last managed controller and view', done => {
      jest.spyOn(pageManager, '_hasOnlyUpdate').mockReturnValue(true);
      jest
        .spyOn(pageManager, '_runPreManageHandlers')
        .mockReturnValue(Promise.resolve());
      jest
        .spyOn(pageManager, '_runPostManageHandlers')
        .mockReturnValue(Promise.resolve());
      jest
        .spyOn(pageManager, '_updatePageSource')
        .mockReturnValue(Promise.resolve());

      pageManager
        .manage(route, options, params)
        .then(() => {
          expect(pageManager._runPreManageHandlers).toHaveBeenCalled();
          expect(pageManager._managedPage.params).toEqual(params);
          expect(pageManager._updatePageSource).toHaveBeenCalled();
          expect(pageManager._runPostManageHandlers).toHaveBeenCalled();
          done();
        })
        .catch(error => {
          console.error('ima.core.page.manager:manage', error.message);
          done(error);
        });
    });

    it('should mount new controller and view', done => {
      jest.spyOn(pageManager, '_hasOnlyUpdate').mockReturnValue(false);
      jest
        .spyOn(pageManager, '_runPreManageHandlers')
        .mockReturnValue(Promise.resolve());
      jest
        .spyOn(pageManager, '_runPostManageHandlers')
        .mockReturnValue(Promise.resolve());
      jest.spyOn(pageManager, '_deactivatePageSource').mockImplementation();
      jest.spyOn(pageManager, '_destroyPageSource').mockImplementation();
      jest.spyOn(pageStateManager, 'clear').mockImplementation();
      jest.spyOn(pageManager, '_clearComponentState').mockImplementation();
      jest.spyOn(pageManager, '_clearManagedPageValue').mockImplementation();
      jest
        .spyOn(pageManager, '_constructManagedPageValue')
        .mockImplementation();
      jest.spyOn(pageManager, '_initPageSource').mockImplementation();
      jest
        .spyOn(pageManager, '_loadPageSource')
        .mockReturnValue(Promise.resolve());

      pageManager
        .manage(route, options, params)
        .then(() => {
          expect(pageManager._runPreManageHandlers).toHaveBeenCalled();
          expect(pageManager._deactivatePageSource).toHaveBeenCalled();
          expect(pageManager._destroyPageSource).toHaveBeenCalled();
          expect(pageStateManager.clear).toHaveBeenCalled();
          expect(pageManager._clearComponentState).toHaveBeenCalledWith(
            options
          );
          expect(pageManager._clearManagedPageValue).toHaveBeenCalled();
          expect(pageManager._constructManagedPageValue).toHaveBeenCalled();
          expect(pageManager._initPageSource).toHaveBeenCalled();
          expect(pageManager._loadPageSource).toHaveBeenCalled();
          expect(pageManager._runPostManageHandlers).toHaveBeenCalled();
          done();
        })
        .catch(error => {
          console.error('ima.core.page.manager:manage', error.message);
          done(error);
        });
    });
  });

  describe('destroy method', () => {
    it('should clear managed page value', async () => {
      jest.spyOn(pageManager, '_clearManagedPageValue').mockImplementation();

      await pageManager.destroy();

      expect(pageManager._clearManagedPageValue).toHaveBeenCalled();
    });

    it('should remove listener for onChange event from page state manager', async () => {
      await pageManager.destroy();

      expect(pageStateManager.onChange).toBeNull();
    });

    it('should deactivate page source', async () => {
      jest.spyOn(pageManager, '_deactivatePageSource').mockImplementation();

      await pageManager.destroy();

      expect(pageManager._deactivatePageSource).toHaveBeenCalled();
    });

    it('should destroy page source', async () => {
      jest.spyOn(pageManager, '_destroyPageSource').mockImplementation();

      await pageManager.destroy();

      expect(pageManager._destroyPageSource).toHaveBeenCalled();
    });

    it('should clear page state manager', async () => {
      jest.spyOn(pageStateManager, 'clear').mockImplementation();

      await pageManager.destroy();

      expect(pageStateManager.clear).toHaveBeenCalled();
    });
  });

  describe('_setRestrictedPageStateManager', () => {
    let allowedStateKeys = ['user'];
    let allAllowedStateKeys =
      Object.keys(extensionState).concat(allowedStateKeys);

    beforeEach(() => {
      jest
        .spyOn(extensionInstance, 'getAllowedStateKeys')
        .mockReturnValue(allowedStateKeys);

      jest
        .spyOn(pageFactory, 'decoratePageStateManager')
        .mockReturnValue(pageStateManager);

      jest.spyOn(extensionInstance, 'setPageStateManager').mockImplementation();
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
      jest.spyOn(pageManager, '_initController').mockImplementation();
      jest.spyOn(pageManager, '_initExtensions').mockImplementation();

      await pageManager._initPageSource();

      expect(pageManager._initController).toHaveBeenCalledWith();
      expect(pageManager._initExtensions).toHaveBeenCalledWith();
    });
  });

  describe('_initController method', () => {
    it('should set route params to controller instance', async () => {
      jest.spyOn(controllerInstance, 'setRouteParams').mockImplementation();

      await pageManager._initController();

      expect(controllerInstance.setRouteParams).toHaveBeenCalledWith(params);
    });

    it('should call init function on controller instance', async () => {
      jest.spyOn(controllerInstance, 'init').mockImplementation();

      await pageManager._initController();

      expect(controllerInstance.init).toHaveBeenCalled();
    });
  });

  describe('_initExtensions method', () => {
    it('should set route params to extension instance', async () => {
      jest.spyOn(extensionInstance, 'setRouteParams').mockImplementation();

      await pageManager._initExtensions();

      expect(extensionInstance.setRouteParams).toHaveBeenCalledWith(params);
    });

    it('should call init function on controller instance', async () => {
      jest.spyOn(extensionInstance, 'init').mockImplementation();

      await pageManager._initExtensions();

      expect(extensionInstance.init).toHaveBeenCalled();
    });
  });

  describe('_loadPageSource method', () => {
    beforeEach(() => {
      jest
        .spyOn(pageManager, '_getLoadedControllerState')
        .mockReturnValue(controllerState);

      jest
        .spyOn(pageManager, '_getLoadedExtensionsState')
        .mockReturnValue(extensionsState);
      jest.spyOn(pageRenderer, 'mount').mockReturnValue(Promise.resolve());
    });

    it('should be merge state from controller and extensions to loaded page state', done => {
      pageManager
        ._loadPageSource()
        .then(() => {
          expect(pageRenderer.mount).toHaveBeenCalledWith(
            decoratedController,
            View,
            pageState,
            options
          );
          done();
        })
        .catch(error => {
          console.error('ima.core.page.manager:_loadPageSource', error.message);
          done(error);
        });
    });
  });

  describe('_getLoadedControllerState method', () => {
    it('should calls controller load method', async () => {
      jest.spyOn(controllerInstance, 'load').mockImplementation();

      await pageManager._getLoadedControllerState();

      expect(controllerInstance.load).toHaveBeenCalled();
    });

    it('should set pageStateManager to controller instance', async () => {
      jest
        .spyOn(controllerInstance, 'setPageStateManager')
        .mockImplementation();

      await pageManager._getLoadedControllerState();

      expect(controllerInstance.setPageStateManager).toHaveBeenCalledWith(
        pageStateManager
      );
    });
  });

  describe('_getLoadedExtensionsState method', () => {
    it('should call extensions load method', async () => {
      jest.spyOn(extensionInstance, 'load').mockReturnValue(extensionState);

      await pageManager._getLoadedExtensionsState();

      expect(extensionInstance.load).toHaveBeenCalled();
    });

    it('should set restricted pageStateManager to extension instance', async () => {
      jest.spyOn(extensionInstance, 'load').mockReturnValue(extensionState);
      jest
        .spyOn(pageManager, '_setRestrictedPageStateManager')
        .mockImplementation();

      await pageManager._getLoadedExtensionsState();

      expect(pageManager._setRestrictedPageStateManager).toHaveBeenCalledWith(
        extensionInstance,
        extensionState
      );
    });

    it("should call extension's setPartialState method and switch extension to partial state", async () => {
      jest.spyOn(extensionInstance, 'setPartialState').mockImplementation();
      jest
        .spyOn(extensionInstance, 'switchToPartialState')
        .mockImplementation();
      jest.spyOn(extensionInstance, 'load').mockReturnValue(extensionState);

      await pageManager._getLoadedExtensionsState();

      expect(extensionInstance.setPartialState).toHaveBeenCalled();
      expect(extensionInstance.switchToPartialState).toHaveBeenCalled();
    });

    it('should return extensions state together with active controller state', async () => {
      jest.spyOn(extensionInstance, 'load').mockReturnValue({
        extension: 'extension'
      });
      jest
        .spyOn(pageManager, '_setRestrictedPageStateManager')
        .mockImplementation();

      let result = await pageManager._getLoadedExtensionsState(controllerState);

      expect(result).toEqual({
        controller: 'controller',
        share: 'controller',
        extension: 'extension'
      });
    });

    it('should switch extensions to PageStateManager after all resources are loaded', async () => {
      jest
        .spyOn(pageManager, '_switchToPageStateManagerAfterLoaded')
        .mockImplementation();

      await pageManager._getLoadedExtensionsState();

      expect(
        pageManager._switchToPageStateManagerAfterLoaded
      ).toHaveBeenCalled();
    });
  });

  describe('_activatePageSource method', () => {
    beforeEach(() => {
      jest.spyOn(pageManager, '_activateController').mockImplementation();

      jest.spyOn(pageManager, '_activateExtensions').mockImplementation();
    });

    it('should activate controller and extensions', async () => {
      await pageManager._activatePageSource();

      expect(pageManager._activateController).toHaveBeenCalled();
      expect(pageManager._activateExtensions).toHaveBeenCalled();
      expect(pageManager._managedPage.state.activated).toEqual(true);
    });

    it('should not call method activate more times', async () => {
      pageManager._managedPage.state.activated = true;

      await pageManager._activatePageSource();

      expect(pageManager._activateController).not.toHaveBeenCalled();
      expect(pageManager._activateExtensions).not.toHaveBeenCalled();
    });
  });

  describe('_activateController method', () => {
    it('should call activate method on controller', async () => {
      jest.spyOn(controllerInstance, 'activate').mockImplementation();

      await pageManager._activateController();

      expect(controllerInstance.activate).toHaveBeenCalled();
    });
  });

  describe('_activateExtensions method', () => {
    it('should call activate method on extensions', async () => {
      jest.spyOn(extensionInstance, 'activate').mockImplementation();

      await pageManager._activateExtensions();

      expect(extensionInstance.activate).toHaveBeenCalled();
    });
  });

  describe('_updatePageSource method', () => {
    beforeEach(() => {
      jest
        .spyOn(pageManager, '_getUpdatedControllerState')
        .mockReturnValue(controllerState);

      jest
        .spyOn(pageManager, '_getUpdatedExtensionsState')
        .mockReturnValue(extensionsState);
      jest.spyOn(pageRenderer, 'update').mockReturnValue(Promise.resolve());
    });

    it('should be merge state from controller and extensions to updated page state', done => {
      pageManager
        ._updatePageSource()
        .then(() => {
          expect(pageRenderer.update).toHaveBeenCalledWith(
            decoratedController,
            viewInstance,
            pageState,
            options
          );
          done();
        })
        .catch(error => {
          console.error(
            'ima.core.page.manager:_updatePageSource',
            error.message
          );
          done(error);
        });
    });
  });

  describe('_getUpdatedControllerState method', () => {
    it('should calls controller update method', () => {
      jest.spyOn(controllerInstance, 'update').mockImplementation();
      jest.spyOn(controllerInstance, 'getRouteParams').mockReturnValue(params);

      pageManager._getUpdatedControllerState();

      expect(controllerInstance.update).toHaveBeenCalledWith(params);
    });
  });

  describe('_getUpdatedExtensionsState method', () => {
    it('should call extensions update method', async () => {
      jest.spyOn(extensionInstance, 'getRouteParams').mockReturnValue(params);
      jest.spyOn(extensionInstance, 'update').mockReturnValue(extensionState);

      await pageManager._getUpdatedExtensionsState();

      expect(extensionInstance.update).toHaveBeenCalledWith(params);
    });

    it('should set restricted pageStateManager to extension instance', async () => {
      jest
        .spyOn(pageManager, '_setRestrictedPageStateManager')
        .mockImplementation();
      jest.spyOn(extensionInstance, 'update').mockReturnValue(extensionState);

      await pageManager._getUpdatedExtensionsState();

      expect(pageManager._setRestrictedPageStateManager).toHaveBeenCalledWith(
        extensionInstance,
        extensionState
      );
    });

    it("should call extension's setPartialState method and switch extension to partial state", async () => {
      jest.spyOn(extensionInstance, 'setPartialState').mockImplementation();
      jest
        .spyOn(extensionInstance, 'switchToPartialState')
        .mockImplementation();
      jest.spyOn(extensionInstance, 'update').mockReturnValue(extensionState);
      jest.spyOn(pageStateManager, 'getState').mockReturnValue({ foo: 'bar' });

      await pageManager._getUpdatedExtensionsState({ foobar: 'bazfoo' });

      expect(extensionInstance.setPartialState).toHaveBeenCalledWith(
        expect.objectContaining({
          foo: 'bar',
          foobar: 'bazfoo'
        })
      );
      expect(extensionInstance.switchToPartialState).toHaveBeenCalled();
    });

    it('should return extensions state together with active controller state', async () => {
      jest.spyOn(extensionInstance, 'update').mockReturnValue({
        extension: 'extension'
      });
      jest
        .spyOn(pageManager, '_setRestrictedPageStateManager')
        .mockImplementation();

      let result = await pageManager._getUpdatedExtensionsState(
        controllerState
      );

      expect(result).toEqual({
        controller: 'controller',
        share: 'controller',
        extension: 'extension'
      });
    });

    it('should switch extensions to PageStateManager after all resources are updated', async () => {
      jest
        .spyOn(pageManager, '_switchToPageStateManagerAfterLoaded')
        .mockImplementation();

      await pageManager._getLoadedExtensionsState();

      expect(
        pageManager._switchToPageStateManagerAfterLoaded
      ).toHaveBeenCalled();
    });
  });

  describe('_deactivatePageSource method', () => {
    beforeEach(() => {
      jest.spyOn(pageManager, '_deactivateController').mockImplementation();

      jest.spyOn(pageManager, '_deactivateExtensions').mockImplementation();
    });

    it('should activate controller and extensions', async () => {
      pageManager._managedPage.state.activated = true;

      await pageManager._deactivatePageSource();

      expect(pageManager._deactivateController).toHaveBeenCalled();
      expect(pageManager._deactivateExtensions).toHaveBeenCalled();
    });

    it('should not call method activate more times', async () => {
      pageManager._managedPage.state.activated = false;

      await pageManager._deactivatePageSource();

      expect(pageManager._deactivateController).not.toHaveBeenCalled();
      expect(pageManager._deactivateExtensions).not.toHaveBeenCalled();
    });
  });

  describe('_deactivateController method', () => {
    it('should call deactivate method on controller', async () => {
      jest.spyOn(controllerInstance, 'deactivate').mockImplementation();

      await pageManager._deactivateController();

      expect(controllerInstance.deactivate).toHaveBeenCalled();
    });
  });

  describe('_deactivateExtensions method', () => {
    it('should call deactivate method on extensions', async () => {
      jest.spyOn(extensionInstance, 'deactivate').mockImplementation();

      await pageManager._deactivateExtensions();

      expect(extensionInstance.deactivate).toHaveBeenCalled();
    });
  });

  describe('_destroyPageSource method', () => {
    it('should destroy page resource', async () => {
      jest.spyOn(pageManager, '_destroyController').mockImplementation();
      jest.spyOn(pageManager, '_destroyExtensions').mockImplementation();

      await pageManager._destroyPageSource();

      expect(pageManager._destroyController).toHaveBeenCalledWith();
      expect(pageManager._destroyExtensions).toHaveBeenCalledWith();
    });
  });

  describe('_destroyController method', () => {
    it('should call destroy on controller instance', async () => {
      jest.spyOn(controllerInstance, 'destroy').mockImplementation();

      await pageManager._destroyController();

      expect(controllerInstance.destroy).toHaveBeenCalled();
    });

    it('should unset pageStateManager to controller', async () => {
      jest
        .spyOn(controllerInstance, 'setPageStateManager')
        .mockImplementation();

      await pageManager._destroyController();

      expect(controllerInstance.setPageStateManager).toHaveBeenCalledWith(null);
    });
  });

  describe('_destroyExtensions method', () => {
    it('should call destroy on extension instance', async () => {
      jest.spyOn(extensionInstance, 'destroy').mockImplementation();

      await pageManager._destroyExtensions();

      expect(extensionInstance.destroy).toHaveBeenCalled();
    });

    it('should unset pageStateManager to extension', async () => {
      jest.spyOn(extensionInstance, 'setPageStateManager').mockImplementation();

      await pageManager._destroyExtensions();

      expect(extensionInstance.setPageStateManager).toHaveBeenCalledWith(null);
    });
  });

  describe('_hasOnlyUpdate method', () => {
    it('should return value from onlyUpdate function', () => {
      let newOptions = Object.assign({}, options, {
        onlyUpdate: () => true
      });

      jest.spyOn(newOptions, 'onlyUpdate');

      expect(pageManager._hasOnlyUpdate(Controller, View, newOptions)).toEqual(
        true
      );
      expect(newOptions.onlyUpdate).toHaveBeenCalledWith(Controller, View);
    });

    it('should return true for option onlyUpdate set to true and for same controller and view', () => {
      let newOptions = Object.assign({}, options, { onlyUpdate: true });

      expect(pageManager._hasOnlyUpdate(Controller, View, newOptions)).toEqual(
        true
      );
    });

    it('should return false for option onlyUpdate set to true and for different controller and view', () => {
      let newOptions = Object.assign({}, options, { onlyUpdate: true });
      pageManager._managedPage.controller = null;

      expect(pageManager._hasOnlyUpdate(Controller, View, newOptions)).toEqual(
        false
      );
    });
  });

  describe('_clearComponentState method', () => {
    it('should call page renderer unmount method if route options documentView and managedRootView are not same with last one renderred', () => {
      jest.spyOn(pageRenderer, 'unmount').mockImplementation();

      pageManager._clearComponentState({});

      expect(pageRenderer.unmount).toHaveBeenCalled();
    });
  });

  describe('_onChangeStateHandler method', () => {
    it('should call setState', () => {
      let state = { state: 'state' };

      jest.spyOn(pageRenderer, 'setState').mockImplementation();

      pageManager._onChangeStateHandler(state);

      expect(pageRenderer.setState).toHaveBeenCalledWith(state);
    });
  });
});
