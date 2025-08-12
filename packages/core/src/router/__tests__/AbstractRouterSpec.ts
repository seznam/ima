import { toMockedInstance } from 'to-mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GenericError } from '../../error/GenericError';
import { DispatcherImpl } from '../../event/DispatcherImpl';
import { PageManager } from '../../page/manager/PageManager';
import { AbstractRoute } from '../AbstractRoute';
import { AbstractRouter } from '../AbstractRouter';
import { ActionTypes } from '../ActionTypes';
import { RouteFactory } from '../RouteFactory';
import { RouteNames } from '../RouteNames';
import { RouteAction } from '../Router';
import { RouterEvents } from '../RouterEvents';

class MockedAbstractRouter extends AbstractRouter {
  getPath = vi.fn();
  listen = vi.fn();
  redirect = vi.fn();
  unlisten = vi.fn();
}

class MockedPageManager extends PageManager {
  init = vi.fn();
  destroy = vi.fn();
  manage = vi.fn();
}

describe('ima.core.router.AbstractRouter', () => {
  let router: MockedAbstractRouter;
  const pageManager = new MockedPageManager();
  let routeFactory = toMockedInstance(RouteFactory);
  const dispatcher = toMockedInstance(DispatcherImpl);
  const config = {
    $Protocol: 'http:',
    $Root: '/root',
    $LanguagePartPath: '',
    $Host: 'www.domain.com',
  };
  const options = {
    onlyUpdate: false,
    autoScroll: true,
    documentView: null,
    managedRootView: null,
    viewAdapter: null,
    middlewares: [],
  };
  const globalMiddleware = vi.fn();
  const homeRouteMiddleware = vi.fn();
  const action: RouteAction = {
    type: ActionTypes.REDIRECT,
  };
  const errorAction = {
    type: ActionTypes.ERROR,
    url: 'http://www.domain.com/root/currentRoutePath',
  };
  const currentRoutePath = '/currentRoutePath';
  const Controller = function Controller() {
    return {};
  };
  const View = function View() {
    return {};
  };
  const redirectAction = {
    type: ActionTypes.ERROR,
    url: 'http://www.domain.com/root/user/2345',
  };

  beforeEach(() => {
    routeFactory = new RouteFactory();
    router = new MockedAbstractRouter(
      pageManager,
      routeFactory,
      dispatcher,
      30000
    );

    vi.spyOn(router, 'getPath').mockReturnValue(currentRoutePath);

    router.init(config);

    router.use(globalMiddleware);
    router.add('home', '/', Controller, View, {
      middlewares: [homeRouteMiddleware],
    });
    router.add('contact', '/contact', Controller, View, options);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should have 2 routes in Array and 1 global middleware', () => {
    expect(router['_routeHandlers'].size).toBe(3);
  });

  it('should remove path from router', () => {
    router.remove('home');

    expect(router['_routeHandlers'].size).toBe(2);
  });

  it('should return absolute current url', () => {
    expect(router.getUrl()).toBe('http://www.domain.com/root/currentRoutePath');
  });

  it('should return base url of application', () => {
    expect(router.getBaseUrl()).toBe('http://www.domain.com/root');
  });

  it('should return route and middlewares in line for defined path', () => {
    const { route, middlewares } = router.getRouteHandlersByPath('/');

    expect((route as InstanceType<typeof AbstractRoute>).getName()).toBe(
      'home'
    );
    expect(middlewares).toHaveLength(1);
  });

  describe('add method', () => {
    it('should be throw error if you try add route with exists name', () => {
      expect(() => {
        router.add('home', '/home', Controller, View, options);
      }).toThrow();
    });

    it('should create new ima.core.Route', () => {
      vi.spyOn(routeFactory, 'createRoute');

      router.add('routeName', '/newRoutePath', Controller, View, options);

      expect(routeFactory.createRoute).toHaveBeenCalledWith(
        'routeName',
        '/newRoutePath',
        Controller,
        View,
        options
      );
    });
  });

  describe('use method', () => {
    it('should add new ima.core.router.RouterMiddleware', () => {
      vi.spyOn(router['_routeHandlers'], 'set');

      router.use(globalMiddleware);

      expect(router['_routeHandlers'].set).toHaveBeenCalledWith(
        'middleware-1',
        globalMiddleware
      );
    });
  });

  describe('getCurrentRouteInfo method', () => {
    const routeName = 'link';
    const path = '/link';
    let route: InstanceType<typeof AbstractRoute>;
    const params = {};

    beforeEach(() => {
      route = routeFactory.createRoute(
        routeName,
        path,
        Controller,
        View,
        options
      );
    });

    it('should throw error for not existing route', () => {
      router.getPath.mockReturnValue(null);

      expect(() => {
        router.getCurrentRouteInfo();
      }).toThrow();
    });

    it('should return current route information', () => {
      router.getPath.mockReturnValue(path);
      vi.spyOn(router, 'getRouteHandlersByPath').mockReturnValue({
        route,
        middlewares: [],
      });
      vi.spyOn(route, 'extractParameters').mockReturnValue(params);

      expect(router.getCurrentRouteInfo()).toStrictEqual({
        route,
        params,
        path,
      });
    });
  });

  describe('link method', () => {
    const routeName = 'link';
    const path = '/link';
    const baseUrl = 'baseUrl';

    beforeEach(() => {
      router.add(routeName, path, Controller, View, options);
    });

    afterEach(() => {
      router.remove(routeName);
    });

    it('should return link for valid route with params', () => {
      vi.spyOn(router, 'getBaseUrl').mockReturnValue(baseUrl);

      expect(router.link(routeName, {})).toBe(baseUrl + path);
    });

    it('should throw Error for not valid route with params', () => {
      vi.spyOn(router['_routeHandlers'], 'has').mockReturnValue(false);

      expect(() => {
        router.link('xxx', {});
      }).toThrow();
    });
  });

  describe('route method', () => {
    const routeName = 'link';
    const path = '/link';
    let route: InstanceType<typeof AbstractRoute>;
    const routeMiddleware = vi.fn();

    beforeEach(() => {
      route = routeFactory.createRoute(routeName, path, Controller, View, {
        middlewares: [routeMiddleware],
      });
    });

    it('should handle valid route path', async () => {
      vi.spyOn(router, 'getRouteHandlersByPath').mockReturnValue({
        route,
        middlewares: [],
      });

      vi.spyOn(router, '_handle').mockImplementation();

      vi.spyOn(route, 'extractParameters');

      await router.route(path, options, action);

      expect(route.extractParameters).toHaveBeenCalled();
      expect(router['_currentlyRoutedPath']).toBe(path);
      expect(router._handle).toHaveBeenCalledWith(route, {}, options, action);
    });

    it('should handle valid route path with middlewares', async () => {
      const middlewaresMock = [globalMiddleware];
      vi.spyOn(router, 'getRouteHandlersByPath').mockReturnValue({
        route,
        middlewares: middlewaresMock,
      });

      vi.spyOn(router, '_handle').mockImplementation();
      vi.spyOn(router, '_runMiddlewares');

      vi.spyOn(route, 'extractParameters');

      await router.route(path, options, action);

      expect(route.extractParameters).toHaveBeenCalled();
      expect(router['_currentlyRoutedPath']).toBe(path);
      expect(router._handle).toHaveBeenCalledWith(route, {}, options, action);
      expect(router._runMiddlewares).toHaveBeenNthCalledWith(
        1,
        middlewaresMock,
        {},
        { route, action }
      );
      expect(router._runMiddlewares).toHaveBeenNthCalledWith(
        2,
        [routeMiddleware],
        {},
        { route, action }
      );
    });

    it('should handle "not-found" route', async () => {
      // @ts-expect-error
      vi.spyOn(router, 'getRouteHandlersByPath').mockReturnValue({});

      vi.spyOn(router, 'handleNotFound').mockImplementation(params => {
        return Promise.resolve(params);
      });

      await router.route(path).then(params => {
        // @ts-expect-error
        expect(params.error instanceof GenericError).toBe(true);
      });
    });
  });

  describe('handleError method', () => {
    const path = '/error';
    let route: InstanceType<typeof AbstractRoute>;
    let originalRoute: InstanceType<typeof AbstractRoute>;
    const routeMiddleware = vi.fn();

    beforeEach(() => {
      route = routeFactory.createRoute(
        RouteNames.ERROR,
        path,
        Controller,
        View,
        {
          ...options,
          middlewares: [routeMiddleware],
        }
      );

      originalRoute = routeFactory.createRoute(
        'user',
        '/user/:userId',
        Controller,
        View
      );

      router['_currentlyRoutedPath'] = '/user/2345';
    });

    it('should handle "error" route', async () => {
      const params = { error: new GenericError('test') };

      vi.spyOn(router['_routeHandlers'], 'get').mockReturnValue(route);
      vi.spyOn(router, 'getRouteHandlersByPath').mockReturnValue({
        route: originalRoute,
        middlewares: [],
      });
      vi.spyOn(router, '_runMiddlewares');

      vi.spyOn(router, '_handle').mockReturnValue(
        Promise.resolve({
          content: '',
          status: 200,
          error: params.error,
        })
      );

      await router
        .handleError(params, options)
        .then(response => {
          expect(router._handle).toHaveBeenCalledWith(
            route,
            expect.objectContaining({
              ...params,
              userId: '2345',
            }),
            options,
            errorAction
          );
          // @ts-expect-error
          expect(response.error).toStrictEqual(params.error);
          expect(router._runMiddlewares).toHaveBeenCalledWith(
            [globalMiddleware, routeMiddleware],
            expect.objectContaining({
              ...params,
              userId: '2345',
            }),
            { route, action: errorAction }
          );
        })
        .catch(error => {
          console.error('ima.core.router.AbstractRouter.handleError', error);
        });
    });

    it('should reject promise with error for undefined "error" route', async () => {
      const params = { error: new GenericError('test') };

      vi.spyOn(router['_routeHandlers'], 'get').mockReturnValue(undefined);

      await router.handleError(params).catch(reason => {
        expect(reason instanceof GenericError).toBe(true);
      });
    });
  });

  describe('handleNotFound method', () => {
    const path = '/not-found';
    let route: InstanceType<typeof AbstractRoute>;
    let originalRoute: InstanceType<typeof AbstractRoute>;
    const routeMiddleware = vi.fn();

    beforeEach(() => {
      route = routeFactory.createRoute(
        RouteNames.NOT_FOUND,
        path,
        Controller,
        View,
        {
          ...options,
          middlewares: [routeMiddleware],
        }
      );

      originalRoute = routeFactory.createRoute(
        'user',
        '/user/:userId',
        Controller,
        View
      );

      router['_currentlyRoutedPath'] = '/user/2345';
    });

    it('should handle "notFound" route', async () => {
      const params = { error: new GenericError('test') };

      vi.spyOn(router['_routeHandlers'], 'get').mockReturnValue(route);
      vi.spyOn(router, 'getRouteHandlersByPath').mockReturnValue({
        route: originalRoute,
        middlewares: [],
      });
      vi.spyOn(router, '_runMiddlewares');

      vi.spyOn(router, '_handle').mockReturnValue(
        Promise.resolve({
          content: '',
          status: 200,
          error: params.error,
        })
      );

      await router
        .handleNotFound(params, options)
        .then(response => {
          expect(router._handle).toHaveBeenCalledWith(
            route,
            expect.objectContaining({
              ...params,
              userId: '2345',
            }),
            options,
            redirectAction
          );
          // @ts-expect-error
          expect(response.error instanceof GenericError).toBeTruthy();
          expect(router._runMiddlewares).toHaveBeenCalledWith(
            [globalMiddleware, routeMiddleware],
            expect.objectContaining({
              ...params,
              userId: '2345',
            }),
            { route, action: redirectAction }
          );
        })
        .catch(error => {
          console.error('ima.core.router.AbstractRouter.handleNotFound', error);
        });
    });

    it('should reject promise with error for undefined "error" route', async () => {
      const params = { error: new GenericError('test') };

      vi.spyOn(router['_routeHandlers'], 'get').mockReturnValue(undefined);

      await router.handleNotFound(params).catch(reason => {
        expect(reason instanceof GenericError).toBe(true);
      });
    });
  });

  describe('isClientError method', () => {
    it('should return true for client error, which return status 4**', () => {
      const isClientError = router.isClientError(
        new GenericError('Client error', { status: 404 })
      );

      expect(isClientError).toBeTruthy();
    });

    it('should return false for client error, which return status 5**', () => {
      const isClientError = router.isClientError(
        new GenericError('Server error', { status: 500 })
      );

      expect(isClientError).toBeFalsy();
    });

    it('should return false for any error', () => {
      const isClientError = router.isClientError(new Error('some error'));

      expect(isClientError).toBeFalsy();
    });
  });

  describe('isRedirection method', () => {
    it('should return true for redirection, which return status 3**', () => {
      const isRedirection = router.isRedirection(
        new GenericError('Redirection', {
          status: 300,
          url: 'http://www.example.com/redirect',
        })
      );

      expect(isRedirection).toBeTruthy();
    });

    it('should return true for client error, which return status 4**', () => {
      const isRedirection = router.isRedirection(
        new GenericError('Client error', { status: 400 })
      );

      expect(isRedirection).toBeFalsy();
    });

    it('should return false for any error', () => {
      const isClientError = router.isClientError(new Error('some error'));

      expect(isClientError).toBeFalsy();
    });
  });

  describe('_handle method', () => {
    const routeName = 'routeName';
    const routePath = '/routePath';
    let route: InstanceType<typeof AbstractRoute>;

    beforeEach(() => {
      route = routeFactory.createRoute(
        routeName,
        routePath,
        Controller,
        View,
        options,
        []
      );
      vi.spyOn(router, '_getCurrentlyRoutedPath').mockReturnValue(routePath);
    });

    it('should call preManage', async () => {
      vi.spyOn(pageManager, 'preManage');
      vi.spyOn(pageManager, 'manage').mockReturnValue(
        Promise.resolve({ content: null, status: 200 })
      );

      await router._handle(route, {}, {}, action).then(() => {
        expect(pageManager.manage).toHaveBeenCalledWith({
          route,
          options,
          params: {},
          action,
        });
      });

      expect(pageManager['preManage']).toHaveBeenCalled();
    });

    it('should call postManage', async () => {
      vi.spyOn(pageManager, 'preManage');
      vi.spyOn(pageManager, 'postManage');
      vi.spyOn(pageManager, 'manage').mockReturnValue(
        Promise.resolve({ content: null, status: 409 })
      );

      await router._handle(route, {}, {}, action).then(() => {
        expect(pageManager.manage).toHaveBeenCalledWith({
          route,
          options,
          params: {},
          action,
        });
      });

      expect(pageManager['postManage']).toHaveBeenCalled();
    });

    it('should call page manager', async () => {
      router.getPath.mockReturnValue(routePath);
      vi.spyOn(pageManager, 'manage').mockReturnValue(
        Promise.resolve({ content: null, status: 200 })
      );
      vi.spyOn(dispatcher, 'fire').mockImplementation();

      await router._handle(route, {}, {}, action).then(() => {
        expect(pageManager.manage).toHaveBeenCalledWith({
          route,
          options,
          params: {},
          action,
        });
      });
    });

    it('should fire ns.ima.core.EVENTS.BEFORE_HANDLE_ROUTE', async () => {
      const response = { content: null, status: 200 };
      const params = {};
      const data = {
        route: route,
        params: params,
        action: undefined,
        path: routePath,
        options: options,
      };

      router.getPath.mockReturnValue(routePath);
      vi.spyOn(pageManager, 'manage').mockReturnValue(
        Promise.resolve(response)
      );
      vi.spyOn(dispatcher, 'fire').mockImplementation();

      await router._handle(route, params, options);

      expect(dispatcher.fire).toHaveBeenCalledWith(
        RouterEvents.BEFORE_HANDLE_ROUTE,
        data
      );
    });

    it('should fire ns.ima.core.EVENTS.AFTER_HANDLE_ROUTE', async () => {
      const response = { content: null, status: 200 };
      const params = {};

      router.getPath.mockReturnValue(routePath);
      vi.spyOn(pageManager, 'manage').mockReturnValue(
        Promise.resolve(Object.assign({}, response))
      );
      vi.spyOn(dispatcher, 'fire').mockImplementation();

      await router._handle(route, params, options).then(() => {
        const data = {
          route: route,
          params: params,
          path: routePath,
          response: response,
          options: options,
        };

        expect(dispatcher.fire).toHaveBeenCalledWith(
          RouterEvents.AFTER_HANDLE_ROUTE,
          data
        );
      });
    });

    it('should fire ns.ima.core.EVENTS.AFTER_HANDLE_ROUTE with error', async () => {
      const response = { content: null, status: 200 };
      const params = { error: new Error('test') };

      router.getPath.mockReturnValue(routePath);
      vi.spyOn(pageManager, 'manage').mockReturnValue(
        Promise.resolve(Object.assign({}, response))
      );
      vi.spyOn(dispatcher, 'fire').mockImplementation();

      // @ts-expect-error error param is not typed properly
      await router._handle(route, params, options).then(() => {
        const data = {
          route: route,
          params: params,
          path: routePath,
          response: Object.assign({}, response, params),
          options: options,
        };

        expect(dispatcher.fire).toHaveBeenCalledWith(
          RouterEvents.AFTER_HANDLE_ROUTE,
          data
        );
      });
    });

    it('should return response', async () => {
      const response = { content: null, status: 200 };
      const params = {};

      router.getPath.mockReturnValue(routePath);
      vi.spyOn(pageManager, 'manage').mockReturnValue(
        Promise.resolve(Object.assign({}, response))
      );

      await router._handle(route, params, options).then(handleResponse => {
        expect(handleResponse).toStrictEqual(response);
      });
    });

    it('should return response with handled error', async () => {
      const response = { content: null, status: 500 };
      const params = { error: new Error('test') };

      router.getPath.mockReturnValue(routePath);

      vi.spyOn(pageManager, 'manage').mockReturnValue(
        Promise.resolve(Object.assign({}, response))
      );

      // @ts-expect-error error param is not typed properly
      await router._handle(route, params, options).then(handleResponse => {
        expect(handleResponse).toStrictEqual(
          Object.assign({}, response, params)
        );
      });
    });
  });

  describe('_extractRoutePath method', () => {
    const pathWithRoot = '/root/path';
    const pathWithLanguage = '/en/path';
    const pathWithRootAndLanguage = '/root/en/path';
    const path = '/path';

    beforeEach(() => {
      router = new MockedAbstractRouter(
        pageManager,
        routeFactory,
        dispatcher,
        30000
      );
      vi.spyOn(router, 'getPath').mockReturnValue(path);
    });

    it('should clear root from path', () => {
      router.init({ $Root: '/root', $Host: 'www.domain.com' });

      expect(router._extractRoutePath(pathWithRoot)).toBe(path);
    });

    it('should clear root and language from path', () => {
      router.init({
        $Root: '/root',
        $LanguagePartPath: '/en',
        $Host: 'www.domain.com',
      });

      expect(router._extractRoutePath(pathWithRootAndLanguage)).toBe(path);
    });

    it('should clear language from path', () => {
      router.init({ $LanguagePartPath: '/en', $Host: 'www.domain.com' });

      expect(router._extractRoutePath(pathWithLanguage)).toBe(path);
    });

    it('should return path for empty root and undefined language in path', () => {
      router.init({ $Host: 'www.domain.com' });

      expect(router._extractRoutePath(path)).toBe(path);
    });
  });

  describe('getRouteHandlersByPath method', () => {
    const endMiddleware = vi.fn();
    const afterHomeMiddleware = vi.fn();
    let middlewareRouter: MockedAbstractRouter;

    beforeEach(() => {
      middlewareRouter = new MockedAbstractRouter(
        pageManager,
        routeFactory,
        dispatcher,
        30000
      );

      vi.spyOn(middlewareRouter, 'getPath').mockReturnValue(currentRoutePath);
      middlewareRouter.init(config);

      middlewareRouter
        .use(globalMiddleware)
        .add('home', '/', Controller, View, options)
        .use(afterHomeMiddleware)
        .add('contact', '/contact', Controller, View, options)
        .use(endMiddleware);
    });

    it('should return correct set of middlewares', () => {
      expect(middlewareRouter['_routeHandlers'].size).toBe(5);

      expect(
        middlewareRouter.getRouteHandlersByPath('/').middlewares
      ).toStrictEqual([globalMiddleware]);

      expect(
        middlewareRouter.getRouteHandlersByPath('/contact').middlewares
      ).toStrictEqual([globalMiddleware, afterHomeMiddleware]);
    });
  });

  describe('_getMiddlewaresForRoute method', () => {
    const endMiddleware = vi.fn();
    const afterHomeMiddleware = vi.fn();
    let middlewareRouter: MockedAbstractRouter;

    beforeEach(() => {
      middlewareRouter = new MockedAbstractRouter(
        pageManager,
        routeFactory,
        dispatcher,
        30000
      );

      vi.spyOn(middlewareRouter, 'getPath').mockReturnValue(currentRoutePath);
      middlewareRouter.init(config);

      middlewareRouter
        .use(globalMiddleware)
        .add('home', '/', Controller, View, options)
        .use(afterHomeMiddleware)
        .add('contact', '/contact', Controller, View, options)
        .use(endMiddleware)
        .add(RouteNames.ERROR, '/error', Controller, View);
    });

    it('should return correct set of middlewares', () => {
      expect(middlewareRouter['_routeHandlers'].size).toBe(6);

      expect(middlewareRouter._getMiddlewaresForRoute('home')).toStrictEqual([
        globalMiddleware,
      ]);

      expect(middlewareRouter._getMiddlewaresForRoute('contact')).toStrictEqual(
        [globalMiddleware, afterHomeMiddleware]
      );

      expect(
        middlewareRouter._getMiddlewaresForRoute(RouteNames.ERROR)
      ).toStrictEqual([globalMiddleware, afterHomeMiddleware, endMiddleware]);
    });
  });

  describe('_runMiddlewares method', () => {
    it('should not break when middlewares are not a valid array', async () => {
      // @ts-expect-error
      await expect(router._runMiddlewares([])).resolves.toBeUndefined();
      // @ts-expect-error
      await expect(router._runMiddlewares()).resolves.toBeUndefined();
      // @ts-expect-error
      await expect(router._runMiddlewares(null)).resolves.toBeUndefined();
      // @ts-expect-error
      await expect(router._runMiddlewares({})).resolves.toBeUndefined();
    });

    it('should run middlewares in sequence', async () => {
      const middlewareLocals = { middleware: 'locals' };
      const results: { middleware: string; locals: unknown }[] = [];

      const m1 = vi.fn((params, locals) => {
        results.push({
          middleware: 'm1',
          locals: { ...locals },
        });

        return { m1: true };
      });
      const m2 = vi.fn().mockImplementation(async (params, locals) => {
        results.push({
          middleware: 'm2',
          locals: { ...locals },
        });

        return { m2: true };
      });
      const m3 = vi.fn((params, locals, next) => {
        results.push({
          middleware: 'm3',
          locals: { ...locals },
        });

        next({ m3: true });
      });

      await router._runMiddlewares(
        [m1, m2, m3],
        { params: 'params' },
        middlewareLocals
      );

      expect(m1).toHaveBeenCalledWith(
        { params: 'params' },
        { middleware: 'locals' }
      );
      expect(m2).toHaveBeenCalledWith(
        { params: 'params' },
        { m1: true, middleware: 'locals' }
      );
      expect(m3).toHaveBeenCalledWith(
        { params: 'params' },
        { m1: true, m2: true, middleware: 'locals' },
        expect.any(Function)
      );
      expect(results).toMatchInlineSnapshot(`
        [
          {
            "locals": {
              "middleware": "locals",
            },
            "middleware": "m1",
          },
          {
            "locals": {
              "m1": true,
              "middleware": "locals",
            },
            "middleware": "m2",
          },
          {
            "locals": {
              "m1": true,
              "m2": true,
              "middleware": "locals",
            },
            "middleware": "m3",
          },
        ]
      `);
    });

    it('should timeout when there are long promises still running', async () => {
      vi.useFakeTimers();

      const m1 = vi.fn(async () => {
        new Promise<void>(resolve => {
          setTimeout(() => {
            resolve();
          }, 100_000);
        });

        return { m1: true };
      });

      const middlewaresPromise = router._runMiddlewares([m1], {}, {});
      vi.advanceTimersByTime(50_000);

      await expect(middlewaresPromise).rejects.toBeInstanceOf(GenericError);

      vi.useRealTimers();
    });
  });
});
