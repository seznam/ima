import Dispatcher from 'event/Dispatcher';
import PageManager from 'page/manager/PageManager';
import ActionTypes from 'router/ActionTypes';
import ClientRouter from 'router/ClientRouter';
import RouteFactory from 'router/RouteFactory';
import Window from 'window/Window';

describe('ima.router.ClientRouter', () => {
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

    spyOn(router, 'getPath').and.returnValue('/routePath');

    router.init({ $Host: host, $Protocol: protocol });
  });

  it('should be return actual path', () => {
    router.getPath.and.callThrough();
    spyOn(window, 'getPath').and.returnValue('');

    router.getPath();

    expect(window.getPath).toHaveBeenCalled();
  });

  it('should be return actual url', () => {
    spyOn(window, 'getUrl').and.stub();

    router.getUrl();

    expect(window.getUrl).toHaveBeenCalled();
  });

  it('should add listener to popState event, click event', () => {
    spyOn(window, 'bindEventListener').and.stub();

    router.listen();

    expect(window.bindEventListener.calls.count()).toEqual(2);
  });

  describe('redirect method', () => {
    it('redirect to a new page', () => {
      let path = '/somePath';
      let url = protocol + '//' + host + path;
      let options = { httpStatus: 302 };

      spyOn(router, 'route').and.stub();

      router.redirect(url, options);

      expect(router.route).toHaveBeenCalledWith(path, options, {
        type: ActionTypes.REDIRECT,
        event: undefined,
        url: 'http://locahlost:3002/somePath'
      });
    });

    it('return null for non exist route', () => {
      let url = 'http://example.com/somePath';

      spyOn(window, 'redirect').and.stub();

      router.redirect(url);

      expect(window.redirect).toHaveBeenCalledWith(url);
    });
  });

  describe('route method', () => {
    it('should call handleError for throwing error in super.router', done => {
      spyOn(router, 'handleError').and.returnValue(Promise.resolve());

      router.route('/something').then(() => {
        expect(router.handleError).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('handleNotFound method', () => {
    it('should be call router.handleError function for throwing error', done => {
      spyOn(router, 'handleError').and.returnValue(Promise.resolve('ok'));

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

      expect(router._isSameDomain(url)).toEqual(true);
    });

    it('should be retrun false for strange domain', () => {
      let path = '/somePath';
      let url = protocol + '//' + 'www.strangeDomain.com' + path;

      expect(router._isSameDomain(url)).toEqual(false);
    });
  });

  describe('_isHashLink method', () => {
    using(
      [
        {
          targetUrl: 'http://localhost/aaa#hash',
          baseUrl: 'http://localhost/aaa',
          result: true
        },
        {
          targetUrl: 'http://localhost/bbb#hash',
          baseUrl: 'http://localhost/aaa',
          result: false
        },
        {
          targetUrl: 'http://localhost/aaa',
          baseUrl: 'http://localhost/aaa',
          result: false
        }
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
            spyOn(window, 'getUrl').and.returnValue(value.baseUrl);

            expect(router._isHashLink(value.targetUrl)).toEqual(value.result);
          }
        );
      }
    );
  });
});
