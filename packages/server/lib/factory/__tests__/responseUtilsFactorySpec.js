'use strict';

const responseUtilsFactory = require('../responseUtilsFactory.js');

const manifestMock = require('../__mocks__/manifest.json');

jest.mock('crypto', () => ({
  randomUUID: () => 'UUID',
}));

jest.mock('fs', () => {
  const { toMockedInstance } = jest.requireActual('to-mock');
  const originalModule = jest.requireActual('fs');

  return {
    ...toMockedInstance(originalModule, {
      existsSync() {
        return true;
      },
      readFileSync(path) {
        if (path.endsWith('manifest.json')) {
          return JSON.stringify(manifestMock);
        }

        return 'runner#{scriptResources}';
      },
    }),
  };
});

describe('responseUtilsFactory', () => {
  const nowMock = jest.spyOn(global.Date, 'now').mockReturnValue('now');
  const randomMock = jest.spyOn(global.Math, 'random').mockReturnValue(0);

  const {
    processContent,
    createContentVariables,
    sendResponseHeaders,
    _prepareCookieOptionsForExpress,
  } = responseUtilsFactory({ applicationFolder: 'applicationFolder' });

  nowMock.mockRestore();
  randomMock.mockRestore();

  let event;

  beforeEach(() => {
    event = {
      res: {
        cookie: jest.fn(),
        set: jest.fn(),
        locals: {},
      },
      context: {
        response: {
          content: '<html>#{styles}#{revivalSettings}#{runner}</html>',
          contentVariables: {},
          page: {},
        },
        bootConfig: {
          settings: {
            $Language: 'en',
            $Debug: true,
          },
        },
      },
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('_prepareCookieOptionsForExpress', () => {
    it('should convert cookie maxAge to ms for Express', () => {
      let options = { maxAge: 1 };
      let expressOptions = _prepareCookieOptionsForExpress(options);

      expect(options.maxAge).toBe(1);
      expect(expressOptions.maxAge).toBe(1000);
    });

    it('should remove cookie maxAge: null for Express', () => {
      // Because Express converts null to 0, which is not intended.
      let options = { maxAge: null };
      let expressOptions = _prepareCookieOptionsForExpress(options);

      expect(options.maxAge).toBeNull();
      expect(expressOptions.maxAge).toBeUndefined();
    });
  });

  describe('sendResponseHeaders', () => {
    it('should set page cookie to response headers', () => {
      const cookie = new Map();
      cookie.set('namex', { value: 1, options: {} });
      cookie.set('namey', { value: 2, options: {} });

      event.context.response.page.cookie = cookie;

      sendResponseHeaders(event);

      expect(event.res.cookie).toHaveBeenCalledTimes(2);
      expect(event.res.cookie.mock.calls[0]).toEqual(['namex', 1, {}]);
      expect(event.res.cookie.mock.calls[1]).toEqual(['namey', 2, {}]);
    });

    it('should set page headers to response headers', () => {
      event.context.response.page.headers = {
        'Content-Type': 'text/html',
      };

      sendResponseHeaders(event);

      expect(event.res.set).toHaveBeenCalledTimes(1);
      expect(event.res.set.mock.calls[0][0]).toEqual(
        event.context.response.page.headers
      );
    });
  });
  describe('createContentVariables', () => {
    it('should return empty object if there is no valid bootConfig', () => {
      expect(createContentVariables({ context: {} })).toStrictEqual({});
      expect(
        createContentVariables({ context: { bootConfig: null } })
      ).toStrictEqual({});
      expect(
        createContentVariables({ context: { bootConfig: {} } })
      ).toStrictEqual({});
      expect(
        createContentVariables({ context: { bootConfig: { settings: null } } })
      ).toStrictEqual({});
    });

    it('should generate base set of content variables', () => {
      expect(createContentVariables(event)).toMatchSnapshot();
    });
  });

  describe('processContent', () => {
    it('should return original content without any boot config', () => {
      event.context.response.content = 'content';

      expect(processContent(event)).toBe('content');
    });

    it('should interpolate revival scripts into page content', () => {
      event.context.response.contentVariables = createContentVariables(event);

      const content = processContent(event);
      expect(content).toMatchSnapshot();
    });

    it('should allow overrides through custom $Source definition', () => {
      event.context.bootConfig.settings.$Resources = (
        context,
        manifest,
        sources
      ) => {
        return {
          styles: [],
          esScripts: [...sources.scripts, 'custom-script-src'],
        };
      };
      event.context.response.contentVariables = createContentVariables(event);

      const content = processContent(event);

      expect(content).toMatchSnapshot();
    });

    it('should interpolate deep embedded variables', () => {
      event.context.response.content = '<html>#{v1}</html>';
      event.context.response.contentVariables = {
        v1: '#{v2}',
        v2: '#{v3}',
        v3: '#{v4}',
        v4: '#{v5}',
        v5: '#{v6}',
        v6: '#{v7}',
        v7: 'final v7 content',
      };

      const content = processContent(event);

      expect(content).toBe('<html>final v7 content</html>');
    });

    it('should allow interpolation of settings variables from bootConfig', () => {
      event.context.bootConfig.settings.$Version = '1.0.0';
      event.context.response.content = '<html>#{c1}: #{$Version}</html>';
      event.context.response.contentVariables = {
        c1: 'content-variable',
      };

      const content = processContent(event);

      expect(content).toBe('<html>content-variable: 1.0.0</html>');
    });
  });
});
