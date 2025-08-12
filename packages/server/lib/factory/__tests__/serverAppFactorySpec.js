import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { createMonitoring } = require('@esmj/monitor');
const {
  GenericError,
  ServerRouter,
  Cache,
  Dispatcher,
  PageManager,
  PageStateManager,
  PageRenderer,
  RouteNames,
} = require('@ima/core');
const { toMockedInstance } = require('to-mock');

const { Emitter, Event } = require('../../emitter.js');
const instanceRecycler = require('../../instanceRecycler.js');
const serverGlobal = require('../../serverGlobal.js');
const serverAppFactory = require('../serverAppFactory.js');

const manifestMock = require('../__mocks__/manifest.json');

vi.mock('fs', () => {
  const { toMockedInstance } = vi.requireActual('to-mock');
  const originalModule = vi.requireActual('fs');

  return {
    ...toMockedInstance(originalModule, {
      existsSync() {
        return true;
      },
      readFileSync(path) {
        if (path.endsWith('manifest.json')) {
          return JSON.stringify(manifestMock);
        }

        return 'read file content';
      },
    }),
  };
});

vi.mock('../devErrorPageFactory.js', () => {
  return () => {
    return vi.fn(({ error }) => ({
      SPA: false,
      static: false,
      page: {
        state: {},
        cache: null,
        cookie: new Map(),
        headers: {},
      },
      cache: false,
      error,
      content: 'dev error page',
      status: 500,
    }));
  };
});

