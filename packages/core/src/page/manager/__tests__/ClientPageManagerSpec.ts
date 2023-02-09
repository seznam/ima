/**
 * @jest-environment jsdom
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jest/no-conditional-expect */

import { toMockedInstance } from 'to-mock';
import AbstractController from '../../../controller/AbstractController';
import ClientPageManager from '../ClientPageManager';
import ClientWindow from '../../../window/ClientWindow';
import Controller, { IController } from '../../../controller/Controller';
import ControllerDecorator from '../../../controller/ControllerDecorator';
import DynamicRoute from '../../../router/DynamicRoute';
import EventBusImpl from '../../../event/EventBusImpl';
import Extension from '../../../extension/Extension';
import PageFactory from '../../../page/PageFactory';
import PageHandlerRegistry from '../../../page/handler/PageHandlerRegistry';
import PageRenderer from '../../../page/renderer/PageRenderer';
import PageStateManager from '../../../page/state/PageStateManager';
import RouteFactory from '../../../router/RouteFactory';
import StaticRoute from '../../../router/StaticRoute';
import Window from '../../../window/Window';
import PageNavigationHandler from '../../../page/handler/PageNavigationHandler';

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
    decorateController: (controller: IController) => controller,
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

    pageManager = new ClientPageManager(
      pageFactory as unknown as PageFactory,
      pageRenderer,
      pageStateManager,
      handlerRegistry,
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

    pageManager['_clearManagedPageValue']();

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

      pageManager._onCustomEventHandler(event as CustomEvent);

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
      pageManager._onCustomEventHandler(event as CustomEvent);

      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('manage method', () => {
    it('should activate page source after loading all resources', async () => {
      jest
        .spyOn(pageManager, '_activatePageSource' as never)
        .mockImplementation();
      jest
        .spyOn(pageManager, 'manage')
        .mockReturnValue(Promise.resolve({ status: 200 }));

      await pageManager
        .manage({
          route,
          controller: controllerInstance,
          view: viewInstance,
          options,
        })
        .then(() => {
          expect(pageManager['_activatePageSource']).toHaveBeenCalled();
        })
        .catch(error => {
          console.error('ima.core.page.manager.Client: CATCH ERROR: ', error);
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
        pageManager._handleEventWithController('onMethod', data)
      ).toBeTruthy();
      expect(
        (pageManager['_managedPage'].controllerInstance as Controller).onMethod
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
        pageManager._handleEventWithExtensions('onMethod', data)
      ).toBeTruthy();
      expect(dumpExtensionInstance.onMethod).toHaveBeenCalledWith(data);
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
