import Dispatcher from 'src/event/Dispatcher';
import PageManager from 'src/page/manager/PageManager';
import Request from '../Request';
import Response from '../Response';
import RouteFactory from '../RouteFactory';
import ServerRouter from '../ServerRouter';

describe('ima.core.router.ServerRouter', () => {
  var router = null;
  var pageRenderer = null;
  var routeFactory = null;
  var dispatcher = null;
  var request = null;
  var response = null;
  var domain = 'http://locahlost:3002';

  beforeEach(() => {
    pageRenderer = new PageManager();
    routeFactory = new RouteFactory();
    dispatcher = new Dispatcher();
    request = new Request();
    response = new Response();
    router = new ServerRouter(
      pageRenderer,
      routeFactory,
      dispatcher,
      request,
      response
    );
    router.init({ mode: router.MODE_SERVER, domain: domain });
  });

  it('should be return actual path', () => {
    jest.spyOn(request, 'getPath').mockReturnValue('');

    router.getPath();

    expect(request.getPath).toHaveBeenCalled();
  });

  it('should be redirect to url', () => {
    var url = domain + '/redirectUrl';
    var options = { httpStatus: 303 };

    jest.spyOn(response, 'redirect').mockImplementation();

    router.redirect(url, options);

    expect(response.redirect).toHaveBeenCalledWith(url, 303);
  });
});
