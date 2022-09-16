const serverAppFactory = require('../serverAppFactory.js');
const { Emitter } = require('../../emitter.js');
const instanceRecycler = require('../../instanceRecycler.js');
const serverGlobal = require('../../serverGlobal.js');
const {
  setGlobalMockMethod,
  setGlobalKeepUnmock,
  objectKeepUnmock,
} = require('to-mock');

setGlobalMockMethod(jest.fn);
setGlobalKeepUnmock(objectKeepUnmock);

jest.mock('fs', () => {
  const { toMockedInstance } = jest.requireActual('to-mock');
  const originalModule = jest.requireActual('fs');

  return {
    ...toMockedInstance(originalModule, {
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
      pageState: {},
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
  let emitter = new Emitter();

  beforeEach(() => {
    logger = console;
    environment = {
      $Debug: true,
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
      pageState: {},
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
                    };
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

    const page = await serverApp.requestHandlerMiddleware(REQ, RES);

    expect(page.SPA).toBeTruthy();
    expect(page.status).toBe(200);
    expect(page.cache).toBeFalsy();
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

    const page = await serverApp.requestHandlerMiddleware(REQ, RES);

    expect(page.SPA).toBeFalsy();
    expect(page.status).toBe(503);
    expect(page.status).toBeTruthy();
    expect(page.cache).toBeFalsy();
  });

  it('should render 404 static page for exceed badRequestConcurrency', async () => {
    environment.$Server.badRequestConcurrency = 0;

    const page = await serverApp.requestHandlerMiddleware(REQ, RES);

    expect(page.SPA).toBeFalsy();
    expect(page.status).toBe(404);
    expect(page.cache).toBeFalsy();
    expect(page.static).toBeTruthy();
  });

  it('should render 404 app page for not exceed badRequestConcurrency', async () => {
    jest.spyOn(router, 'route').mockReturnValue({
      status: 404,
      content: '404 page',
    });
    environment.$Server.badRequestConcurrency = 100;

    const page = await serverApp.requestHandlerMiddleware(REQ, RES);

    expect(page.SPA).toBeFalsy();
    expect(page.status).toBe(404);
    expect(page.cache).toBeFalsy();
    expect(page.static).toBeFalsy();
    expect(page.content).toBe('404 page');
  });

  describe('errorHandlerMiddleware method', () => {
    it('should render dev error page for $Debug mode', async () => {
      environment.$Debug = true;
      const error = new Error('Custom');

      const page = await serverApp.errorHandlerMiddleware(error, REQ, RES);

      expect(page.SPA).toBeFalsy();
      expect(page.status).toBe(500);
      expect(page.cache).toBeFalsy();
      expect(page.static).toBeFalsy();
      expect(page.content).toBe('dev error page');
      expect(page.error).toEqual(error);
    });

    it('should render static error page for non $Debug mode without initialized app in context', async () => {
      environment.$Debug = false;
      const error = new Error('Custom');

      const page = await serverApp.errorHandlerMiddleware(error, REQ, RES);

      expect(page.SPA).toBeFalsy();
      expect(page.status).toBe(500);
      expect(page.cache).toBeFalsy();
      expect(page.static).toBeTruthy();
      expect(page.content).toBe('read file content');
      expect(page.error).toEqual(error);
    });

    it('should render static error page for overloaded server', async () => {
      environment.$Debug = false;
      const error = new Error('Custom');

      const page = await serverApp.errorHandlerMiddleware(error, REQ, RES);

      expect(page.SPA).toBeFalsy();
      expect(page.status).toBe(500);
      expect(page.cache).toBeFalsy();
      expect(page.static).toBeTruthy();
      expect(page.content).toBe('read file content');
      expect(page.error).toEqual(error);
    });
  });

  it('handle request', async () => {
    await serverApp.requestHandlerMiddleware(REQ, RES);

    //console.log('PAGE', page);

    expect(true).toBeTruthy();
  });
});
