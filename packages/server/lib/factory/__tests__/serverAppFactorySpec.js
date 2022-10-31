const serverAppFactory = require('../serverAppFactory.js');
const { Emitter, Event } = require('../../emitter.js');
const instanceRecycler = require('../../instanceRecycler.js');
const serverGlobal = require('../../serverGlobal.js');

jest.mock('fs', () => {
  const { toMockedInstance } = jest.requireActual('to-mock');
  const originalModule = jest.requireActual('fs');

  return {
    ...toMockedInstance(originalModule, {
      existsSync() {
        return true;
      },
      readFileSync() {
        return 'read file content';
      },
    }),
  };
});

jest.mock('../devErrorPageFactory.js', () => {
  return () => {
    return jest.fn(({ error }) => ({
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
  let pageStateManager = null;
  let emitter = new Emitter();

  beforeEach(() => {
    logger = console;
    environment = {
      $Debug: true,
      $Source: () => ({
        styles: ['/static/css/app.css'],
        scripts: [
          ['/static/locale/#{$Language}.js?v=#{$Version}', { async: true }],
          ['/static/js/vendors.js?v=#{$Version}', { async: true }],
          ['/static/js/app.client.js?v=#{$Version}', { async: true }],
        ],
        esScripts: [
          ['/static/locale/#{$Language}.js?v=#{$Version}', { async: true }],
          ['/static/js.es/vendors.js?v=#{$Version}', { async: true }],
          ['/static/js.es/app.client.js?v=#{$Version}', { async: true }],
        ],
      }),
      $Server: {
        badRequestConcurrency: 1,
        cache: {
          enabled: true,
        },
        serveSPA: {
          allow: true,
        },
      },
    };
    devErrorPage = jest.fn(({ error }) => ({
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
    languageLoader = jest.fn();
    applicationFolder = '';

    router = {
      init: jest.fn(),
      route: jest.fn(),
      getPath: jest.fn(),
      getCurrentRouteInfo: jest.fn(() => {
        return {
          route: {
            getName() {
              return 'notfound';
            },
          },
        };
      }),
    };

    cache = {
      serialize: jest
        .fn()
        .mockReturnValue(JSON.stringify({ cacheKey: 'cacheValue' })),
    };

    pageStateManager = {
      getState: jest.fn().mockReturnValue({ page: 'state' }),
    };

    appFactory = jest.fn(() => {
      return {
        getInitialAppConfigFunctions: jest.fn(),
        ima: {
          createImaApp: jest.fn(() => {
            return {
              bootstrap: {
                run: jest.fn(),
              },
              oc: {
                // TODO IMA@18+ change for imports from @ima/core
                get(name) {
                  if (name === '$Router') {
                    return router;
                  }

                  if (name === '$Request') {
                    return {
                      init: jest.fn(),
                    };
                  }

                  if (name === '$Response') {
                    return {
                      init: jest.fn(),
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
                },
                clear() {},
              },
            };
          }),
          getInitialPluginConfig: jest.fn(),
          getInitialImaConfigFunctions: jest.fn(),
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
    };
    RES = {
      status: jest.fn(),
      send: jest.fn(),
      set: jest.fn(),
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
      instanceRecycler,
      serverGlobal,
    });

    serverApp.useIMADefaultHook();
  });

  afterEach(() => {
    jest.resetAllMocks();
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

    it('should render SPA page without cache', async () => {
      jest
        .spyOn(instanceRecycler, 'hasReachedMaxConcurrentRequests')
        .mockReturnValue(true);

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.cache).toBeFalsy();
    });

    // TODO IMA@18 need performance test for usefulness
    // it('should render SPA page with cache', async () => {
    //   jest
    //     .spyOn(instanceRecycler, 'hasReachedMaxConcurrentRequests')
    //     .mockReturnValue(true);

    //   await serverApp.requestHandlerMiddleware(REQ, RES);
    //   const page = await serverApp.requestHandlerMiddleware(REQ, RES);

    //   expect(page.SPA).toBeTruthy();
    //   expect(page.status).toEqual(200);
    //   expect(page.cache).toBeTruthy();
    // });

    it('should render overloaded message', async () => {
      environment.$Server.overloadConcurrency = 0;

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(503);
      expect(response.status).toBeTruthy();
      expect(response.cache).toBeFalsy();
    });

    it('should render 404 static page for exceed badRequestConcurrency', async () => {
      environment.$Server.badRequestConcurrency = 0;

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(404);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeTruthy();
    });

    it('should render 404 app page for not exceed badRequestConcurrency', async () => {
      jest.spyOn(router, 'route').mockReturnValue({
        status: 404,
        content: '404 page',
      });
      environment.$Server.badRequestConcurrency = 100;

      const response = await serverApp.requestHandlerMiddleware(REQ, RES);

      expect(response.SPA).toBeFalsy();
      expect(response.status).toBe(404);
      expect(response.cache).toBeFalsy();
      expect(response.static).toBeFalsy();
      expect(response.content).toBe('404 page');
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
      const error = new Error('Custom');

      const response = await serverApp.errorHandlerMiddleware(error, REQ, RES);

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

    it('should render static error page for overloaded server', async () => {
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

    //console.log('PAGE', page);

    expect(true).toBeTruthy();
  });
});
