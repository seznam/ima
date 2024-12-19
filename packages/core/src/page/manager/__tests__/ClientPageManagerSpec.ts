/**
 * @jest-environment jsdom
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */

import { toMockedInstance } from 'to-mock';

import { AbstractController } from '../../../controller/AbstractController';
import { Controller } from '../../../controller/Controller';
import { ControllerDecorator } from '../../../controller/ControllerDecorator';
import { Dispatcher } from '../../../event/Dispatcher';
import { DispatcherImpl } from '../../../event/DispatcherImpl';
import { EventBusImpl } from '../../../event/EventBusImpl';
import { Extension } from '../../../extension/Extension';
import { PageHandlerRegistry } from '../../../page/handler/PageHandlerRegistry';
import { PageNavigationHandler } from '../../../page/handler/PageNavigationHandler';
import { PageFactory } from '../../../page/PageFactory';
import { PageRenderer } from '../../../page/renderer/PageRenderer';
import { PageStateManager } from '../../../page/state/PageStateManager';
import { DynamicRoute } from '../../../router/DynamicRoute';
import { RouteFactory } from '../../../router/RouteFactory';
import { StaticRoute } from '../../../router/StaticRoute';
import { ClientWindow } from '../../../window/ClientWindow';
import { Window } from '../../../window/Window';
import { AbstractPageManager } from '../AbstractPageManager';
import { ClientPageManager } from '../ClientPageManager';

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

class ExtensionTest extends Extension {}

