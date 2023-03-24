/**
 * @jest-environment jsdom
 */

import { toMockedInstance } from 'to-mock';

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

  beforeEach(() => {
    router = new ClientRouter(
      pageRenderer,
      routeFactory,
      dispatcher,
      window,
      30000
    );

    jest.spyOn(router, 'getPath').mockReturnValue('/routePath');

    router.init(routerConfig);
  });

  it('should return actual path', () => {
    jest.restoreAllMocks();
    jest.spyOn(window, 'getPath').mockReturnValue('');

    router.getPath();

    expect(window.getPath).toHaveBeenCalled();
  });

  it('should be return actual url', () => {
    jest.spyOn(window, 'getUrl').mockImplementation();

    router.getUrl();

    expect(window.getUrl).toHaveBeenCalled();
  });

  it('should add listener to popState event, click event', () => {
    jest.spyOn(window, 'bindEventListener').mockImplementation();

    router.listen();

    expect(window.bindEventListener).toHaveBeenCalledTimes(2);
  });

  it('should remove listener to popState event, click event', () => {
    jest.spyOn(window, 'unbindEventListener').mockImplementation();

    router.unlisten();

    expect(window.unbindEventListener).toHaveBeenCalledTimes(2);
  });

  describe('redirect method', () => {
    it('redirect to a new page', () => {
      const path = '/somePath';
      const url = protocol + '//' + host + path;
      const options = { httpStatus: 302 };

      jest.spyOn(router, 'route').mockImplementation();

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
      const url = 'http://example.com/somePath';

      jest.spyOn(window, 'redirect').mockImplementation();

      router.redirect(url);

      expect(window.redirect).toHaveBeenCalledWith(url);
    });
  });

  describe('route method', () => {
    it('should call handleError for throwing error in super.router', async () => {
      jest.spyOn(router, 'handleError').mockReturnValue(Promise.resolve());

      await router.route('/something').then(() => {
        expect(router.handleError).toHaveBeenCalled();
      });
    });
  });

  describe('preManage', () => {
    it('should await mounted promise after first manage call to prevent hydrate error', async () => {
      expect(router['_mountedPromise']).toBeNull();
      await router._preManage();

      // Should create promise after first call
      expect(router['_mountedPromise']?.promise).toBeInstanceOf(Promise);

      router['_mountedPromise'] = {
        // @ts-expect-error
        promise: Promise.resolve('mounted'),
      };

      // Should await promise
      await expect(router._preManage()).resolves.toEqual([
        undefined,
        'mounted',
      ]);
    });
  });

  describe('handleNotFound method', () => {
    it('should be call router.handleError function for throwing error', async () => {
      jest
        .spyOn(router, 'handleError')
        .mockReturnValue(Promise.resolve({ status: 'ok' }));

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
          jest.spyOn(window, 'getUrl').mockReturnValue(value.baseUrl as string);

          expect(router._isHashLink(value.targetUrl as string)).toStrictEqual(
            value.result
          );
        }
      );
    });
  });
});
