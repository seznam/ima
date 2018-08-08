import Controller from 'controller/Controller';
import EventBus from 'event/EventBus';
import Extension from 'extension/Extension';
import HandlerRegistry from 'page/handler/HandlerRegistry';
import ClientPageManager from 'page/manager/ClientPageManager';
import PageRenderer from 'page/renderer/PageRenderer';
import PageStateManager from 'page/state/PageStateManager';
import Window from 'window/Window';

describe('ima.page.manager.ClientPageManager', () => {
  let pageFactory = {
    createController: Controller => new Controller(),
    decorateController: controller => controller,
    decoratePageStateManager: pageStateManger => pageStateManger,
    createView: view => view
  };
  let pageRenderer = null;
  let pageStateManager = null;
  let windowInterface = null;
  let eventBusInterface = null;
  let pageManager = null;
  let handlerRegistry = null;

  let View = () => {};

  let controllerInstance = pageFactory.createController(Controller);
  let decoratedController = pageFactory.decorateController(controllerInstance);
  let viewInstance = pageFactory.createView(View);
  let extensionInstance = new Extension();

  let options = {
    onlyUpdate: false,
    autoScroll: true,
    allowSPA: true,
    documentView: null
  };
  let params = {
    param1: 'param1',
    param2: 2
  };
  let data = {
    content: ''
  };
  let event = {
    detail: {
      eventName: 'method',
      data: data
    }
  };

  beforeEach(() => {
    let pageManagerHandler = {
      handlePreManagedState: jest.fn(() => true),
      handlePostManagedState: jest.fn(() => true)
    };
    pageRenderer = new PageRenderer();
    pageStateManager = new PageStateManager();
    windowInterface = new Window();
    eventBusInterface = new EventBus();
    handlerRegistry = new HandlerRegistry(pageManagerHandler);

    pageManager = new ClientPageManager(
      pageFactory,
      pageRenderer,
      pageStateManager,
      handlerRegistry,
      windowInterface,
      eventBusInterface
    );

    pageManager._clearManagedPageValue();

    pageManager._managedPage = pageManager._constructManagedPageValue(
      Controller,
      View,
      options,
      params,
      controllerInstance,
      decoratedController,
      viewInstance
    );

    spyOn(controllerInstance, 'getExtensions').and.returnValue([
      extensionInstance
    ]);
  });

  it('should be listening for all custom events', () => {
    let window = {};

    spyOn(eventBusInterface, 'listenAll').and.stub();
    spyOn(windowInterface, 'getWindow').and.returnValue(window);

    pageManager.init();

    expect(eventBusInterface.listenAll).toHaveBeenCalledWith(
      window,
      pageManager._boundOnCustomEventHandler
    );
  });

  it('should return parsed custom event', () => {
    expect(pageManager._parseCustomEvent(event)).toEqual({
      method: 'onMethod',
      eventName: 'method',
      data: data
    });
  });

  it('should unlisten for all custom events', () => {
    let window = {};

    spyOn(eventBusInterface, 'unlistenAll').and.stub();
    spyOn(windowInterface, 'getWindow').and.returnValue(window);

    pageManager.destroy();

    expect(eventBusInterface.unlistenAll).toHaveBeenCalledWith(
      window,
      pageManager._boundOnCustomEventHandler
    );
  });

  describe('_onCustomEventHanler method', () => {
    let parsedCustomEvent = {
      method: 'onMethod',
      data: {},
      eventName: 'method'
    };

    beforeEach(() => {
      spyOn(pageManager, '_parseCustomEvent').and.returnValue(
        parsedCustomEvent
      );

      spyOn(console, 'warn').and.stub();
    });

    it('should do nothing if active controller is null', () => {
      pageManager._managedPage.controllerInstance = null;

      pageManager._onCustomEventHandler(event);

      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should handle event only with controller', () => {
      spyOn(pageManager, '_handleEventWithController').and.returnValue(true);

      spyOn(pageManager, '_handleEventWithExtensions').and.stub();

      pageManager._onCustomEventHandler(event);

      expect(console.warn).not.toHaveBeenCalled();
      expect(pageManager._handleEventWithExtensions).not.toHaveBeenCalledWith(
        parsedCustomEvent.method,
        parsedCustomEvent.data
      );
      expect(pageManager._handleEventWithController).toHaveBeenCalledWith(
        parsedCustomEvent.method,
        parsedCustomEvent.data
      );
    });

    it('should handle event with some extension', () => {
      spyOn(pageManager, '_handleEventWithController').and.returnValue(false);

      spyOn(pageManager, '_handleEventWithExtensions').and.returnValue(true);

      pageManager._onCustomEventHandler(event);

      expect(console.warn).not.toHaveBeenCalled();
      expect(pageManager._handleEventWithExtensions).toHaveBeenCalledWith(
        parsedCustomEvent.method,
        parsedCustomEvent.data
      );
      expect(pageManager._handleEventWithController).toHaveBeenCalledWith(
        parsedCustomEvent.method,
        parsedCustomEvent.data
      );
    });

    it("should throw error because active controller and their extensions haven't defined event listener", () => {
      pageManager._onCustomEventHandler(event);

      expect(console.warn).toHaveBeenCalled();
    });

    it('should do nothing if active controller is null', () => {
      pageManager._managedPage.controllerInstance = null;

      pageManager._onCustomEventHandler(event);

      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('manage method', () => {
    it('should activate page source after loading all resources', done => {
      spyOn(pageManager, '_activatePageSource').and.stub();
      spyOn(pageManager.__proto__.__proto__, 'manage').and.returnValue(
        Promise.resolve({})
      );

      pageManager
        .manage(null, null, {}, {})
        .then(() => {
          expect(pageManager._activatePageSource).toHaveBeenCalled();
          done();
        })
        .catch(error => {
          console.error('ima.page.manager.Client: CATCH ERROR: ', error);
          done(error);
        });
    });
  });

  describe('_handleEventWithController method', () => {
    it('should return false for undefined method on controller', () => {
      expect(pageManager._handleEventWithController('onMethod', {})).toEqual(
        false
      );
    });

    it('should call method on controller and return true', () => {
      pageManager._managedPage.controllerInstance = {
        onMethod: () => {}
      };

      spyOn(pageManager._managedPage.controllerInstance, 'onMethod').and.stub();

      expect(pageManager._handleEventWithController('onMethod', data)).toEqual(
        true
      );
      expect(
        pageManager._managedPage.controllerInstance.onMethod
      ).toHaveBeenCalledWith(data);
    });
  });

  describe('_handleEventWithExtensions method', () => {
    it('should return false for undefined method on extensions', () => {
      expect(pageManager._handleEventWithExtensions('onMethod', {})).toEqual(
        false
      );
    });

    it('should call method on someone extension and return true', () => {
      let dumpExtensionInstance = {
        onMethod: () => {}
      };
      pageManager._managedPage.controllerInstance = {
        getExtensions: () => {
          return [dumpExtensionInstance];
        }
      };

      spyOn(dumpExtensionInstance, 'onMethod').and.stub();

      expect(pageManager._handleEventWithExtensions('onMethod', data)).toEqual(
        true
      );
      expect(dumpExtensionInstance.onMethod).toHaveBeenCalledWith(data);
    });
  });
});