describe('ima.core.page.manager.ClientPageManager', () => {
  const routeName = 'link';
  const routePath = '/link';
  const pageFactory = {
    createController: () => new AbstractControllerTest(null),
    decorateController: (controller: Controller) => controller,
    decoratePageStateManager: (pageStateManger: PageStateManager) =>
      pageStateManger,
    createView: (view: unknown) => view,
  };
  let pageRenderer: PageRenderer;
  let pageStateManager: PageStateManager;
  let windowInterface: Window;
  let eventBusInterface: EventBusImpl;
  let pageManager: ClientPageManager;
  let handlerRegistry: PageHandlerRegistry;
  let route: StaticRoute | DynamicRoute;
  let routeFactory: RouteFactory;
  let dispatcher: Dispatcher;

  const View = () => {
    return;
  };

  const controllerInstance = pageFactory.createController();
  const decoratedController =
    pageFactory.decorateController(controllerInstance);
  const viewInstance = pageFactory.createView(View);
  const extensionInstance = new ExtensionTest();

  const options = {
    autoScroll: true,
    documentView: null,
    managedRootView: null,
    onlyUpdate: false,
    viewAdapter: null,
    middlewares: [],
  };
  const params = {
    param1: 'param1',
    param2: 2,
  };
  const data = {
    content: '',
  };
  const event = {
    detail: {
      eventName: 'method',
      data: data,
    },
  };

  beforeEach(() => {
    const pageManagerHandler = toMockedInstance(PageNavigationHandler);
    pageRenderer = new PageRendererMock();
    pageStateManager = new PageStateManagerMock();
    windowInterface = new ClientWindow();
    eventBusInterface = new EventBusImpl(windowInterface);
    handlerRegistry = new PageHandlerRegistry(pageManagerHandler);
    routeFactory = new RouteFactory();
    dispatcher = new DispatcherImpl();

    pageManager = new ClientPageManager(
      pageFactory as unknown as PageFactory,
      pageRenderer,
      pageStateManager,
      handlerRegistry,
      dispatcher,
      windowInterface,
      eventBusInterface
    );

    route = routeFactory.createRoute(
      routeName,
      routePath,
      Controller,
      View,
      options
    );

    pageManager['_previousManagedPage'] =
      pageManager['_getInitialManagedPage']();
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

    (
      jest.spyOn(controllerInstance, 'getExtensions') as jest.SpyInstance
    ).mockReturnValue([extensionInstance]);
  });

  it('should be listening for all custom events', () => {
    jest.spyOn(eventBusInterface, 'listenAll').mockImplementation();

    pageManager.init();

    expect(eventBusInterface.listenAll).toHaveBeenCalledWith(
      window,
      pageManager['_boundOnCustomEventHandler']
    );
  });

  it('should be observe state manager', () => {
    pageManager.init();

    expect(pageStateManager.onChange).toBeDefined();
  });

  it('should return parsed custom event', () => {
    expect(pageManager._parseCustomEvent(event as CustomEvent)).toStrictEqual({
      prefix: '',
      method: 'onMethod',
      eventName: 'method',
      data: data,
    });
  });

  it('should unlisten for all custom events', async () => {
    jest.spyOn(eventBusInterface, 'unlistenAll').mockImplementation();

    await pageManager.destroy();

    expect(eventBusInterface.unlistenAll).toHaveBeenCalledWith(
      window,
      pageManager['_boundOnCustomEventHandler']
    );
  });

  describe('_onCustomEventHandler method', () => {
    const parsedCustomEvent = {
      prefix: '',
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

      pageManager._onCustomEventHandler(event as CustomEvent);

      expect(console.warn).not.toHaveBeenCalled();
      expect(pageManager._handleEventWithExtensions).not.toHaveBeenCalledWith(
        parsedCustomEvent.prefix,
        parsedCustomEvent.method,
        parsedCustomEvent.data
      );
      expect(pageManager._handleEventWithController).toHaveBeenCalledWith(
        parsedCustomEvent.prefix,
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

      pageManager._onCustomEventHandler(event as CustomEvent);

      expect(console.warn).not.toHaveBeenCalled();
      expect(pageManager._handleEventWithExtensions).toHaveBeenCalledWith(
        parsedCustomEvent.prefix,
        parsedCustomEvent.method,
        parsedCustomEvent.data
      );
      expect(pageManager._handleEventWithController).toHaveBeenCalledWith(
        parsedCustomEvent.prefix,
        parsedCustomEvent.method,
        parsedCustomEvent.data
      );
    });

    it("should throw error because active controller and their extensions haven't defined event listener", () => {
      pageManager._onCustomEventHandler(event as CustomEvent);

      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('manage method', () => {
    it('should activate page source after loading all resources', async () => {
      jest
        .spyOn(pageManager, '_activatePageSource' as never)
        .mockImplementation();
      //@ts-ignore
      jest
        .spyOn(AbstractPageManager.prototype, 'manage')
        .mockReturnValue(Promise.resolve({ status: 200 }));

      await pageManager
        .manage({
          route,
          options,
        })
        .then(() => {
          expect(pageManager['_activatePageSource']).toHaveBeenCalled();
        });
    });
  });

  describe('_handleEventWithController method', () => {
    beforeEach(() => {
      // @ts-ignore
      Object.prototype.constructor.$name = undefined;
    });

    it('should return false for undefined method on controller', () => {
      expect(
        pageManager._handleEventWithController('', 'onMethod', {})
      ).toBeFalsy();
    });

    it('should return false for undefined method on controller with prefix', () => {
      // @ts-ignore
      pageManager['_managedPage'].controllerInstance = {
        onMethod: () => {
          return;
        },
      };
      (
        pageManager['_managedPage'].controllerInstance!
          .constructor as typeof Controller
      ).$name = 'CustomController';

      expect(
        pageManager._handleEventWithController('', 'onMethod', {})
      ).toBeFalsy();
    });

    it('should call method on controller and return true', () => {
      // @ts-ignore
      pageManager['_managedPage'].controllerInstance = {
        onMethod: () => {
          return;
        },
      };

      jest
        // @ts-ignore
        .spyOn(pageManager['_managedPage'].controllerInstance, 'onMethod')
        // @ts-ignore
        .mockImplementation();

      expect(
        pageManager._handleEventWithController('', 'onMethod', data)
      ).toBeTruthy();
      expect(
        (pageManager['_managedPage'].controllerInstance as Controller).onMethod
      ).toHaveBeenCalledWith(data);
    });

    it('should call method on controller with prefix and return true', () => {
      // @ts-ignore
      pageManager['_managedPage'].controllerInstance = {
        onMethod: () => {
          return;
        },
      };
      (
        pageManager['_managedPage'].controllerInstance!
          .constructor as typeof Controller
      ).$name = 'CustomController';

      jest
        // @ts-ignore
        .spyOn(pageManager['_managedPage'].controllerInstance, 'onMethod')
        // @ts-ignore
        .mockImplementation();

      expect(
        pageManager._handleEventWithController(
          'CustomController',
          'onMethod',
          data
        )
      ).toBeTruthy();
      expect(
        (pageManager['_managedPage'].controllerInstance as Controller).onMethod
      ).toHaveBeenCalledWith(data);
    });
  });

  describe('_handleEventWithExtensions method', () => {
    beforeEach(() => {
      // @ts-ignore
      Object.prototype.constructor.$name = undefined;
    });

    it('should return false for undefined method on extensions', () => {
      expect(
        pageManager._handleEventWithExtensions('', 'onMethod', {})
      ).toBeFalsy();
    });

    it('should call method on someone extension and return true', () => {
      const dumpExtensionInstance = {
        onMethod: () => {
          return;
        },
      };
      pageManager['_managedPage'].controllerInstance = {
        // @ts-ignore
        getExtensions: () => {
          return [dumpExtensionInstance];
        },
      };

      jest.spyOn(dumpExtensionInstance, 'onMethod').mockImplementation();

      expect(
        pageManager._handleEventWithExtensions('', 'onMethod', data)
      ).toBeTruthy();
      expect(dumpExtensionInstance.onMethod).toHaveBeenCalledWith(data);
    });

    it('should call method on extension with prefix and return true', () => {
      const dumpExtensionInstance = {
        onMethod: () => {
          return;
        },
      };
      const dumpExtensionInstanceWithPrefix = new (class {
        static $name = 'CustomExtension';

        onMethod() {
          return;
        }
      })();

      pageManager['_managedPage'].controllerInstance = {
        // @ts-ignore
        getExtensions: () => {
          return [dumpExtensionInstance, dumpExtensionInstanceWithPrefix];
        },
      };

      jest.spyOn(dumpExtensionInstance, 'onMethod').mockImplementation();
      jest
        .spyOn(dumpExtensionInstanceWithPrefix, 'onMethod')
        .mockImplementation();

      expect(
        pageManager._handleEventWithExtensions(
          'CustomExtension',
          'onMethod',
          data
        )
      ).toBeTruthy();
      expect(dumpExtensionInstance.onMethod).not.toHaveBeenCalled();
      expect(dumpExtensionInstanceWithPrefix.onMethod).toHaveBeenCalledWith(
        data
      );
    });
  });

  describe('_onChangeStateHandler method', () => {
    it('should call setState', () => {
      const state = { state: 'state' };

      jest.spyOn(pageRenderer, 'setState').mockImplementation();

      pageManager['_onChangeStateHandler'](state);

      expect(pageRenderer.setState).toHaveBeenCalledWith(state);
    });
  });
});
