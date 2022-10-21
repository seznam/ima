'use strict';

const responseUtilsFactory = require('../responseUtilsFactory.js');

jest.mock('fs', () => {
  const { toMockedInstance } = jest.requireActual('to-mock');
  const originalModule = jest.requireActual('fs');

  return {
    ...toMockedInstance(originalModule, {
      existsSync() {
        return true;
      },
      readFileSync() {
        return '---runner content---';
      },
    }),
  };
});

describe('responseUtilsFactory', () => {
  const { _renderStyles } = responseUtilsFactory();

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
        '<link href="/static/app.css" type="text/css" rel="preload" as="style" />'
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
        `<link href="/static/app.css" onerror="this.onerror=null;this.href='/static/fallback.css';" rel="stylesheet" />`
      );
    });
  });
});
