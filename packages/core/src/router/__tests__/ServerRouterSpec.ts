import { toMockedInstance } from 'to-mock';

import { Dispatcher } from '../../event/Dispatcher';
import { PageManager } from '../../page/manager/PageManager';
import { Request } from '../Request';
import { Response } from '../Response';
import { RouteFactory } from '../RouteFactory';
import { ServerRouter } from '../ServerRouter';

describe('ima.core.router.ServerRouter', () => {
  let router: ServerRouter;
  let request: Request;
  let response: Response;
  const pageRenderer = toMockedInstance(PageManager);
  const routeFactory = toMockedInstance(RouteFactory);
  const dispatcher = toMockedInstance(Dispatcher);
  const domain = 'http://locahlost:3002';

  const routerConfig = {
    $Protocol: 'http:',
    $Root: '',
    $LanguagePartPath: '',
    $Host: 'www.domain.com',
  };

  beforeEach(() => {
    request = new Request();
    response = new Response();
    router = new ServerRouter(
      pageRenderer,
      routeFactory,
      dispatcher,
      request,
      response,
      30000
    );
    router.init(routerConfig);
  });

  it('should be return actual path', () => {
    jest.spyOn(request, 'getPath').mockReturnValue('');

    router.getPath();

    expect(request.getPath).toHaveBeenCalled();
  });

  it('should be redirect to url', () => {
    const url = domain + '/redirectUrl';
    const options = {
      httpStatus: 303,
      headers: { 'Custom-header': 'Some custom value' },
    };

    jest.spyOn(response, 'redirect').mockImplementation();

    router.redirect(url, options);

    expect(response.redirect).toHaveBeenCalledWith(url, {
      httpStatus: 303,
      headers: {
        'Custom-header': 'Some custom value',
      },
    });
  });
});
