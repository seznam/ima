import Controller from 'src/controller/Controller';
import EventBus from 'src/event/EventBus';
import Extension from 'src/extension/Extension';
import PageHandler from 'src/page/handler/PageHandler';
import PageHandlerRegistry from 'src/page/handler/PageHandlerRegistry';
import ClientPageManager from '../ClientPageManager';
import PageRenderer from 'src/page/renderer/PageRenderer';
import PageStateManager from 'src/page/state/PageStateManager';
import Window from 'src/window/Window';
import { toMockedInstance } from 'to-mock';

describe('ima.core.page.manager.ClientPageManager', () => {
  let pageFactory = {
    createController: Controller => new Controller(),
    decorateController: controller => controller,
    decoratePageStateManager: pageStateManger => pageStateManger,
    createView: view => view,
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
    documentView: null,
  };
  let params = {
    param1: 'param1',
    param2: 2,
  };
  let data = {
    content: '',
  };
  let event = {
    detail: {
      eventName: 'method',
      data: data,
    },
  };

  beforeEach(() => {
    let pageManagerHandler = toMockedInstance(PageHandler);
    pageRenderer = new PageRenderer();
    pageStateManager = new PageStateManager();
    windowInterface = new Window();
    eventBusInterface = new EventBus();
    handlerRegistry = new PageHandlerRegistry(pageManagerHandler);

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

    jest
      .spyOn(controllerInstance, 'getExtensions')
      .mockReturnValue([extensionInstance]);
  });

  it('should be listening for all custom events', () => {
    let window = {};

    jest.spyOn(eventBusInterface, 'listenAll').mockImplementation();
    jest.spyOn(windowInterface, 'getWindow').mockReturnValue(window);

    pageManager.init();

    expect(eventBusInterface.listenAll).toHaveBeenCalledWith(
      window,
      pageManager._boundOnCustomEventHandler
    );
  });

  it('should return parsed custom event', () => {
    expect(pageManager._parseCustomEvent(event)).toStrictEqual({
      method: 'onMethod',
      eventName: 'method',
      data: data,
    });
  });

  it('should unlisten for all custom events', async () => {
    let window = {};

    jest.spyOn(eventBusInterface, 'unlistenAll').mockImplementation();
    jest.spyOn(windowInterface, 'getWindow').mockReturnValue(window);

    await pageManager.destroy();

    expect(eventBusInterface.unlistenAll).toHaveBeenCalledWith(
      window,
      pageManager._boundOnCustomEventHandler
    );
  });

  describe('_onCustomEventHandler method', () => {
    let parsedCustomEvent = {
      method: 'onMethod',
      data: {},
      eventName: 'method',
    };

    beforeEach(() => {
      jest
        .spyOn(pageManager, '_parseCustomEvent')
        .mockReturnValue(parsedCustomEvent);

      jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should handle event only with controller', () => {
      jest
        .spyOn(pageManager, '_handleEventWithController')
        .mockReturnValue(true);

      jest
        .spyOn(pageManager, '_handleEventWithExtensions')
        .mockImplementation();

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
      jest
        .spyOn(pageManager, '_handleEventWithController')
        .mockReturnValue(false);

      jest
        .spyOn(pageManager, '_handleEventWithExtensions')
        .mockReturnValue(true);

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
  });

  describe('manage method', () => {
    it('should activate page source after loading all resources', done => {
      jest.spyOn(pageManager, '_activatePageSource').mockImplementation();
      jest
        .spyOn(pageManager.__proto__.__proto__, 'manage')
        .mockReturnValue(Promise.resolve({}));

      pageManager
        .manage(null, null, {}, {})
        .then(() => {
          expect(pageManager._activatePageSource).toHaveBeenCalled();
          done();
        })
        .catch(error => {
          console.error('ima.core.page.manager.Client: CATCH ERROR: ', error);
          done(error);
        });
    });
  });

  describe('_handleEventWithController method', () => {
    it('should return false for undefined method on controller', () => {
      expect(
        pageManager._handleEventWithController('onMethod', {})
      ).toBeFalsy();
    });

    it('should call method on controller and return true', () => {
      pageManager._managedPage.controllerInstance = {
        onMethod: () => {},
      };

      jest
        .spyOn(pageManager._managedPage.controllerInstance, 'onMethod')
        .mockImplementation();

      expect(
        pageManager._handleEventWithController('onMethod', data)
      ).toBeTruthy();
      expect(
        pageManager._managedPage.controllerInstance.onMethod
      ).toHaveBeenCalledWith(data);
    });
  });

  describe('_handleEventWithExtensions method', () => {
    it('should return false for undefined method on extensions', () => {
      expect(
        pageManager._handleEventWithExtensions('onMethod', {})
      ).toBeFalsy();
    });

    it('should call method on someone extension and return true', () => {
      let dumpExtensionInstance = {
        onMethod: () => {},
      };
      pageManager._managedPage.controllerInstance = {
        getExtensions: () => {
          return [dumpExtensionInstance];
        },
      };

      jest.spyOn(dumpExtensionInstance, 'onMethod').mockImplementation();

      expect(
        pageManager._handleEventWithExtensions('onMethod', data)
      ).toBeTruthy();
      expect(dumpExtensionInstance.onMethod).toHaveBeenCalledWith(data);
    });
  });
});
