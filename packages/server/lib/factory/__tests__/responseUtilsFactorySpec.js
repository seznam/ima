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

        return '---runner content---';
      },
    }),
  };
});

describe('responseUtilsFactory', () => {
  const {
    _renderStyles,
    _prepareCookieOptionsForExpress,
    _prepareSources,
    _resolveSources,
  } = responseUtilsFactory();

  afterAll(() => {
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

  describe('_prepareSources', () => {
    it('should prepare default sources structure from provided manifest file', () => {
      expect(_prepareSources(manifestMock)).toMatchInlineSnapshot(`
        {
          "esScripts": [
            [
              "static/js.es/app.client.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
            [
              "static/js.es/vendors.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
            [
              "static/js.es/locale/#{$Language}.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
          ],
          "scripts": [
            [
              "static/js/app.client.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
            [
              "static/js/vendors.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
            [
              "static/js/locale/#{$Language}.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
          ],
          "styles": [
            [
              "static/css/app.css",
              {
                "rel": "stylesheet",
              },
            ],
          ],
        }
      `);
    });

    it('should replace language files with placeholder source', () => {
      const sources = _prepareSources(manifestMock);

      // Validate inputs
      expect(
        Object.values(manifestMock.assetsByCompiler['client.es']).filter(
          ({ name }) => name.includes('/locale/')
        )
      ).toHaveLength(2);
      expect(
        Object.values(manifestMock.assetsByCompiler['client']).filter(
          ({ name }) => name.includes('/locale/')
        )
      ).toHaveLength(2);
      expect(
        Object.values(manifestMock.assetsByCompiler['server']).filter(
          ({ name }) => name.includes('/locale/')
        )
      ).toHaveLength(2);

      // Validate outputs
      expect(
        sources.styles.filter(([sourceName]) => sourceName.includes('/locale/'))
      ).toHaveLength(0);
      expect(
        sources.scripts.filter(([sourceName]) =>
          sourceName.includes('/locale/')
        )
      ).toHaveLength(1);
      expect(
        sources.esScripts.filter(([sourceName]) =>
          sourceName.includes('/locale/')
        )
      ).toHaveLength(1);
    });

    it('should skip compilations without assets', () => {
      const sources = _prepareSources({
        ...manifestMock,
        assetsByCompiler: {
          ...manifestMock.assetsByCompiler,
          client: {},
        },
      });

      expect(sources).toMatchInlineSnapshot(`
        {
          "esScripts": [
            [
              "static/js.es/app.client.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
            [
              "static/js.es/vendors.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
            [
              "static/js.es/locale/#{$Language}.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
          ],
          "scripts": [],
          "styles": [
            [
              "static/css/app.css",
              {
                "rel": "stylesheet",
              },
            ],
          ],
        }
      `);
    });
  });

  describe('_resolveSources', () => {
    it('should resolve source placeholders to real files', () => {
      const sources = _prepareSources(manifestMock);
      _resolveSources(sources, manifestMock, 'en');

      expect(sources).toMatchInlineSnapshot(`
        {
          "esScripts": [
            [
              "/static/js.es/app.client.2106a34c6b8bbad8.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
            [
              "/static/js.es/vendors.a873907f25297544.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
            [
              "/static/js.es/locale/en.371127fdbfbe93d2.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
          ],
          "scripts": [
            [
              "/static/js/app.client.8dc14fd2c9e52eef.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
            [
              "/static/js/vendors.0e456297851f0a3a.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
            [
              "/static/js/locale/en.3c6a5e7a55bb2ab4.js",
              {
                "async": true,
                "crossorigin": "anonymous",
              },
            ],
          ],
          "styles": [
            [
              "/static/css/app.d0ad44d05f82db5f.css",
              {
                "rel": "stylesheet",
              },
            ],
          ],
        }
      `);
    });
  });

  describe('', () => {
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
});
