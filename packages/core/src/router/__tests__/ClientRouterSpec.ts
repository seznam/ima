/**
 * @jest-environment jsdom
 */

import { toMockedInstance } from 'to-mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Settings } from '../..';
import { Dispatcher } from '../../event/Dispatcher';
import { PageManager } from '../../page/manager/PageManager';
import { ClientWindow } from '../../window/ClientWindow';
import { ActionTypes } from '../ActionTypes';
import { ClientRouter } from '../ClientRouter';
import { RouteFactory } from '../RouteFactory';

describe('ima.core.router.ClientRouter', () => {
  let router: ClientRouter;
  const pageRenderer = toMockedInstance(PageManager);
  const routeFactory = toMockedInstance(RouteFactory);
  const dispatcher = toMockedInstance(Dispatcher);
  const window = new ClientWindow();
  const host = 'locahlost:3002';
  const protocol = 'http:';
  const routerConfig = {
    $Protocol: protocol,
    $Root: '',
    $LanguagePartPath: '',
    $Host: host,
  };

  let settings: Partial<Settings['$Router']>;

  beforeEach(() => {
    settings = {};
    router = new ClientRouter(
      pageRenderer,
      routeFactory,
      dispatcher,
      window,
      settings
    );

    vi.spyOn(router, 'getPath').mockReturnValue('/routePath');

    router.init(routerConfig);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return actual path', () => {
    vi.restoreAllMocks();
    vi.spyOn(window, 'getPath').mockReturnValue('');

    router.getPath();

    expect(window.getPath).toHaveBeenCalled();
  });

  it('should be return actual url', () => {
    vi.spyOn(window, 'getUrl').mockImplementation();

    router.getUrl();

    expect(window.getUrl).toHaveBeenCalled();
  });

  it('should add listener to popState event, click event', () => {
    vi.spyOn(window, 'bindEventListener').mockImplementation();

    router.listen();

    expect(window.bindEventListener).toHaveBeenCalledTimes(2);
  });

  it('should add listener to popState event, click event on custom element', () => {
    vi.spyOn(window, 'bindEventListener').mockImplementation();
    const customElement = document.createElement('div');

    router.listen(customElement);

    expect(window.bindEventListener).toHaveBeenCalledTimes(2);
    expect(window.bindEventListener).toHaveBeenCalledWith(
      customElement,
      'popstate',
      expect.any(Function)
    );
    expect(window.bindEventListener).toHaveBeenCalledWith(
      customElement,
      'click',
      expect.any(Function)
    );
  });

  it('should store custom element reference in routerRoots array', () => {
    const customElement = document.createElement('div');
    router.listen(customElement);

    expect(router['_routerRoots']).toContain(customElement);
  });

  it('should store multiple custom elements in routerRoots array', () => {
    const customElement1 = document.createElement('div');
    const customElement2 = document.createElement('div');

    router.listen(customElement1);
    router.listen(customElement2);

    expect(router['_routerRoots']).toContain(customElement1);
    expect(router['_routerRoots']).toContain(customElement2);
    expect(router['_routerRoots']).toHaveLength(2);
  });

  it('should cleanup listeners from specific custom element', () => {
    vi.spyOn(window, 'unbindEventListener').mockImplementation();
    const customElement1 = document.createElement('div');
    const customElement2 = document.createElement('div');

    router.listen(customElement1);
    router.listen(customElement2);
    router.unlisten(customElement1);

    expect(window.unbindEventListener).toHaveBeenCalledWith(
      customElement1,
      'popstate',
      expect.any(Function)
    );
    expect(window.unbindEventListener).toHaveBeenCalledWith(
      customElement1,
      'click',
      expect.any(Function)
    );
    expect(router['_routerRoots']).not.toContain(customElement1);
    expect(router['_routerRoots']).toContain(customElement2);
  });

  it('should cleanup all listeners with unlistenAll', () => {
    vi.spyOn(window, 'unbindEventListener').mockImplementation();
    const customElement1 = document.createElement('div');
    const customElement2 = document.createElement('div');

    router.listen(customElement1);
    router.listen(customElement2);
    router.unlistenAll();

    expect(window.unbindEventListener).toHaveBeenCalledWith(
      customElement1,
      'popstate',
      expect.any(Function)
    );
    expect(window.unbindEventListener).toHaveBeenCalledWith(
      customElement1,
      'click',
      expect.any(Function)
    );
    expect(window.unbindEventListener).toHaveBeenCalledWith(
      customElement2,
      'popstate',
      expect.any(Function)
    );
    expect(window.unbindEventListener).toHaveBeenCalledWith(
      customElement2,
      'click',
      expect.any(Function)
    );
    expect(router['_routerRoots']).toHaveLength(0);
  });

  it('should remove listener to popState event, click event', () => {
    vi.spyOn(window, 'unbindEventListener').mockImplementation();

    router.unlisten();

    expect(window.unbindEventListener).toHaveBeenCalledTimes(2);
  });

  describe('redirect method', () => {
    it('redirect to a new page', () => {
      const path = '/somePath';
      const url = protocol + '//' + host + path;
      const options = { httpStatus: 302 };

      vi.spyOn(router, 'route').mockImplementation();

      router.redirect(url, options);

      expect(router.route).toHaveBeenCalledWith(
        path,
        options,
        {
          type: ActionTypes.REDIRECT,
          event: undefined,
          url: 'http://locahlost:3002/somePath',
        },
        {}
      );
    });

    it('return null for non exist route', () => {
      const url = 'http://example.com/somePath/1';

      vi.spyOn(window, 'redirect').mockImplementation();

      router.init(routerConfig);
      router.redirect(url);

      expect(window.redirect).toHaveBeenCalledWith(url);
    });

    it('should redirect using native window methods when custom isSPARouted method is provided', () => {
      const url = 'http://example.com/somePath/2';

      vi.spyOn(window, 'redirect').mockImplementation();

      router = new ClientRouter(
        pageRenderer,
        routeFactory,
        dispatcher,
        window,
        {
          isSPARouted: () => false,
        }
      );

      router.init(routerConfig);
      router.redirect(url);

      expect(window.redirect).toHaveBeenCalledWith(url);
    });

    it("should handle SPA redirects, when custom isSPARouted method is provided but doesn't match", () => {
      const path = '/somePath';
      const url = protocol + '//' + host + path;
      const options = { httpStatus: 302 };

      router = new ClientRouter(
        pageRenderer,
        routeFactory,
        dispatcher,
        window,
        {
          isSPARouted: () => true,
        }
      );

      vi.spyOn(router, 'getPath').mockReturnValue('/routePath');
      vi.spyOn(router, 'route').mockImplementation();
      vi.spyOn(window, 'redirect').mockImplementation();

      router.init(routerConfig);
      router.redirect(url, options);

      expect(router.route).toHaveBeenCalledWith(
        path,
        options,
        {
          type: ActionTypes.REDIRECT,
          event: undefined,
          url: 'http://locahlost:3002/somePath',
        },
        {}
      );
      expect(window.redirect).not.toHaveBeenCalledWith(url);
    });
  });

  describe('route method', () => {
    it('should call handleError for throwing error in super.router', async () => {
      vi.spyOn(router, 'handleError').mockReturnValue(Promise.resolve());

      await router.route('/something').then(() => {
        expect(router.handleError).toHaveBeenCalled();
      });
    });
  });

  describe('handleNotFound method', () => {
    it('should be call router.handleError function for throwing error', async () => {
      vi.spyOn(router, 'handleError').mockReturnValue(
        Promise.resolve({ status: 'ok' })
      );

      await router.handleNotFound({ path: '/path' }).then(() => {
        expect(router.handleError).toHaveBeenCalled();
      });
    });
  });

  describe('_isSameDomain method', () => {
    it('should be return true for same domain', () => {
      const path = '/somePath';
      const url = protocol + '//' + host + path;

      expect(router._isSameDomain(url)).toBeTruthy();
    });

    it('should be retrun false for strange domain with query for same domain', () => {
      const path = '/somePath';
      const url =
        protocol +
        '//' +
        'www.strangeDomain.com' +
        path +
        '?redirect=' +
        protocol +
        '//' +
        host +
        path;

      expect(router._isSameDomain(url)).toBeFalsy();
    });

    it('should be retrun false for strange domain', () => {
      const path = '/somePath';
      const url = protocol + '//' + 'www.strangeDomain.com' + path;

      expect(router._isSameDomain(url)).toBeFalsy();
    });
  });

  describe('_isHashLink method', () => {
    [
      {
        targetUrl: 'http://localhost/aaa#hash',
        baseUrl: 'http://localhost/aaa',
        result: true,
      },
      {
        targetUrl: 'http://localhost/bbb#hash',
        baseUrl: 'http://localhost/aaa',
        result: false,
      },
      {
        targetUrl: 'http://localhost/aaa',
        baseUrl: 'http://localhost/aaa',
        result: false,
      },
    ].forEach((value: Record<string, unknown>) => {
      it(
        'should be for ' +
          value.targetUrl +
          ' and base url ' +
          value.baseUrl +
          ' return ' +
          value.result,
        () => {
          vi.spyOn(window, 'getUrl').mockReturnValue(value.baseUrl as string);

          expect(router._isHashLink(value.targetUrl as string)).toStrictEqual(
            value.result
          );
        }
      );
    });
  });
});
