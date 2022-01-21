import GenericError from 'src/error/GenericError';
import Dispatcher from 'src/event/Dispatcher';
import PageManager from 'src/page/manager/PageManager';
import AbstractRouter from '../AbstractRouter';
import ActionTypes from '../ActionTypes';
import RouteEvents from '../Events';
import RouteFactory from '../RouteFactory';
import RouteNames from '../RouteNames';
import RouterMiddleware from '../RouterMiddleware';

describe('ima.core.router.AbstractRouter', () => {
  let router = null;
  let pageManager = null;
  let routeFactory = null;
  let dispatcher = null;
  let config = {
    $Protocol: 'http:',
    $Root: '/root',
    $LanguagePartPath: '',
    $Host: 'www.domain.com',
  };
  let options = {
    onlyUpdate: false,
    autoScroll: true,
    allowSPA: true,
    documentView: null,
    managedRootView: null,
    viewAdapter: null,
    middlewares: [],
  };
  let globalMiddleware = jest.fn();
  let homeRouteMiddleware = jest.fn();
  let action = {
    type: ActionTypes.REDIRECT,
  };
  let errorAction = {
    type: ActionTypes.ERROR,
    url: 'http://www.domain.com/root/currentRoutePath',
  };
  let currentRoutePath = '/currentRoutePath';
  let Controller = function Controller() {};
  let View = function View() {};

  beforeEach(() => {
    pageManager = new PageManager();
    routeFactory = new RouteFactory();
    dispatcher = new Dispatcher();
    router = new AbstractRouter(pageManager, routeFactory, dispatcher);

    spyOn(router, 'getPath').and.returnValue(currentRoutePath);

    router.init(config);

    router.use(globalMiddleware);
    router.add('home', '/', Controller, View, {
      middlewares: [homeRouteMiddleware],
    });
    router.add('contact', '/contact', Controller, View, options);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have 2 routes in Array and 1 global middleware', () => {
    expect(router._routeHandlers.size).toBe(3);
  });

  it('should remove path from router', () => {
    router.remove('home');

    expect(router._routeHandlers.size).toBe(2);
  });

  it('should return absolute current url', () => {
    expect(router.getUrl()).toBe('http://www.domain.com/root/currentRoutePath');
  });

  it('should return base url of application', () => {
    expect(router.getBaseUrl()).toBe('http://www.domain.com/root');
  });

  it('should return route and middlewares in line for defined path', () => {
    let { route, middlewares } = router._getRouteHandlersByPath('/');

    expect(route.getName()).toBe('home');
    expect(middlewares).toHaveLength(1);
  });

  describe('add method', () => {
    it('should be throw error if you try add route with exists name', () => {
      expect(() => {
        router.add('home', '/home', Controller, View, options);
      }).toThrow();
    });

    it('should create new ima.core.Route', () => {
      spyOn(routeFactory, 'createRoute').and.callThrough();

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
      spyOn(router._routeHandlers, 'set').and.callThrough();

      router.use(globalMiddleware);

      expect(router._routeHandlers.set).toHaveBeenCalledWith(
        'middleware-1',
        new RouterMiddleware(globalMiddleware)
      );
    });
  });

  describe('getCurrentRouteInfo method', () => {
    let routeName = 'link';
    let path = '/link';
    let route = null;
    let params = {};

    beforeEach(() => {
      route = routeFactory.createRoute(
        routeName,
        path,
        Controller,
        View,
        options
      );
    });

    afterEach(() => {
      route = null;
    });

    it('should throw error for not existing route', () => {
      router.getPath.and.returnValue(null);

      expect(() => {
        router.getCurrentRouteInfo();
      }).toThrow();
    });

    it('should return current route information', () => {
      router.getPath.and.returnValue(path);
      spyOn(router, '_getRouteHandlersByPath').and.returnValue({ route });
      spyOn(route, 'extractParameters').and.returnValue(params);

      expect(router.getCurrentRouteInfo()).toStrictEqual({
        route,
        params,
        path,
      });
    });
  });

  describe('link method', () => {
    let routeName = 'link';
    let path = '/link';
    let baseUrl = 'baseUrl';

    beforeEach(() => {
      router.add(routeName, path, Controller, View, options);
    });

    afterEach(() => {
      router.remove(routeName);
    });

    it('should return link for valid route with params', () => {
      spyOn(router, 'getBaseUrl').and.returnValue(baseUrl);

      expect(router.link(routeName, {})).toBe(baseUrl + path);
    });

    it('should throw Error for not valid route with params', () => {
      spyOn(router._routeHandlers, 'has').and.returnValue(false);

      expect(() => {
        router.link('xxx', {});
      }).toThrow();
    });
  });

  describe('route method', () => {
    let routeName = 'link';
    let path = '/link';
    let route = null;
    let routeMiddleware = jest.fn();

    beforeEach(() => {
      route = routeFactory.createRoute(routeName, path, Controller, View, {
        middlewares: [routeMiddleware],
      });
      action.route = route;
    });

    afterEach(() => {
      route = null;
    });

    it('should handle valid route path', async () => {
      spyOn(router, '_getRouteHandlersByPath').and.returnValue({
        route,
        middlewares: [],
      });

      spyOn(router, '_handle').and.stub();

      spyOn(route, 'extractParameters').and.callThrough();

      await router.route(path, options, action);

      expect(route.extractParameters).toHaveBeenCalled();
      expect(router._currentlyRoutedPath).toBe(path);
      expect(router._handle).toHaveBeenCalledWith(route, {}, options, action);
    });

    it('should handle valid route path with middlewares', async () => {
      let middlewaresMock = [new RouterMiddleware(globalMiddleware)];
      spyOn(router, '_getRouteHandlersByPath').and.returnValue({
        route,
        middlewares: middlewaresMock,
      });

      spyOn(router, '_handle').and.stub();
      spyOn(router, '_runMiddlewares').and.callThrough();

      spyOn(route, 'extractParameters').and.callThrough();

      await router.route(path, options, action);

      expect(route.extractParameters).toHaveBeenCalled();
      expect(router._currentlyRoutedPath).toBe(path);
      expect(router._handle).toHaveBeenCalledWith(route, {}, options, action);
      expect(router._runMiddlewares).toHaveBeenNthCalledWith(
        1,
        middlewaresMock,
        {},
        { route, action }
      );
      expect(router._runMiddlewares).toHaveBeenNthCalledWith(
        2,
        [new RouterMiddleware(routeMiddleware)],
        {},
        { route, action }
      );
    });

    it('should handle "not-found" route', done => {
      spyOn(router, '_getRouteHandlersByPath').and.returnValue({});

      spyOn(router, 'handleNotFound').and.callFake(params => {
        return Promise.resolve(params);
      });

      router.route(path).then(params => {
        expect(params.error instanceof GenericError).toBe(true);
        done();
      });
    });
  });

  describe('handleError method', () => {
    let path = '/error';
    let route = null;
    let originalRoute = null;
    let routeMiddleware = jest.fn();

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

      router._currentlyRoutedPath = '/user/2345';
    });

    afterEach(() => {
      route = null;
    });

    it('should handle "error" route', done => {
      let params = { error: new Error('test') };

      spyOn(router._routeHandlers, 'get').and.returnValue(route);
      spyOn(router, '_getRouteHandlersByPath').and.returnValue({
        route: originalRoute,
      });
      spyOn(router, '_runMiddlewares').and.callThrough();

      spyOn(router, '_handle').and.returnValue(
        Promise.resolve({
          content: '',
          status: 200,
          error: params.error,
        })
      );

      router
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
          expect(response.error).toStrictEqual(params.error);
          expect(router._runMiddlewares).toHaveBeenCalledWith(
            [
              new RouterMiddleware(globalMiddleware),
              new RouterMiddleware(routeMiddleware),
            ],
            expect.objectContaining({
              ...params,
              userId: '2345',
            }),
            { route, action: errorAction }
          );
          done();
        })
        .catch(error => {
          console.error('ima.core.router.AbstractRouter.handleError', error);
          done(error);
        });
    });

    it('should reject promise with error for undefined "error" route', done => {
      let params = { error: new Error('test') };

      spyOn(router._routeHandlers, 'get').and.returnValue(null);

      router.handleError(params).catch(reason => {
        expect(reason instanceof GenericError).toBe(true);
        done();
      });
    });
  });

  describe('handleNotFound method', () => {
    let path = '/not-found';
    let route = null;
    let originalRoute = null;
    let routeMiddleware = jest.fn();

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

      router._currentlyRoutedPath = '/user/2345';
    });

    afterEach(() => {
      route = null;
    });

    it('should handle "notFound" route', done => {
      let params = { error: new GenericError() };

      spyOn(router._routeHandlers, 'get').and.returnValue(route);
      spyOn(router, '_getRouteHandlersByPath').and.returnValue({
        route: originalRoute,
      });
      spyOn(router, '_runMiddlewares').and.callThrough();

      spyOn(router, '_handle').and.returnValue(
        Promise.resolve({
          content: '',
          status: 200,
          error: params.error,
        })
      );

      router
        .handleNotFound(params, options)
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
          expect(response.error instanceof GenericError).toBeTruthy();
          expect(router._runMiddlewares).toHaveBeenCalledWith(
            [
              new RouterMiddleware(globalMiddleware),
              new RouterMiddleware(routeMiddleware),
            ],
            expect.objectContaining({
              ...params,
              userId: '2345',
            }),
            { route, action: errorAction }
          );
          done();
        })
        .catch(error => {
          console.error('ima.core.router.AbstractRouter.handleNotFound', error);
          done(error);
        });
    });

    it('should reject promise with error for undefined "error" route', done => {
      let params = { error: new Error() };

      spyOn(router._routeHandlers, 'get').and.returnValue(null);

      router.handleNotFound(params).catch(reason => {
        expect(reason instanceof GenericError).toBe(true);
        done();
      });
    });
  });

  describe('isClientError method', () => {
    it('should return true for client error, which return status 4**', () => {
      let isClientError = router.isClientError(
        new GenericError('Client error', { status: 404 })
      );

      expect(isClientError).toBeTruthy();
    });

    it('should return false for client error, which return status 5**', () => {
      let isClientError = router.isClientError(
        new GenericError('Server error', { status: 500 })
      );

      expect(isClientError).toBeFalsy();
    });

    it('should return false for any error', () => {
      let isClientError = router.isClientError(new Error('some error'));

      expect(isClientError).toBeFalsy();
    });
  });

  describe('isRedirection method', () => {
    it('should return true for redirection, which return status 3**', () => {
      let isRedirection = router.isRedirection(
        new GenericError('Redirection', {
          status: 300,
          url: 'http://www.example.com/redirect',
        })
      );

      expect(isRedirection).toBeTruthy();
    });

    it('should return true for client error, which return status 4**', () => {
      let isRedirection = router.isRedirection(
        new GenericError('Client error', { status: 400 })
      );

      expect(isRedirection).toBeFalsy();
    });

    it('should return false for any error', () => {
      let isClientError = router.isClientError(new Error('some error'));

      expect(isClientError).toBeFalsy();
    });
  });

  describe('_handle method', () => {
    let routeName = 'routeName';
    let routePath = '/routePath';
    let route = null;

    beforeEach(() => {
      route = routeFactory.createRoute(
        routeName,
        routePath,
        Controller,
        View,
        options,
        []
      );
      spyOn(router, '_getCurrentlyRoutedPath').and.returnValue(routePath);
    });

    afterEach(() => {
      route = null;
    });

    it('should call page manager', done => {
      router.getPath.and.returnValue(routePath);
      spyOn(pageManager, 'manage').and.returnValue(
        Promise.resolve({ content: null, status: 200 })
      );
      spyOn(dispatcher, 'fire').and.stub();

      router._handle(route, {}, {}, action).then(() => {
        expect(pageManager.manage).toHaveBeenCalledWith(
          route,
          options,
          {},
          action
        );
        done();
      });
    });

    it('should fire ns.ima.core.EVENTS.BEFORE_HANDLE_ROUTE', () => {
      let response = { content: null, status: 200 };
      let params = {};
      let data = {
        route: route,
        params: params,
        path: routePath,
        options: options,
        action: {},
      };

      router.getPath.and.returnValue(routePath);
      spyOn(pageManager, 'manage').and.returnValue(Promise.resolve(response));
      spyOn(dispatcher, 'fire').and.stub();

      router._handle(route, params, options);

      expect(dispatcher.fire).toHaveBeenCalledWith(
        RouteEvents.BEFORE_HANDLE_ROUTE,
        data,
        true
      );
    });

    it('should fire ns.ima.core.EVENTS.AFTER_HANDLE_ROUTE', done => {
      let response = { content: null, status: 200 };
      let params = {};

      router.getPath.and.returnValue(routePath);
      spyOn(pageManager, 'manage').and.returnValue(
        Promise.resolve(Object.assign({}, response))
      );
      spyOn(dispatcher, 'fire').and.stub();

      router._handle(route, params, options).then(() => {
        let data = {
          route: route,
          params: params,
          path: routePath,
          response: response,
          options: options,
          action: {},
        };

        expect(dispatcher.fire).toHaveBeenCalledWith(
          RouteEvents.AFTER_HANDLE_ROUTE,
          data,
          true
        );

        done();
      });
    });

    it('should fire ns.ima.core.EVENTS.AFTER_HANDLE_ROUTE with error', done => {
      let response = { content: null, status: 200 };
      let params = { error: new Error('test') };

      router.getPath.and.returnValue(routePath);
      spyOn(pageManager, 'manage').and.returnValue(
        Promise.resolve(Object.assign({}, response))
      );
      spyOn(dispatcher, 'fire').and.stub();

      router._handle(route, params, options).then(() => {
        let data = {
          route: route,
          params: params,
          path: routePath,
          response: Object.assign({}, response, params),
          options: options,
          action: {},
        };

        expect(dispatcher.fire).toHaveBeenCalledWith(
          RouteEvents.AFTER_HANDLE_ROUTE,
          data,
          true
        );

        done();
      });
    });

    it('should return response', done => {
      let response = { content: null, status: 200 };
      let params = {};

      router.getPath.and.returnValue(routePath);
      spyOn(pageManager, 'manage').and.returnValue(
        Promise.resolve(Object.assign({}, response))
      );

      router._handle(route, params, options).then(handleResponse => {
        expect(handleResponse).toStrictEqual(response);
        done();
      });
    });

    it('should return response with handled error', done => {
      let response = { content: null, status: 500 };
      let params = { error: new Error('test') };

      router.getPath.and.returnValue(routePath);

      spyOn(pageManager, 'manage').and.returnValue(
        Promise.resolve(Object.assign({}, response))
      );

      router._handle(route, params, options).then(handleResponse => {
        expect(handleResponse).toStrictEqual(
          Object.assign({}, response, params)
        );
        done();
      });
    });
  });

  describe('_extractRoutePath method', () => {
    let pathWithRoot = '/root/path';
    let pathWithLanguage = '/en/path';
    let pathWithRootAndLanguage = '/root/en/path';
    let path = '/path';

    beforeEach(() => {
      router = new AbstractRouter(pageManager, routeFactory, dispatcher);
      spyOn(router, 'getPath').and.returnValue(path);
    });

    it('should clear root from path', () => {
      router.init({ $Root: '/root' });

      expect(router._extractRoutePath(pathWithRoot)).toBe(path);
    });

    it('should clear root and language from path', () => {
      router.init({ $Root: '/root', $LanguagePartPath: '/en' });

      expect(router._extractRoutePath(pathWithRootAndLanguage)).toBe(path);
    });

    it('should clear language from path', () => {
      router.init({ $LanguagePartPath: '/en' });

      expect(router._extractRoutePath(pathWithLanguage)).toBe(path);
    });

    it('should return path for empty root and undefined language in path', () => {
      router.init({});

      expect(router._extractRoutePath(path)).toBe(path);
    });
  });

  describe('_getRouteHandlersByPath method', () => {
    let endMiddleware = jest.fn();
    let afterHomeMiddleware = jest.fn();
    let middlewareRouter;

    beforeEach(() => {
      middlewareRouter = new AbstractRouter(
        pageManager,
        routeFactory,
        dispatcher
      );

      spyOn(middlewareRouter, 'getPath').and.returnValue(currentRoutePath);
      middlewareRouter.init(config);

      middlewareRouter
        .use(globalMiddleware)
        .add('home', '/', Controller, View, options, [homeRouteMiddleware])
        .use(afterHomeMiddleware)
        .add('contact', '/contact', Controller, View, options)
        .use(endMiddleware);
    });

    it('should return correct set of middlewares', () => {
      expect(middlewareRouter._routeHandlers.size).toBe(5);

      expect(
        middlewareRouter._getRouteHandlersByPath('/').middlewares
      ).toStrictEqual([new RouterMiddleware(globalMiddleware)]);

      expect(
        middlewareRouter._getRouteHandlersByPath('/contact').middlewares
      ).toStrictEqual([
        new RouterMiddleware(globalMiddleware),
        new RouterMiddleware(afterHomeMiddleware),
      ]);
    });
  });

  describe('_getMiddlewaresForRoute method', () => {
    let endMiddleware = jest.fn();
    let afterHomeMiddleware = jest.fn();
    let middlewareRouter;

    beforeEach(() => {
      middlewareRouter = new AbstractRouter(
        pageManager,
        routeFactory,
        dispatcher
      );

      spyOn(middlewareRouter, 'getPath').and.returnValue(currentRoutePath);
      middlewareRouter.init(config);

      middlewareRouter
        .use(globalMiddleware)
        .add('home', '/', Controller, View, options, [homeRouteMiddleware])
        .use(afterHomeMiddleware)
        .add('contact', '/contact', Controller, View, options)
        .use(endMiddleware)
        .add(RouteNames.ERROR, '/error', Controller, View);
    });

    it('should return correct set of middlewares', () => {
      expect(middlewareRouter._routeHandlers.size).toBe(6);

      expect(middlewareRouter._getMiddlewaresForRoute('home')).toStrictEqual([
        new RouterMiddleware(globalMiddleware),
      ]);

      expect(middlewareRouter._getMiddlewaresForRoute('contact')).toStrictEqual(
        [
          new RouterMiddleware(globalMiddleware),
          new RouterMiddleware(afterHomeMiddleware),
        ]
      );

      expect(
        middlewareRouter._getMiddlewaresForRoute(RouteNames.ERROR)
      ).toStrictEqual([
        new RouterMiddleware(globalMiddleware),
        new RouterMiddleware(afterHomeMiddleware),
        new RouterMiddleware(endMiddleware),
      ]);
    });
  });

  describe('_runMiddlewares method', () => {
    it('should not break when middlewares are not a valid array', async () => {
      await expect(router._runMiddlewares([])).resolves.toBeUndefined();
      await expect(router._runMiddlewares()).resolves.toBeUndefined();
      await expect(router._runMiddlewares(null)).resolves.toBeUndefined();
      await expect(router._runMiddlewares({})).resolves.toBeUndefined();
    });

    it('should run middlewares in sequence', async () => {
      let middlewareLocals = { middleware: 'locals' };

      let results = [];
      let m1 = new RouterMiddleware(
        jest.fn((params, locals) => {
          results.push('m1');
          locals.m1 = true;
        })
      );
      let m2 = new RouterMiddleware(
        jest.fn((params, locals) => {
          results.push('m2');
          locals.m2 = true;
        })
      );
      let m3 = new RouterMiddleware(
        jest.fn((params, locals) => {
          results.push('m3');
          locals.m3 = true;
        })
      );

      await router._runMiddlewares([m1, m2, m3], 'params', middlewareLocals);

      expect(m1._middleware).toHaveBeenCalledWith('params', middlewareLocals);
      expect(m2._middleware).toHaveBeenCalledWith('params', middlewareLocals);
      expect(m3._middleware).toHaveBeenCalledWith('params', middlewareLocals);
      expect(results).toStrictEqual(['m1', 'm2', 'm3']);
      expect(middlewareLocals).toStrictEqual({
        middleware: 'locals',
        m1: true,
        m2: true,
        m3: true,
      });
    });
  });
});
