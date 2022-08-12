import Dispatcher from 'src/event/Dispatcher';
import PageManager from 'src/page/manager/PageManager';
import ActionTypes from '../ActionTypes';
import ClientRouter from '../ClientRouter';
import RouteFactory from '../RouteFactory';
import Window from 'src/window/Window';

describe('ima.core.router.ClientRouter', () => {
  let router = null;
  let pageRenderer = null;
  let routeFactory = null;
  let dispatcher = null;
  let window = null;
  let host = 'locahlost:3002';
  let protocol = 'http:';

  beforeEach(() => {
    pageRenderer = new PageManager();
    routeFactory = new RouteFactory();
    dispatcher = new Dispatcher();
    window = new Window();
    router = new ClientRouter(pageRenderer, routeFactory, dispatcher, window);

    jest.spyOn(router, 'getPath').mockReturnValue('/routePath');

    router.init({ $Host: host, $Protocol: protocol });
  });

  it('should be return actual path', () => {
    router.getPath.mockRestore();
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

    expect(window.bindEventListener.calls.count()).toBe(2);
  });

  it('should remove listener to popState event, click event', () => {
    jest.spyOn(window, 'unbindEventListener').mockImplementation();

    router.unlisten();

    expect(window.unbindEventListener.calls.count()).toBe(2);
  });

  describe('redirect method', () => {
    it('redirect to a new page', () => {
      let path = '/somePath';
      let url = protocol + '//' + host + path;
      let options = { httpStatus: 302 };

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
      let url = 'http://example.com/somePath';

      jest.spyOn(window, 'redirect').mockImplementation();

      router.redirect(url);

      expect(window.redirect).toHaveBeenCalledWith(url);
    });
  });

  describe('route method', () => {
    it('should call handleError for throwing error in super.router', done => {
      jest.spyOn(router, 'handleError').mockReturnValue(Promise.resolve());

      router.route('/something').then(() => {
        expect(router.handleError).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('handleNotFound method', () => {
    it('should be call router.handleError function for throwing error', done => {
      jest.spyOn(router, 'handleError').mockReturnValue(Promise.resolve('ok'));

      router.handleNotFound({ path: '/path' }).then(() => {
        expect(router.handleError).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('_isSameDomain method', () => {
    it('should be return true for same domain', () => {
      let path = '/somePath';
      let url = protocol + '//' + host + path;

      expect(router._isSameDomain(url)).toBeTruthy();
    });

    it('should be retrun false for strange domain with query for same domain', () => {
      let path = '/somePath';
      let url =
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
      let path = '/somePath';
      let url = protocol + '//' + 'www.strangeDomain.com' + path;

      expect(router._isSameDomain(url)).toBeFalsy();
    });
  });

  describe('_isHashLink method', () => {
    using(
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
      ],
      value => {
        it(
          'should be for ' +
            value.targetUrl +
            ' and base url ' +
            value.baseUrl +
            ' return ' +
            value.result,
          () => {
            jest.spyOn(window, 'getUrl').mockReturnValue(value.baseUrl);

            expect(router._isHashLink(value.targetUrl)).toStrictEqual(
              value.result
            );
          }
        );
      }
    );
  });
});
