import Controller from 'controller/Controller';
import Extension from 'extension/Extension';
import AbstractPageManager from 'page/manager/AbstractPageManager';
import PageRenderer from 'page/renderer/PageRenderer';
import PageStateManager from 'page/state/PageStateManager';

describe('ima.page.manager.AbstractPageManager', () => {
  let pageFactory = {
    createController: Controller => new Controller(),
    decorateController: controller => controller,
    decoratePageStateManager: pageStateManger => pageStateManger,
    createView: view => view
  };
  let pageRenderer = null;
  let pageStateManager = null;
  let pageManager = null;

  let View = () => {};
  let options = {
    onlyUpdate: false,
    autoScroll: true,
    allowSPA: true,
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
  let extensionInstance = new Extension();

  let controllerState = {
    controller: 'controller',
    share: 'controller'
  };
  let extensionsState = {
    extension: 'extension',
    share: 'extension'
  };
  let extensionState = {};
  let pageState = Object.assign({}, extensionsState, controllerState);

  beforeEach(() => {
    pageRenderer = new PageRenderer();
    pageStateManager = new PageStateManager();
    let pageManagerHandler = {
      handlePreManagedState: jest.fn(() => true),
      handlePostManagedState: jest.fn(() => true)
    };

    pageManager = new AbstractPageManager(
      pageFactory,
      pageRenderer,
      pageStateManager,
      [pageManagerHandler]
    );

    spyOn(controllerInstance, 'getExtensions').and.returnValue([
      extensionInstance
    ]);

    pageManager._managedPage = pageManager._constructManagedPageValue(
      Controller,
      View,
      options,
      params,
      controllerInstance,
      decoratedController,
      viewInstance
    );
  });

  afterEach(() => {
    pageManager._clearManagedPageValue();
  });

  it('should be observe state manager', () => {
    pageManager.init();

    expect(pageStateManager.onChange).not.toEqual(null);
  });

  describe('manage method', () => {
    it('should only update last managed controller and view', done => {
      spyOn(pageManager, '_hasOnlyUpdate').and.returnValue(true);
      spyOn(pageManager, '_runPreManageHandlers').and.returnValue(
        Promise.resolve()
      );
      spyOn(pageManager, '_runPostManageHandlers').and.returnValue(
        Promise.resolve()
      );
      spyOn(pageManager, '_updatePageSource').and.returnValue(
        Promise.resolve()
      );

      pageManager
        .manage(Controller, View, options, params)
        .then(() => {
          expect(pageManager._runPreManageHandlers).toHaveBeenCalled();
          expect(pageManager._managedPage.params).toEqual(params);
          expect(pageManager._updatePageSource).toHaveBeenCalled();
          expect(pageManager._runPostManageHandlers).toHaveBeenCalled();
          done();
        })
        .catch(error => {
          console.error('ima.page.manager:manage', error.message);
          done(error);
        });
    });

    it('should mount new controller and view', done => {
      spyOn(pageManager, '_hasOnlyUpdate').and.returnValue(false);
      spyOn(pageManager, '_runPreManageHandlers').and.returnValue(
        Promise.resolve()
      );
      spyOn(pageManager, '_runPostManageHandlers').and.returnValue(
        Promise.resolve()
      );
      spyOn(pageManager, '_deactivatePageSource').and.stub();
      spyOn(pageManager, '_destroyPageSource').and.stub();
      spyOn(pageStateManager, 'clear').and.stub();
      spyOn(pageManager, '_clearComponentState').and.stub();
      spyOn(pageManager, '_clearManagedPageValue').and.stub();
      spyOn(pageManager, '_constructManagedPageValue').and.stub();
      spyOn(pageManager, '_initPageSource').and.stub();
      spyOn(pageManager, '_loadPageSource').and.returnValue(Promise.resolve());

      pageManager
        .manage(Controller, View, options, params)
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
          console.error('ima.page.manager:manage', error.message);
          done(error);
        });
    });
  });

  describe('destroy method', () => {
    it('should clear managed page value', () => {
      spyOn(pageManager, '_clearManagedPageValue').and.stub();

      pageManager.destroy();

      expect(pageManager._clearManagedPageValue).toHaveBeenCalled();
    });

    it('should remove listener for onChange event from page state manager', () => {
      pageManager.destroy();

      expect(pageStateManager.onChange).toBeNull();
    });

    it('should deactivate page source', () => {
      spyOn(pageManager, '_deactivatePageSource').and.stub();

      pageManager.destroy();

      expect(pageManager._deactivatePageSource).toHaveBeenCalled();
    });

    it('should destroy page source', () => {
      spyOn(pageManager, '_destroyPageSource').and.stub();

      pageManager.destroy();

      expect(pageManager._destroyPageSource).toHaveBeenCalled();
    });

    it('should clear page state manager', () => {
      spyOn(pageStateManager, 'clear').and.stub();

      pageManager.destroy();

      expect(pageStateManager.clear).toHaveBeenCalled();
    });
  });

  describe('_setRestrictedPageStateManager', () => {
    let allowedStateKeys = ['user'];
    let allAllowedStateKeys = Object.keys(extensionState).concat(
      allowedStateKeys
    );

    beforeEach(() => {
      spyOn(extensionInstance, 'getAllowedStateKeys').and.returnValue(
        allowedStateKeys
      );

      spyOn(pageFactory, 'decoratePageStateManager').and.returnValue(
        pageStateManager
      );

      spyOn(extensionInstance, 'setPageStateManager').and.stub();
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
    it('should initialize page source', () => {
      spyOn(pageManager, '_initController').and.stub();
      spyOn(pageManager, '_initExtensions').and.stub();

      pageManager._initPageSource();

      expect(pageManager._initController).toHaveBeenCalledWith();
      expect(pageManager._initExtensions).toHaveBeenCalledWith();
    });
  });

  describe('_initController method', () => {
    it('should set route params to controller instance', () => {
      spyOn(controllerInstance, 'setRouteParams').and.stub();

      pageManager._initController();

      expect(controllerInstance.setRouteParams).toHaveBeenCalledWith(params);
    });

    it('should call init function on controller instance', () => {
      spyOn(controllerInstance, 'init').and.stub();

      pageManager._initController();

      expect(controllerInstance.init).toHaveBeenCalled();
    });
  });

  describe('_initExtensions method', () => {
    it('should set route params to extension instance', () => {
      spyOn(extensionInstance, 'setRouteParams').and.stub();

      pageManager._initExtensions();

      expect(extensionInstance.setRouteParams).toHaveBeenCalledWith(params);
    });

    it('should call init function on controller instance', () => {
      spyOn(extensionInstance, 'init').and.stub();

      pageManager._initExtensions();

      expect(extensionInstance.init).toHaveBeenCalled();
    });
  });

  describe('_loadPageSource method', () => {
    beforeEach(() => {
      spyOn(pageManager, '_getLoadedControllerState').and.returnValue(
        controllerState
      );

      spyOn(pageManager, '_getLoadedExtensionsState').and.returnValue(
        extensionsState
      );
      spyOn(pageRenderer, 'mount').and.returnValue(Promise.resolve());
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
          console.error('ima.page.manager:_loadPageSource', error.message);
          done(error);
        });
    });

    it('should clear partialState', done => {
      spyOn(pageManager, '_clearPartialState').and.stub();

      pageManager
        ._loadPageSource()
        .then(() => {
          expect(pageManager._clearPartialState).toHaveBeenCalled();
          done();
        })
        .catch(error => {
          console.error('ima.page.manager:_clearPartialState', error.message);
          done(error);
        });
    });
  });

  describe('_getLoadedControllerState method', () => {
    it('should calls controller load method', () => {
      spyOn(controllerInstance, 'load').and.stub();

      pageManager._getLoadedControllerState();

      expect(controllerInstance.load).toHaveBeenCalled();
    });

    it('should set pageStateManager to controller instance', () => {
      spyOn(controllerInstance, 'setPageStateManager').and.stub();

      pageManager._getLoadedControllerState();

      expect(controllerInstance.setPageStateManager).toHaveBeenCalledWith(
        pageStateManager
      );
    });
  });

  describe('_getLoadedExtensionsState method', () => {
    it('should call extensions load method', () => {
      spyOn(extensionInstance, 'load').and.returnValue(extensionState);

      pageManager._getLoadedExtensionsState();

      expect(extensionInstance.load).toHaveBeenCalled();
    });

    it('should set restricted pageStateManager to extension instance', () => {
      spyOn(extensionInstance, 'load').and.returnValue(extensionState);
      spyOn(pageManager, '_setRestrictedPageStateManager').and.stub();

      pageManager._getLoadedExtensionsState();

      expect(pageManager._setRestrictedPageStateManager).toHaveBeenCalledWith(
        extensionInstance,
        extensionState
      );
    });

    it('should call extensions setPartialState method', () => {
      spyOn(extensionInstance, 'setPartialState').and.stub();
      spyOn(extensionInstance, 'load').and.returnValue(extensionState);

      pageManager._getLoadedExtensionsState();

      expect(extensionInstance.setPartialState).toHaveBeenCalled();
    });

    it('should return extensions state together with active controller state', () => {
      spyOn(extensionInstance, 'load').and.returnValue({
        extension: 'extension'
      });
      spyOn(pageManager, '_setRestrictedPageStateManager').and.stub();

      let result = pageManager._getLoadedExtensionsState(controllerState);

      expect(result).toEqual({
        controller: 'controller',
        share: 'controller',
        extension: 'extension'
      });
    });
  });

  describe('_activatePageSource method', () => {
    beforeEach(() => {
      spyOn(pageManager, '_activateController').and.stub();

      spyOn(pageManager, '_activateExtensions').and.stub();
    });

    it('should activate controller and extensions', () => {
      pageManager._activatePageSource();

      expect(pageManager._activateController).toHaveBeenCalled();
      expect(pageManager._activateExtensions).toHaveBeenCalled();
      expect(pageManager._managedPage.state.activated).toEqual(true);
    });

    it('should not call method activate more times', () => {
      pageManager._managedPage.state.activated = true;

      expect(pageManager._activateController).not.toHaveBeenCalled();
      expect(pageManager._activateExtensions).not.toHaveBeenCalled();
    });
  });

  describe('_activateController method', () => {
    it('should call activate method on controller', () => {
      spyOn(controllerInstance, 'activate').and.stub();

      pageManager._activateController();

      expect(controllerInstance.activate).toHaveBeenCalled();
    });
  });

  describe('_activateExtensions method', () => {
    it('should call activate method on extensions', () => {
      spyOn(extensionInstance, 'activate').and.stub();

      pageManager._activateExtensions();

      expect(extensionInstance.activate).toHaveBeenCalled();
    });
  });

  describe('_updatePageSource method', () => {
    beforeEach(() => {
      spyOn(pageManager, '_getUpdatedControllerState').and.returnValue(
        controllerState
      );

      spyOn(pageManager, '_getUpdatedExtensionsState').and.returnValue(
        extensionsState
      );
      spyOn(pageRenderer, 'update').and.returnValue(Promise.resolve());
    });

    it('should be merge state from controller and extensions to updated page state', done => {
      pageManager
        ._updatePageSource()
        .then(() => {
          expect(pageRenderer.update).toHaveBeenCalledWith(
            decoratedController,
            pageState
          );
          done();
        })
        .catch(error => {
          console.error('ima.page.manager:_updatePageSource', error.message);
          done(error);
        });
    });

    it('should clear partialState', done => {
      spyOn(pageManager, '_clearPartialState').and.stub();

      pageManager
        ._updatePageSource()
        .then(() => {
          expect(pageManager._clearPartialState).toHaveBeenCalled();
          done();
        })
        .catch(error => {
          console.error('ima.page.manager:_clearPartialState', error.message);
          done(error);
        });
    });
  });

  describe('_getUpdatedControllerState method', () => {
    it('should calls controller update method', () => {
      spyOn(controllerInstance, 'update').and.stub();
      spyOn(controllerInstance, 'getRouteParams').and.returnValue(params);

      pageManager._getUpdatedControllerState();

      expect(controllerInstance.update).toHaveBeenCalledWith(params);
    });
  });

  describe('_getUpdatedExtensionsState method', () => {
    it('should call extensions update method', () => {
      spyOn(extensionInstance, 'getRouteParams').and.returnValue(params);
      spyOn(extensionInstance, 'update').and.returnValue(extensionState);

      pageManager._getUpdatedExtensionsState();

      expect(extensionInstance.update).toHaveBeenCalledWith(params);
    });

    it('should set restricted pageStateManager to extension instance', () => {
      spyOn(pageManager, '_setRestrictedPageStateManager').and.stub();
      spyOn(extensionInstance, 'update').and.returnValue(extensionState);

      pageManager._getUpdatedExtensionsState();

      expect(pageManager._setRestrictedPageStateManager).toHaveBeenCalledWith(
        extensionInstance,
        extensionState
      );
    });

    it('should call extensions setPartialState method', () => {
      spyOn(extensionInstance, 'setPartialState').and.stub();
      spyOn(extensionInstance, 'update').and.returnValue(extensionState);

      pageManager._getUpdatedExtensionsState();

      expect(extensionInstance.setPartialState).toHaveBeenCalled();
    });

    it('should return extensions state together with active controller state', () => {
      spyOn(extensionInstance, 'update').and.returnValue({
        extension: 'extension'
      });
      spyOn(pageManager, '_setRestrictedPageStateManager').and.stub();

      let result = pageManager._getUpdatedExtensionsState(controllerState);

      expect(result).toEqual({
        controller: 'controller',
        share: 'controller',
        extension: 'extension'
      });
    });
  });

  describe('_deactivatePageSource method', () => {
    beforeEach(() => {
      spyOn(pageManager, '_deactivateController').and.stub();

      spyOn(pageManager, '_deactivateExtensions').and.stub();
    });

    it('should activate controller and extensions', () => {
      pageManager._managedPage.state.activated = true;

      pageManager._deactivatePageSource();

      expect(pageManager._deactivateController).toHaveBeenCalled();
      expect(pageManager._deactivateExtensions).toHaveBeenCalled();
    });

    it('should not call method activate more times', () => {
      pageManager._managedPage.state.activated = false;

      expect(pageManager._deactivateController).not.toHaveBeenCalled();
      expect(pageManager._deactivateExtensions).not.toHaveBeenCalled();
    });
  });

  describe('_deactivateController method', () => {
    it('should call deactivate method on controller', () => {
      spyOn(controllerInstance, 'deactivate').and.stub();

      pageManager._deactivateController();

      expect(controllerInstance.deactivate).toHaveBeenCalled();
    });
  });

  describe('_deactivateExtensions method', () => {
    it('should call deactivate method on extensions', () => {
      spyOn(extensionInstance, 'deactivate').and.stub();

      pageManager._deactivateExtensions();

      expect(extensionInstance.deactivate).toHaveBeenCalled();
    });
  });

  describe('_destroyPageSource method', () => {
    it('should destroy page resource', () => {
      spyOn(pageManager, '_destroyController').and.stub();
      spyOn(pageManager, '_destroyExtensions').and.stub();

      pageManager._destroyPageSource();

      expect(pageManager._destroyController).toHaveBeenCalledWith();
      expect(pageManager._destroyExtensions).toHaveBeenCalledWith();
    });
  });

  describe('_destroyController method', () => {
    it('should call destroy on controller instance', () => {
      spyOn(controllerInstance, 'destroy').and.stub();

      pageManager._destroyController();

      expect(controllerInstance.destroy).toHaveBeenCalled();
    });

    it('should unset pageStateManager to controller', () => {
      spyOn(controllerInstance, 'setPageStateManager').and.stub();

      pageManager._destroyController();

      expect(controllerInstance.setPageStateManager).toHaveBeenCalledWith(null);
    });
  });

  describe('_destroyExtensions method', () => {
    it('should call destroy on extension instance', () => {
      spyOn(extensionInstance, 'destroy').and.stub();

      pageManager._destroyExtensions();

      expect(extensionInstance.destroy).toHaveBeenCalled();
    });

    it('should unset pageStateManager to extension', () => {
      spyOn(extensionInstance, 'setPageStateManager').and.stub();

      pageManager._destroyExtensions();

      expect(extensionInstance.setPageStateManager).toHaveBeenCalledWith(null);
    });
  });

  describe('_hasOnlyUpdate method', () => {
    it('should return value from onlyUpdate function', () => {
      let newOptions = Object.assign({}, options, {
        onlyUpdate: () => true
      });

      spyOn(newOptions, 'onlyUpdate').and.callThrough();

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
    it('should call page renderer clearState method if route options documentView and managedRootView are same with last one renderred', () => {
      spyOn(pageRenderer, 'clearState').and.stub();

      pageManager._clearComponentState({
        documentView: null,
        managedRootView: null
      });

      expect(pageRenderer.clearState).toHaveBeenCalled();
    });

    it('should call page renderer unmount method if route options documentView and managedRootView are not same with last one renderred', () => {
      spyOn(pageRenderer, 'unmount').and.stub();

      pageManager._clearComponentState({});

      expect(pageRenderer.unmount).toHaveBeenCalled();
    });
  });

  describe('_onChangeStateHandler method', () => {
    it('should call setState', () => {
      let state = { state: 'state' };

      spyOn(pageRenderer, 'setState').and.stub();

      pageManager._onChangeStateHandler(state);

      expect(pageRenderer.setState).toHaveBeenCalledWith(state);
    });
  });
});
