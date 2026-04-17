// eslint-disable-next-line import/order
const mock = require('mock-require');

mock('fs', {
  existsSync() {
    return true;
  },
  readFileSync(path) {
    if (path.endsWith('manifest.json')) {
      return JSON.stringify(manifestMock);
    }

    return 'read file content';
  },
});
mock('../devErrorPageFactory.js', () =>
  vi.fn(({ error }) => ({
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
    imaInternal: {},
  }))
);

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
        protocol: 'http',
        cache: {
          enabled: true,
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
      imaInternal: {},
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
      setHeader: vi.fn(),
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
      vi.spyOn(router, 'route').mockRejectedValue(
        new Error('Custom error messages')
      );

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.status).toBe(500);
      expect(response.content).toBe('500 app html');
      expect(response.cache).toBeFalsy();
    });

    it('should render 500 static page when degradation logic indicates and then 200 ima app page', async () => {
      environment.$Server.degradation = {
        isStatic: () => true,
      };
      vi.spyOn(router, 'getCurrentRouteInfo').mockReturnValue({
        route: {
          getName() {
            return 'home ';
          },
        },
      });
      vi.spyOn(router, 'route').mockRejectedValue(
        new Error('Static 500 error')
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
      // Clear degradation for second request
      environment.$Server.degradation = {
        isStatic: () => false,
      };

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

    it('should render 500 static page for ima app route ERROR when degradation logic indicates', async () => {
      serverGlobal.set('dummyApp', appFactory().ima.createImaApp());
      environment.$Server.degradation = {
        isStatic: () => true,
      };
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

    it('should render SPA page without cache when degradation logic indicates', async () => {
      environment.$Server.degradation = {
        isSPA: () => true,
      };

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.cache).toBeFalsy();
    });

    it('should render SPA page without creating IMA app when degradation logic indicates', async () => {
      environment.$Server.concurrency = 0;
      environment.$Server.degradation = {
        isSPA: () => true,
      };

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.static).toBeTruthy();
      expect(response.cache).toBeFalsy();
      expect(appFactory).not.toHaveBeenCalled();
    });

    it('should render SPA prefetch page when degradation logic indicates', async () => {
      environment.$Server.degradation = {
        isSPAPrefetch: () => true,
      };

      vi.spyOn(router, 'route').mockReturnValue({
        status: 200,
        content: 'app html',
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.spaPrefetch).toBeTruthy();
      expect(response.static).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.page.state).toEqual({ page: 'state' });
      expect(appFactory).toHaveBeenCalled();
    });

    it('should render SPA prefetch page with forced flag', async () => {
      process.env.IMA_CLI_FORCE_SPA_PREFETCH = 'true';

      vi.spyOn(router, 'route').mockReturnValue({
        status: 200,
        content: 'app html',
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.spaPrefetch).toBeTruthy();
      expect(response.static).toBeTruthy();
      expect(response.status).toBe(200);
      expect(appFactory).toHaveBeenCalled();

      delete process.env.IMA_CLI_FORCE_SPA_PREFETCH;
    });

    it('should fall back to SPA mode when both degradation functions return true', async () => {
      environment.$Server.degradation = {
        isSPAPrefetch: () => true,
        isSPA: () => true,
      };

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      // Should fall back to prefetched SPA mode (isSPAPrefetch takes precedence)
      expect(response.SPA).toBeTruthy();
      expect(response.spaPrefetch).toBeFalsy();
      expect(response.static).toBeTruthy();
    });

    it('should not render SPA prefetch without degradation logic', async () => {
      // No degradation config set - should not render SPA prefetch

      vi.spyOn(router, 'route').mockReturnValue({
        status: 200,
        content: 'app html',
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      // Should not render SPA prefetch when degradation is not defined
      expect(response.spaPrefetch).toBeFalsy();
      expect(response.status).toBe(200);
      expect(response.content).toBe('app html');
      expect(appFactory).toHaveBeenCalled();
    });

    it('should not render SPA prefetch when degradation logic returns false', async () => {
      environment.$Server.degradation = {
        isSPAPrefetch: () => false,
      };

      vi.spyOn(router, 'route').mockReturnValue({
        status: 200,
        content: 'app html',
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      // Should render normal page, not SPA prefetch
      expect(response.spaPrefetch).toBeFalsy();
      expect(response.status).toBe(200);
      expect(appFactory).toHaveBeenCalled();
    });

    it('should render SPA prefetch page with array degradation functions - first returns true', async () => {
      environment.$Server.degradation = {
        isSPAPrefetch: [
          () => true, // First function returns true
          () => false, // Second function should not be called
        ],
      };

      vi.spyOn(router, 'route').mockReturnValue({
        status: 200,
        content: 'app html',
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.spaPrefetch).toBeTruthy();
      expect(response.static).toBeTruthy();
      expect(response.status).toBe(200);
      expect(appFactory).toHaveBeenCalled();
    });

    it('should render SPA prefetch page with array degradation functions - second returns true', async () => {
      environment.$Server.degradation = {
        isSPAPrefetch: [
          () => false, // First function returns false
          () => true, // Second function returns true
        ],
      };

      vi.spyOn(router, 'route').mockReturnValue({
        status: 200,
        content: 'app html',
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.spaPrefetch).toBeTruthy();
      expect(response.static).toBeTruthy();
      expect(response.status).toBe(200);
      expect(appFactory).toHaveBeenCalled();
    });

    it('should not render SPA prefetch when all array degradation functions return false', async () => {
      environment.$Server.degradation = {
        isSPAPrefetch: [() => false, () => false, () => false],
      };

      vi.spyOn(router, 'route').mockReturnValue({
        status: 200,
        content: 'app html',
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.spaPrefetch).toBeFalsy();
      expect(response.status).toBe(200);
      expect(appFactory).toHaveBeenCalled();
    });

    it('should render overloaded message when degradation logic indicates', async () => {
      environment.$Server.degradation = {
        isOverloaded: () => true,
      };

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(503);
      expect(response.static).toBeTruthy();
      expect(response.cache).toBeFalsy();
    });

    it('should not render overloaded message when degradation logic returns false', async () => {
      environment.$Server.degradation = {
        isOverloaded: () => false,
      };

      vi.spyOn(router, 'route').mockReturnValue({
        status: 200,
        content: 'app html',
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.status).toBe(200);
      expect(response.content).toBe('app html');
    });

    it('should render overloaded message with array degradation functions', async () => {
      environment.$Server.degradation = {
        isOverloaded: [
          () => false,
          () => true, // Second function triggers overload
        ],
      };

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(503);
      expect(response.static).toBeTruthy();
      expect(response.cache).toBeFalsy();
    });

    it('should render SPA page when degradation logic indicates', async () => {
      environment.$Server.degradation = {
        isSPA: () => true,
      };

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.cache).toBeFalsy();
    });

    it('should render SPA page with array degradation functions', async () => {
      environment.$Server.degradation = {
        isSPA: [
          () => false,
          () => false,
          () => true, // Third function triggers SPA
        ],
      };

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.cache).toBeFalsy();
    });

    it('should render static page when degradation logic indicates', async () => {
      serverGlobal.set('dummyApp', appFactory().ima.createImaApp());
      environment.$Server.degradation = {
        isStatic: () => true,
      };

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(404);
      expect(response.static).toBeTruthy();
      expect(response.cache).toBeFalsy();
    });

    it('should render static page with array degradation functions', async () => {
      serverGlobal.set('dummyApp', appFactory().ima.createImaApp());
      environment.$Server.degradation = {
        isStatic: [
          () => false,
          () => true, // Second function triggers static
        ],
      };

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(404);
      expect(response.static).toBeTruthy();
      expect(response.cache).toBeFalsy();
    });

    it('should render 404 app page when degradation logic returns false', async () => {
      vi.spyOn(router, 'route').mockReturnValue({
        status: 404,
        content: '404 page',
      });
      environment.$Server.degradation = {
        isStatic: () => false,
      };

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(404);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.content).toBe('404 page');
    });

    it('should redirect page with 301 status when degradation logic indicates static', async () => {
      vi.spyOn(router, 'route').mockRejectedValue(
        new GenericError('Redirect', {
          status: 301,
          url: 'https://imajs.io',
        })
      );
      vi.spyOn(router, 'isRedirection').mockReturnValue(true);
      vi.spyOn(router, 'getCurrentRouteInfo').mockReturnValue({
        route: {
          getName() {
            return 'home ';
          },
        },
      });

      environment.$Server.degradation = {
        isStatic: () => true,
      };

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(301);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.content).toBeNull();
      expect(RES.redirect).toHaveBeenCalled();
    });

    it('should redirect page with 301 status when degradation logic returns false', async () => {
      vi.spyOn(router, 'route');
      vi.spyOn(router, 'route').mockRejectedValue(
        new GenericError('Redirect', {
          status: 301,
          url: 'https://imajs.io',
        })
      );
      vi.spyOn(router, 'isRedirection').mockReturnValue(true);
      environment.$Server.degradation = {
        isStatic: () => false,
      };

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

    it('should return JSON response for controllers with json response type', async () => {
      const state = { json: 'data' };
      pageStateManager.getState.mockReturnValue(state);

      const controller = { $responseType: 'json' };

      const route = {
        getName() {
          return 'jsonRoute';
        },
        getController: vi.fn().mockResolvedValue(controller),
      };

      vi.spyOn(router, 'getCurrentRouteInfo').mockReturnValue({ route });
      vi.spyOn(router, 'route').mockResolvedValue({
        status: 200,
        content: 'html content that should be ignored',
      });

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.status).toBe(200);
      expect(response.content).toBe(JSON.stringify(state));
      expect(response.SPA).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.cache).toBeFalsy();
      expect(RES.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/json'
      );
    });
  });

  describe('errorHandlerMiddleware method', () => {
    it('should render dev error page for $Debug mode', async () => {
      environment.$Debug = true;
      process.env.IMA_CLI_WATCH = 'true';
      global.$IMA_SERVER = {
        viteDevServer: {
          ssrFixStacktrace: vi.fn(),
        },
      };
      const error = new Error('Custom');

      const response = await serverApp.errorHandlerMiddleware(error, REQ, RES);
      delete process.env.IMA_CLI_WATCH;

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(500);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.content).toBe('dev error page');
      expect(response.error).toEqual(error);
      expect(
        global.$IMA_SERVER.viteDevServer.ssrFixStacktrace
      ).toHaveBeenCalledWith(error);

      delete global.$IMA_SERVER;
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
