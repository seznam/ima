const path = require('path');

jest.mock('fs', () => {
  const { toMockedInstance } = jest.requireActual('to-mock');
  const originalModule = jest.requireActual('fs');

  return {
    ...toMockedInstance(originalModule, {
      existsSync() {
        return true;
      },
      readFileSync(filePath) {
        if (filePath.includes('spa.ejs')) {
          return '<html><body><div id="app">SPA <%= typeof spaPrefetch !== "undefined" && spaPrefetch ? "Prefetch" : "" %></div></body></html>';
        }
        if (filePath.includes('500.ejs')) {
          return '<html><body>500 Error</body></html>';
        }
        if (filePath.includes('400.ejs')) {
          return '<html><body>404 Error</body></html>';
        }
        return 'file content';
      },
    }),
  };
});

describe('Static Page Factory - SPA Prefetch', () => {
  let staticPageFactory;
  let environment;
  let instanceRecycler;
  let createBootConfig;
  let applicationFolder;

  beforeEach(() => {
    applicationFolder = path.join(__dirname, '../../../');
    environment = {
      $Server: {
        template: {
          spa: null,
          500: null,
          400: null,
        },
      },
    };

    instanceRecycler = {
      getConcurrentRequests: jest.fn().mockReturnValue(5),
    };

    createBootConfig = jest.fn(event => {
      event.context = event.context || {};
      event.context.bootConfig = {
        services: {},
        settings: {},
      };
    });

    staticPageFactory = require('../staticPageFactory.js')({
      applicationFolder,
      instanceRecycler,
      createBootConfig,
      environment,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('renderStaticSPAPrefetchPage', () => {
    it('should render SPA prefetch page with correct flags', () => {
      const event = {
        req: {
          headers: {
            'user-agent': 'Mozilla/5.0',
          },
        },
        res: {},
        context: {
          bootConfig: {},
        },
        spaPrefetch: true,
      };

      const result = staticPageFactory.renderStaticSPAPrefetchPage(event);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('static', true);
      expect(result).toHaveProperty('spaPrefetch', true);
      expect(result.content).toContain('SPA Prefetch');
    });

    it('should not call createBootConfig (app already initialized)', () => {
      const event = {
        req: {
          headers: {
            'user-agent': 'Mozilla/5.0',
          },
        },
        res: {},
        context: {
          bootConfig: {
            services: {},
          },
        },
        spaPrefetch: true,
      };

      staticPageFactory.renderStaticSPAPrefetchPage(event);

      // createBootConfig should NOT be called for prefetch page
      // since the app is already initialized
      expect(createBootConfig).not.toHaveBeenCalled();
    });

    it('should render using the same SPA template', () => {
      const spaEvent = {
        req: { headers: {} },
        res: {},
        context: {},
        spaPrefetch: false,
      };

      const prefetchEvent = {
        req: { headers: {} },
        res: {},
        context: { bootConfig: {} },
        spaPrefetch: true,
      };

      const spaResult = staticPageFactory.renderStaticSPAPage(spaEvent);
      const prefetchResult =
        staticPageFactory.renderStaticSPAPrefetchPage(prefetchEvent);

      // Both should use the same template, but with different context
      expect(spaResult.content).toContain('SPA');
      expect(prefetchResult.content).toContain('SPA Prefetch');
    });

    it('should return correct response structure', () => {
      const event = {
        req: { headers: {} },
        res: {},
        context: { bootConfig: {} },
        spaPrefetch: true,
      };

      const result = staticPageFactory.renderStaticSPAPrefetchPage(event);

      // Verify the response structure
      expect(result).toMatchObject({
        content: expect.any(String),
        static: true,
        spaPrefetch: true,
      });

      // Should NOT have SPA or status properties (those are set elsewhere)
      expect(result).not.toHaveProperty('SPA');
      expect(result).not.toHaveProperty('status');
    });
  });

  describe('renderStaticSPAPage vs renderStaticSPAPrefetchPage', () => {
    it('should have different response structures', () => {
      const spaEvent = {
        req: { headers: {} },
        res: {},
        context: {},
        spaPrefetch: false,
      };

      const prefetchEvent = {
        req: { headers: {} },
        res: {},
        context: { bootConfig: {} },
        spaPrefetch: true,
      };

      const spaResult = staticPageFactory.renderStaticSPAPage(spaEvent);
      const prefetchResult =
        staticPageFactory.renderStaticSPAPrefetchPage(prefetchEvent);

      // SPA page has more properties
      expect(spaResult).toMatchObject({
        content: expect.any(String),
        status: 200,
        SPA: true,
        static: true,
      });

      // SPA prefetch page has minimal properties
      expect(prefetchResult).toMatchObject({
        content: expect.any(String),
        static: true,
        spaPrefetch: true,
      });

      // SPA prefetch should NOT have SPA flag or status
      expect(prefetchResult.SPA).toBeUndefined();
      expect(prefetchResult.status).toBeUndefined();
    });

    it('should call createBootConfig only for SPA page', () => {
      const spaEvent = {
        req: { headers: {} },
        res: {},
        context: {},
        spaPrefetch: false,
      };

      const prefetchEvent = {
        req: { headers: {} },
        res: {},
        context: { bootConfig: {} },
        spaPrefetch: true,
      };

      createBootConfig.mockClear();
      staticPageFactory.renderStaticSPAPage(spaEvent);
      expect(createBootConfig).toHaveBeenCalledTimes(1);

      createBootConfig.mockClear();
      staticPageFactory.renderStaticSPAPrefetchPage(prefetchEvent);
      expect(createBootConfig).not.toHaveBeenCalled();
    });
  });

  describe('Custom SPA template', () => {
    it('should use custom SPA template path if provided', () => {
      const customTemplatePath = '/custom/template/spa.ejs';
      environment.$Server.template.spa = customTemplatePath;

      const customStaticPageFactory = require('../staticPageFactory.js')({
        applicationFolder,
        instanceRecycler,
        createBootConfig,
        environment,
      });

      const event = {
        req: { headers: {} },
        res: {},
        context: { bootConfig: {} },
        spaPrefetch: true,
      };

      // This should not throw, as our mock handles any path with 'spa.ejs'
      const result = customStaticPageFactory.renderStaticSPAPrefetchPage(event);
      expect(result).toHaveProperty('content');
    });
  });

  describe('Error pages should not be affected', () => {
    it('should render 500 error page normally', () => {
      const event = {
        req: { headers: {} },
        res: {},
        error: new Error('Test error'),
        context: {},
      };

      const result = staticPageFactory.renderStaticServerErrorPage(event);

      expect(result).toMatchObject({
        status: 500,
        SPA: false,
        static: true,
      });
      expect(result.content).toContain('500 Error');
    });

    it('should render 404 error page normally', () => {
      const event = {
        req: { headers: {} },
        res: {},
        error: new Error('Not found'),
        context: {},
      };

      const result = staticPageFactory.renderStaticClientErrorPage(event);

      expect(result).toMatchObject({
        status: 404,
        SPA: false,
        static: true,
      });
      expect(result.content).toContain('404 Error');
    });

    it('should render overloaded page normally', () => {
      const event = {
        req: { headers: {} },
        res: {},
        context: {},
      };

      const result = staticPageFactory.renderOverloadedPage(event);

      expect(result).toMatchObject({
        status: 503,
        SPA: false,
        static: true,
      });
      expect(result).toHaveProperty('content');
    });
  });
});