describe('Server App Factory', () => {
  let logger = null;
  let devErrorPage = null;
  let environment = null;
  let languageLoader = null;
  let applicationFolder = '';
  let appFactory = null;

  let REQ = null;
  let RES = null;
  let serverApp = null;

  let router = null;
  let cache = null;
  let dispatcher = null;
  let pageManager = null;
  let pageStateManager = null;
  let pageRenderer = null;
  let OCCleared = null;
  let emitter = new Emitter();
  let performance = createMonitoring();

  beforeEach(() => {
    logger = console;
    environment = {
      $Debug: true,
      $Language: {
        '//*:*': 'en',
      },
      $Server: {
        concurrency: 1,
        staticConcurrency: 100,
        protocol: 'http',
        cache: {
          enabled: true,
        },
        serveSPA: {
          allow: true,
        },
      },
    };
    devErrorPage = vi.fn(({ error }) => ({
      SPA: false,
      static: false,
      page: {
        state: {},
        cache: null,
      },
      cache: false,
      error,
      content: 'dev error page',
      status: 500,
    }));
    languageLoader = vi.fn();
    OCCleared = vi.fn();
    applicationFolder = '';

    router = toMockedInstance(ServerRouter, {
      isClientError: () => false,
      isRedirection: () => false,
      handleError: () =>
        Promise.resolve({
          status: 500,
          content: '500 app html',
        }),
      getCurrentRouteInfo: vi.fn(() => {
        return {
          route: {
            getName() {
              return RouteNames.NOT_FOUND;
            },
          },
        };
      }),
    });

    cache = toMockedInstance(Cache, {
      serialize: vi
        .fn()
        .mockReturnValue(JSON.stringify({ cacheKey: 'cacheValue' })),
    });

    dispatcher = toMockedInstance(Dispatcher);

    pageManager = toMockedInstance(PageManager);
    pageStateManager = toMockedInstance(PageStateManager, {
      getState: vi.fn().mockReturnValue({ page: 'state' }),
    });
    pageRenderer = toMockedInstance(PageRenderer);

    appFactory = vi.fn(() => {
      return {
        getInitialAppConfigFunctions: vi.fn(),
        ima: {
          createImaApp: vi.fn(() => {
            return {
              bootstrap: {
                run: vi.fn(),
              },
              oc: {
                get(name) {
                  if (name === '$Router') {
                    return router;
                  }

                  if (name === '$Request') {
                    return {
                      init: vi.fn(),
                    };
                  }

                  if (name === '$Response') {
                    return {
                      init: vi.fn(),
                      getResponseParams() {
                        return {
                          cookie: new Map(),
                          headers: {},
                        };
                      },
                    };
                  }

                  if (name === '$Cache') {
                    return cache;
                  }

                  if (name === '$PageStateManager') {
                    return pageStateManager;
                  }

                  if (name === '$PageRenderer') {
                    return pageRenderer;
                  }

                  if (name === '$PageManager') {
                    return pageManager;
                  }

                  if (name === '$Dispatcher') {
                    return dispatcher;
                  }
                },
                clear() {
                  OCCleared();
                },
              },
            };
          }),
          getInitialPluginConfig: vi.fn(),
          getInitialImaConfigFunctions: vi.fn(),
        },
      };
    });

    REQ = {
      headers() {
        return '';
      },
      get() {
        return '';
      },
      originalUrl: 'http://www.example.com/',
    };
    RES = {
      status: vi.fn(),
      send: vi.fn(),
      set: vi.fn(),
      redirect: vi.fn(),
      locals: {},
      headerSent: false,
    };

    serverApp = serverAppFactory({
      environment,
      logger,
      devErrorPage,
      languageLoader,
      applicationFolder,
      appFactory,
      emitter,
      performance,
      instanceRecycler,
      serverGlobal,
    });

    serverApp.useIMADefaultHook();
  });

  afterEach(() => {
    vi.resetAllMocks();
    emitter.removeAllListeners();
    instanceRecycler.clear();
    serverGlobal.clear();
  });

  describe('requestHandlerMiddleware method', () => {
    it('should call appFactory for all request in dev mode', async () => {
      environment.$Env = 'dev';

      await serverApp.requestHandlerMiddleware(REQ, RES);
      await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(appFactory.mock.calls).toHaveLength(2);
    });

    it('should call appFactory only once for prod mode', async () => {
      environment.$Env = 'prod';

      await serverApp.requestHandlerMiddleware(REQ, RES);
      await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(appFactory.mock.calls).toHaveLength(1);
    });

    it('should render 200 ima app page', async () => {
      vi.spyOn(router, 'route').mockReturnValue({
        status: 200,
        content: 'app html',
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.status).toBe(200);
      expect(response.content).toBe('app html');
      expect(response.cache).toBeFalsy();
    });

    it('should render 200 ima app page with custom content variables', async () => {
      vi.spyOn(router, 'route').mockReturnValue({
        status: 200,
        content: '#{myID} app html #{myVariable}',
      });

      emitter.on(Event.CreateContentVariables, ({ result }) => {
        return {
          ...result,
          myVariable: 'custom variable',
        };
      });

      emitter.on(Event.CreateContentVariables, ({ result }) => {
        return {
          ...result,
          myID: 123,
        };
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.status).toBe(200);
      expect(response.content).toBe('123 app html custom variable');
      expect(response.cache).toBeFalsy();
    });

    it('should render 500 ima app page', async () => {
      vi.spyOn(router, 'route').mockReturnValue(
        Promise.reject(new Error('Custom error messages'))
      );

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.status).toBe(500);
      expect(response.content).toBe('500 app html');
      expect(response.cache).toBeFalsy();
    });

    it('should render 500 static page', async () => {
      environment.$Server.staticConcurrency = 0;
      vi.spyOn(router, 'getCurrentRouteInfo').mockReturnValue({
        route: {
          getName() {
            return 'home ';
          },
        },
      });
      vi.spyOn(router, 'route').mockReturnValue(
        Promise.reject(new Error('Static 500 error'))
      );

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.static).toBeTruthy();
      expect(response.status).toBe(500);
      expect(response.content).toBe('read file content');
      expect(response.cache).toBeFalsy();
    });

    it('should render 500 static page and then 200 ima app page', async () => {
      environment.$Server.staticConcurrency = 0;
      vi.spyOn(router, 'getCurrentRouteInfo').mockReturnValue({
        route: {
          getName() {
            return 'home ';
          },
        },
      });
      vi.spyOn(router, 'route').mockReturnValue(
        Promise.reject(new Error('Static 500 error'))
      );
      pageStateManager.getState.mockImplementation(() => {
        throw new Error('State error');
      });

      let response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.static).toBeTruthy();
      expect(response.status).toBe(500);
      expect(response.content).toBe('read file content');
      expect(response.cache).toBeFalsy();
      expect(OCCleared).toHaveBeenCalledTimes(1);

      vi.resetAllMocks();

      vi.spyOn(router, 'route').mockReturnValue({
        status: 200,
        content: 'app html',
      });

      response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.status).toBe(200);
      expect(response.content).toBe('app html');
      expect(response.cache).toBeFalsy();
      expect(OCCleared).toHaveBeenCalledTimes(1);
    });

    it('should render 500 static page for ima app route ERROR which exceeds static thresholds', async () => {
      environment.$Server.staticConcurrency = 0;
      vi.spyOn(router, 'getCurrentRouteInfo').mockReturnValue({
        route: {
          getName() {
            return RouteNames.ERROR;
          },
        },
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.static).toBeTruthy();
      expect(response.status).toBe(500);
      expect(response.error).toBeInstanceOf(Error);
      expect(response.content).toBe('read file content');
      expect(response.cache).toBeFalsy();
    });

    it('should render SPA page without cache', async () => {
      vi.spyOn(
        instanceRecycler,
        'hasReachedMaxConcurrentRequests'
      ).mockReturnValue(true);

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.cache).toBeFalsy();
    });

    it('should render SPA page without creating IMA app ', async () => {
      environment.$Server.concurrency = 0;
      vi.spyOn(
        instanceRecycler,
        'hasReachedMaxConcurrentRequests'
      ).mockReturnValue(true);

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.static).toBeTruthy();
      expect(response.cache).toBeFalsy();
      expect(appFactory).not.toHaveBeenCalled();
    });

    it('should render overloaded message', async () => {
      environment.$Server.overloadConcurrency = 0;

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(503);
      expect(response.static).toBeTruthy();
      expect(response.cache).toBeFalsy();
    });

    it('should render 404 static page for exceed staticConcurrency', async () => {
      environment.$Server.staticConcurrency = 0;

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(404);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeTruthy();
    });

    it('should render 404 app page for not exceed staticConcurrency', async () => {
      vi.spyOn(router, 'route').mockReturnValue({
        status: 404,
        content: '404 page',
      });
      environment.$Server.staticConcurrency = 100;

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(404);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.content).toBe('404 page');
    });

    it('should redirect page with 301 status for exceed staticConcurrency', async () => {
      vi.spyOn(router, 'route').mockReturnValue(
        Promise.reject(
          new GenericError('Redirect', {
            status: 301,
            url: 'https://imajs.io',
          })
        )
      );
      vi.spyOn(router, 'isRedirection').mockReturnValue(true);
      vi.spyOn(router, 'getCurrentRouteInfo').mockReturnValue({
        route: {
          getName() {
            return 'home ';
          },
        },
      });

      environment.$Server.staticConcurrency = 0;

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(301);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.content).toBeNull();
      expect(RES.redirect).toHaveBeenCalled();
    });

    it('should redirect page with 301 status for not exceed staticConcurrency', async () => {
      vi.spyOn(router, 'route').mockReturnValue(
        Promise.reject(
          new GenericError('Redirect', {
            status: 301,
            url: 'https://imajs.io',
          })
        )
      );
      vi.spyOn(router, 'isRedirection').mockReturnValue(true);
      environment.$Server.staticConcurrency = 100;

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(301);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.content).toBeNull();
      expect(RES.redirect).toHaveBeenCalled();
    });

    it('should preventDefaulted Event.Request hooks', async () => {
      emitter.on(Event.BeforeRequest, event => {
        event.preventDefault();
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(204);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.content).toBeNull();
    });

    it('should render default page response', async () => {
      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(204);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.content).toBeNull();
      expect(response.page.state).toEqual({ page: 'state' });
      expect(response.page.cache).toBe('{"cacheKey":"cacheValue"}');
      expect(response.page.cookie.size).toBe(0);
      expect(response.page.headers).toEqual({});
      expect(RES.set).toHaveBeenCalled();
    });

    it('should preventDefaulted Event.Response hooks', async () => {
      emitter.on(Event.BeforeResponse, event => {
        event.preventDefault();
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(204);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.content).toBeNull();
      expect(RES.send).not.toHaveBeenCalled();
      expect(RES.status).not.toHaveBeenCalled();
    });
  });

  describe('errorHandlerMiddleware method', () => {
    it('should render dev error page for $Debug mode', async () => {
      environment.$Debug = true;
      process.env.IMA_CLI_WATCH = 'true';
      const error = new Error('Custom');

      const response = await serverApp.errorHandlerMiddleware(error, REQ, RES);
      delete process.env.IMA_CLI_WATCH;

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(500);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.content).toBe('dev error page');
      expect(response.error).toEqual(error);
    });

    it('should render static error page for non $Debug mode without initialized app in context', async () => {
      environment.$Debug = false;
      const error = new Error('Custom');

      const response = await serverApp.errorHandlerMiddleware(error, REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(500);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeTruthy();
      expect(response.content).toBe('read file content');
      expect(response.error).toEqual(error);
    });
  });

  it('handle request', async () => {
    await serverApp.requestHandlerMiddleware(REQ, RES);

    expect(true).toBeTruthy();
  });
});
