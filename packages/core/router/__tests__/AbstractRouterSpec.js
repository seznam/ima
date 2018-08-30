import GenericError from 'error/GenericError';
import Dispatcher from 'event/Dispatcher';
import PageManager from 'page/manager/PageManager';
import AbstractRouter from 'router/AbstractRouter';
import RouteEvents from 'router/Events';
import RouteFactory from 'router/RouteFactory';
import RouteNames from 'router/RouteNames';
import { ActionTypes } from 'router/ClientRouter';

describe('ima.router.AbstractRouter', () => {
  let router = null;
  let pageManager = null;
  let routeFactory = null;
  let dispatcher = null;
  let config = {
    $Protocol: 'http:',
    $Root: '/root',
    $LanguagePartPath: '',
    $Host: 'www.domain.com'
  };
  let options = {
    onlyUpdate: false,
    autoScroll: true,
    allowSPA: true,
    documentView: null,
    managedRootView: null,
    viewAdapter: null
  };
  let action = {
    type: ActionTypes.REDIRECT
  };
  let Controller = function Controller() {};
  let View = function View() {};

  beforeEach(() => {
    pageManager = new PageManager();
    routeFactory = new RouteFactory();
    dispatcher = new Dispatcher();
    router = new AbstractRouter(pageManager, routeFactory, dispatcher);

    router.init(config);

    router.add('home', '/', Controller, View, options);
    router.add('contact', '/contact', Controller, View, options);
  });

  it('should have 2 routes in Array', () => {
    expect(router._routes.size).toEqual(2);
  });

  it('should remove path from router', () => {
    router.remove('home');

    expect(router._routes.size).toEqual(1);
  });

  it('should return absolute current url', () => {
    spyOn(router, 'getPath').and.returnValue('/path');

    expect(router.getUrl()).toEqual('http://www.domain.com/root/path');
  });

  it('should return base url of application', () => {
    expect(router.getBaseUrl()).toEqual('http://www.domain.com/root');
  });

  it('should return route for defined path', () => {
    let route = router._getRouteByPath('/');

    expect(route.getName()).toEqual('home');
  });

  describe('add method', () => {
    it('should be throw error if you try add route with exists name', () => {
      expect(() => {
        router.add('home', '/home', Controller, View, options);
      }).toThrow();
    });

    it('should create new ima.Route', () => {
      spyOn(routeFactory, 'createRoute').and.callThrough();

      router.add('routeName', '/routePath', Controller, View, options);

      expect(routeFactory.createRoute).toHaveBeenCalledWith(
        'routeName',
        '/routePath',
        Controller,
        View,
        options
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

    it('should throw error for not exist route', () => {
      spyOn(router, 'getPath').and.returnValue(null);

      expect(() => {
        router.getCurrentRouteInfo();
      }).toThrow();
    });

    it('should return current route information', () => {
      spyOn(router, 'getPath').and.returnValue(path);
      spyOn(router, '_getRouteByPath').and.returnValue(route);
      spyOn(route, 'extractParameters').and.returnValue(params);

      expect(router.getCurrentRouteInfo()).toEqual({
        route: route,
        params: params,
        path: '/link'
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

      expect(router.link(routeName, {})).toEqual(baseUrl + path);
    });

    it('should throw Error for not valid route with params', () => {
      spyOn(router._routes, 'has').and.returnValue(false);

      expect(() => {
        router.link('xxx', {});
      }).toThrow();
    });
  });

  describe('route method', () => {
    let routeName = 'link';
    let path = '/link';
    let route = null;

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

    it('should handle valid route path', () => {
      spyOn(router, '_getRouteByPath').and.returnValue(route);

      spyOn(router, '_handle').and.stub();

      spyOn(route, 'extractParameters').and.callThrough();

      router.route(path, options, action);

      expect(route.extractParameters).toHaveBeenCalled();
      expect(router._handle).toHaveBeenCalledWith(route, {}, options, action);
    });

    it('should handle "not-found" route', done => {
      spyOn(router, '_getRouteByPath').and.returnValue(null);

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

    beforeEach(() => {
      route = routeFactory.createRoute(
        RouteNames.ERROR,
        path,
        Controller,
        View,
        options
      );
    });

    afterEach(() => {
      route = null;
    });

    it('should handle "error" route', done => {
      let params = { error: new Error('test') };

      spyOn(router._routes, 'get').and.returnValue(route);

      spyOn(router, '_handle').and.returnValue(
        Promise.resolve({
          content: '',
          status: 200,
          error: params.error
        })
      );

      router
        .handleError(params, options)
        .then(response => {
          expect(router._handle).toHaveBeenCalledWith(route, params, options);
          expect(response.error).toEqual(params.error);
          done();
        })
        .catch(error => {
          console.error('ima.router.AbstractRouter.handleError', error);
          done();
        });
    });

    it('should reject promise with error for undefined "error" route', done => {
      let params = { error: new Error('test') };

      spyOn(router._routes, 'get').and.returnValue(null);

      router.handleError(params).catch(reason => {
        expect(reason instanceof GenericError).toBe(true);
        done();
      });
    });
  });

  describe('handleNotFound method', () => {
    let path = '/not-found';
    let route = null;

    beforeEach(() => {
      route = routeFactory.createRoute(
        RouteNames.NOT_FOUND,
        path,
        Controller,
        View,
        options
      );
    });

    afterEach(() => {
      route = null;
    });

    it('should handle "notFound" route', done => {
      let params = { error: new GenericError() };

      spyOn(router._routes, 'get').and.returnValue(route);

      spyOn(router, '_handle').and.returnValue(
        Promise.resolve({
          content: '',
          status: 200,
          error: params.error
        })
      );

      router
        .handleNotFound(params, options)
        .then(response => {
          expect(router._handle).toHaveBeenCalledWith(route, params, options);
          expect(response.error instanceof GenericError).toEqual(true);
          done();
        })
        .catch(error => {
          console.error('ima.router.AbstractRouter.handleNotFound', error);
          done();
        });
    });

    it('should reject promise with error for undefined "error" route', done => {
      let params = { error: new Error() };

      spyOn(router._routes, 'get').and.returnValue(null);

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

      expect(isClientError).toEqual(true);
    });

    it('should return false for client error, which return status 5**', () => {
      let isClientError = router.isClientError(
        new GenericError('Server error', { status: 500 })
      );

      expect(isClientError).toEqual(false);
    });

    it('should return false for any error', () => {
      let isClientError = router.isClientError(new Error('some error'));

      expect(isClientError).toEqual(false);
    });
  });

  describe('isRedirection method', () => {
    it('should return true for redirection, which return status 3**', () => {
      let isRedireciton = router.isRedirection(
        new GenericError('Redirection', {
          status: 300,
          url: 'http://www.example.com/redirect'
        })
      );

      expect(isRedireciton).toEqual(true);
    });

    it('should return true for client error, which return status 4**', () => {
      let isRedireciton = router.isRedirection(
        new GenericError('Client error', { status: 400 })
      );

      expect(isRedireciton).toEqual(false);
    });

    it('should return false for any error', () => {
      let isClientError = router.isClientError(new Error('some error'));

      expect(isClientError).toEqual(false);
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
        options
      );
    });

    afterEach(() => {
      route = null;
    });

    it('should call paga manager', done => {
      spyOn(router, 'getPath').and.returnValue(routePath);
      spyOn(pageManager, 'manage').and.returnValue(
        Promise.resolve({ content: null, status: 200 })
      );
      spyOn(dispatcher, 'fire').and.stub();

      router._handle(route, {}, {}, action).then(() => {
        expect(pageManager.manage).toHaveBeenCalledWith(
          Controller,
          View,
          options,
          {},
          action
        );
        done();
      });
    });

    it('should fire ns.ima.EVENTS.BEFORE_HANDLE_ROUTE', () => {
      let response = { content: null, status: 200 };
      let params = {};
      let path = '/';
      let data = {
        route: route,
        params: params,
        path: path,
        options: options
      };

      spyOn(router, 'getPath').and.returnValue(path);
      spyOn(pageManager, 'manage').and.returnValue(Promise.resolve(response));
      spyOn(dispatcher, 'fire').and.stub();

      router._handle(route, params, options);

      expect(dispatcher.fire).toHaveBeenCalledWith(
        RouteEvents.BEFORE_HANDLE_ROUTE,
        data,
        true
      );
    });

    it('should fire ns.ima.EVENTS.AFTER_HANDLE_ROUTE', done => {
      let response = { content: null, status: 200 };
      let params = {};
      let path = '/';

      spyOn(router, 'getPath').and.returnValue(path);
      spyOn(pageManager, 'manage').and.returnValue(
        Promise.resolve(Object.assign({}, response))
      );
      spyOn(dispatcher, 'fire').and.stub();

      router._handle(route, params, options).then(() => {
        let data = {
          route: route,
          params: params,
          path: path,
          response: response,
          options: options
        };

        expect(dispatcher.fire).toHaveBeenCalledWith(
          RouteEvents.AFTER_HANDLE_ROUTE,
          data,
          true
        );

        done();
      });
    });

    it('should fire ns.ima.EVENTS.AFTER_HANDLE_ROUTE with error', done => {
      let response = { content: null, status: 200 };
      let params = { error: new Error('test') };
      let path = '/';

      spyOn(router, 'getPath').and.returnValue(path);
      spyOn(pageManager, 'manage').and.returnValue(
        Promise.resolve(Object.assign({}, response))
      );
      spyOn(dispatcher, 'fire').and.stub();

      router._handle(route, params, options).then(() => {
        let data = {
          route: route,
          params: params,
          path: path,
          response: Object.assign({}, response, params),
          options: options
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
      let path = '/';

      spyOn(router, 'getPath').and.returnValue(path);
      spyOn(pageManager, 'manage').and.returnValue(
        Promise.resolve(Object.assign({}, response))
      );

      router._handle(route, params, options).then(handleResponse => {
        expect(handleResponse).toEqual(response);
        done();
      });
    });

    it('should return response with handled error', done => {
      let response = { content: null, status: 500 };
      let params = { error: new Error('test') };
      let path = '/';

      spyOn(router, 'getPath').and.returnValue(path);

      spyOn(pageManager, 'manage').and.returnValue(
        Promise.resolve(Object.assign({}, response))
      );

      router._handle(route, params, options).then(handleResponse => {
        expect(handleResponse).toEqual(Object.assign({}, response, params));
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
    });

    it('should clear root from path', () => {
      router.init({ $Root: '/root' });

      expect(router._extractRoutePath(pathWithRoot)).toEqual(path);
    });

    it('should clear root and language from path', () => {
      router.init({ $Root: '/root', $LanguagePartPath: '/en' });

      expect(router._extractRoutePath(pathWithRootAndLanguage)).toEqual(path);
    });

    it('should clear language from path', () => {
      router.init({ $LanguagePartPath: '/en' });

      expect(router._extractRoutePath(pathWithLanguage)).toEqual(path);
    });

    it('should return path for empty root and undefined language in path', () => {
      router.init({});

      expect(router._extractRoutePath(path)).toEqual(path);
    });
  });
});
