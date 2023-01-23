'use strict';

const responseUtilsFactory = require('../responseUtilsFactory.js');
const manifestMock = require('../__mocks__/manifest.json');

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

        return 'runner#{source}';
      },
    }),
  };
});

describe('responseUtilsFactory', () => {
  const {
    processContent,
    createContentVariables,
    _renderStyles,
    _prepareCookieOptionsForExpress,
    _prepareSource,
  } = responseUtilsFactory();

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('_renderStyles', () => {
    it('should return empty string for invalid input', () => {
      expect(_renderStyles()).toBe('');
      expect(_renderStyles([])).toBe('');
      expect(_renderStyles({})).toBe('');
      expect(_renderStyles(null)).toBe('');
      expect(_renderStyles('/static/app.css')).toBe('');
    });

    it('should return link stylesheet tags for string items', () => {
      expect(_renderStyles(['/static/app.css'])).toBe(
        '<link rel="stylesheet" href="/static/app.css" />'
      );

      expect(
        _renderStyles([
          '/static/app1.css',
          '/static/app2.css',
          '/static/app3.css',
        ])
      ).toBe(
        '<link rel="stylesheet" href="/static/app1.css" />' +
          '<link rel="stylesheet" href="/static/app2.css" />' +
          '<link rel="stylesheet" href="/static/app3.css" />'
      );
    });

    it('should return link tag with custom attributes', () => {
      expect(
        _renderStyles([
          [
            '/static/app.css',
            { type: 'text/css', rel: 'preload', as: 'style' },
          ],
        ])
      ).toBe(
        '<link href="/static/app.css" rel="preload" type="text/css" as="style" />'
      );
    });

    it('should insert custom mini script for fallback sources', () => {
      expect(
        _renderStyles([
          [
            '/static/app.css',
            { rel: 'stylesheet', fallback: '/static/fallback.css' },
          ],
        ])
      ).toBe(
        `<link href="/static/app.css" rel="stylesheet" onerror="this.onerror=null;this.href='/static/fallback.css';" />`
      );
    });
  });

  describe('_prepareSource', () => {
    it('should prepare default sources structure from provided manifest file', () => {
      expect(_prepareSource(manifestMock, 'en')).toMatchSnapshot();
    });

    it('should add fallbacks when IMA_PUBLIC_PATH is defined', () => {
      process.env.IMA_PUBLIC_PATH = 'cdn://';

      expect(_prepareSource(manifestMock, 'en')).toMatchSnapshot();
      process.env.IMA_PUBLIC_PATH = '';
    });

    it('should add fallbacks when IMA_PUBLIC_PATH is defined, with proper custom config publicPath', () => {
      process.env.IMA_PUBLIC_PATH = 'cdn://';

      expect(
        _prepareSource(
          {
            ...manifestMock,
            publicPath: '/pro/static/',
          },
          'en'
        )
      ).toMatchSnapshot();
      process.env.IMA_PUBLIC_PATH = '';
    });

    // TODO IMA@19 remove CDN_STATIC_ROOT_URL in favor of IMA_PUBLIC_PATH >>>
    it('dEPRECATED: should add fallbacks when CDN_STATIC_ROOT_URL is defined', () => {
      process.env.CDN_STATIC_ROOT_URL = 'cdn://';

      expect(_prepareSource(manifestMock, 'en')).toMatchSnapshot();
      process.env.CDN_STATIC_ROOT_URL = '';
    });
    // TODO IMA@19 <<<

    it('should skip compilations without assets', () => {
      const sources = _prepareSource(
        {
          ...manifestMock,
          assetsByCompiler: {
            ...manifestMock.assetsByCompiler,
            client: {},
          },
        },
        'en'
      );

      expect(sources).toMatchSnapshot();
    });
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

  describe('createContentVariables', () => {
    it('should return empty object if there is no valid bootConfig', () => {
      expect(createContentVariables({})).toStrictEqual({});
      expect(createContentVariables({ bootConfig: null })).toStrictEqual({});
      expect(createContentVariables({ bootConfig: {} })).toStrictEqual({});
      expect(
        createContentVariables({ bootConfig: { settings: null } })
      ).toStrictEqual({});
    });

    it('should generate base set of content variables', () => {
      const response = {
        content: '<html>#{styles}#{revivalSettings}#{runner}</html>',
      };
      const bootConfig = {
        settings: {
          $Language: 'en',
          $Debug: true,
        },
      };

      expect(
        createContentVariables({ bootConfig, response })
      ).toMatchSnapshot();
    });
  });

  describe('processContent', () => {
    it('should return original content without any boot config', () => {
      expect(processContent({ response: { content: 'content' } })).toBe(
        'content'
      );
    });

    it('should interpolate revival scripts into page content', () => {
      const bootConfig = {
        settings: {
          $Language: 'en',
          $Debug: true,
        },
      };
      const response = {
        content: '<html>#{styles}#{revivalSettings}#{runner}</html>',
        contentVariables: createContentVariables({ bootConfig, response: {} }),
      };
      const contextMock = { response, bootConfig };

      const content = processContent(contextMock);
      expect(content).toMatchSnapshot();
    });

    it('should allow overrides through custom $Source definition', () => {
      const bootConfig = {
        settings: {
          $Language: 'en',
          $Debug: true,
          $Source: (context, manifest, sources) => {
            return {
              styles: [],
              esScripts: [...sources.scripts, 'custom-script-src'],
            };
          },
        },
      };
      const response = {
        content: '<html>#{styles}#{revivalSettings}#{runner}</html>',
        contentVariables: createContentVariables({ bootConfig, response: {} }),
      };
      const contextMock = { response, bootConfig };
      const content = processContent(contextMock);

      expect(content).toMatchSnapshot();
    });

    it('should interpolate deep embedded variables', () => {
      const bootConfig = {
        settings: {
          $Language: 'en',
          $Debug: true,
        },
      };
      const response = {
        content: '<html>#{v1}</html>',
        contentVariables: {
          v1: '#{v2}',
          v2: '#{v3}',
          v3: '#{v4}',
          v4: '#{v5}',
          v5: '#{v6}',
          v6: '#{v7}',
          v7: 'final v7 content',
        },
      };
      const contextMock = { response, bootConfig };
      const content = processContent(contextMock);

      expect(content).toBe('<html>final v7 content</html>');
    });

    it('should allow interpolation of settings variables from bootConfig', () => {
      const bootConfig = {
        settings: {
          $Language: 'en',
          $Version: '1.0.0',
          $Debug: true,
        },
      };
      const response = {
        content: '<html>#{c1}: #{$Version}</html>',
        contentVariables: {
          c1: 'content-variable',
        },
      };
      const contextMock = { response, bootConfig };
      const content = processContent(contextMock);

      expect(content).toBe('<html>content-variable: 1.0.0</html>');
    });
  });
});
